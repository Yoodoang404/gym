<?php
// ========================================
// API UPDATE ORDER STATUS - FITLIFE GYM
// ========================================

// Enable debug mode for development
define('DEBUG_MODE', true);

// Include database configuration
require_once '../config/database.php';

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!$input) {
    sendResponse(false, 'Invalid JSON input', null, 400);
}

// Required fields
if (!isset($input['order_id']) || !isset($input['status'])) {
    sendResponse(false, 'Missing required fields: order_id and status', null, 400);
}

// Sanitize and validate input
$orderId = intval($input['order_id']);
$newStatus = sanitizeInput($input['status']);

// Validate status
$validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
if (!in_array($newStatus, $validStatuses)) {
    sendResponse(false, 'Invalid status. Must be one of: ' . implode(', ', $validStatuses), null, 400);
}

// Validate order ID
if ($orderId <= 0) {
    sendResponse(false, 'Invalid order ID', null, 400);
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Check if order exists
    $stmt = $pdo->prepare("SELECT id, order_id, status FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();
    
    if (!$order) {
        sendResponse(false, 'Order not found', null, 404);
    }
    
    // Check if status is already the same
    if ($order['status'] === $newStatus) {
        sendResponse(false, 'Order status is already ' . $newStatus, null, 400);
    }
    
    // Update order status
    $sql = "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([$newStatus, $orderId]);
    
    if ($result) {
        // Get updated order
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$orderId]);
        $updatedOrder = $stmt->fetch();
        
        // Log the status change
        error_log("Order status updated: ID {$orderId} from {$order['status']} to {$newStatus}");
        
        // Send success response
        sendResponse(true, 'Order status updated successfully', [
            'order_id' => $updatedOrder['order_id'],
            'id' => $updatedOrder['id'],
            'old_status' => $order['status'],
            'new_status' => $updatedOrder['status'],
            'updated_at' => $updatedOrder['updated_at']
        ]);
        
    } else {
        sendResponse(false, 'Failed to update order status', null, 500);
    }
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    sendResponse(false, 'Database error occurred', null, 500);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    sendResponse(false, 'An error occurred', null, 500);
}
?>
