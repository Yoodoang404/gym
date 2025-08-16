<?php
// ========================================
// API SAVE ORDER - FITLIFE GYM
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
$requiredFields = ['customer_name', 'customer_phone', 'customer_email', 'plan_type', 'plan_details', 'duration', 'base_price', 'total_price', 'discount_percent', 'final_price'];
$missingFields = [];

foreach ($requiredFields as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    sendResponse(false, 'Missing required fields: ' . implode(', ', $missingFields), null, 400);
}

// Sanitize and validate input
$customerName = sanitizeInput($input['customer_name']);
$customerPhone = sanitizeInput($input['customer_phone']);
$customerEmail = sanitizeInput($input['customer_email']);
$planType = sanitizeInput($input['plan_type']);
$planDetails = sanitizeInput($input['plan_details']);
$duration = intval($input['duration']);
$basePrice = floatval($input['base_price']);
$totalPrice = floatval($input['total_price']);
$discountPercent = floatval($input['discount_percent']);
$finalPrice = floatval($input['final_price']);
$customerMessage = isset($input['customer_message']) ? sanitizeInput($input['customer_message']) : '';
$orderId = isset($input['order_id']) ? sanitizeInput($input['order_id']) : generateOrderId();

// Validate email
if (!validateEmail($customerEmail)) {
    sendResponse(false, 'Invalid email format', null, 400);
}

// Validate phone
if (!validatePhone($customerPhone)) {
    sendResponse(false, 'Invalid phone number format', null, 400);
}

// Validate plan type
$validPlanTypes = ['Basic', 'Premium', 'VIP'];
if (!in_array($planType, $validPlanTypes)) {
    sendResponse(false, 'Invalid plan type', null, 400);
}

// Validate duration
if ($duration < 1 || $duration > 24) {
    sendResponse(false, 'Invalid duration (must be 1-24 months)', null, 400);
}

// Validate prices
if ($basePrice <= 0 || $totalPrice <= 0 || $finalPrice <= 0) {
    sendResponse(false, 'Invalid price values', null, 400);
}

// Validate discount
if ($discountPercent < 0 || $discountPercent > 100) {
    sendResponse(false, 'Invalid discount percentage', null, 400);
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Check if order_id already exists
    $stmt = $pdo->prepare("SELECT id FROM orders WHERE order_id = ?");
    $stmt->execute([$orderId]);
    
    if ($stmt->fetch()) {
        sendResponse(false, 'Order ID already exists', null, 409);
    }
    
    // Insert new order
    $sql = "INSERT INTO orders (
        order_id, customer_name, customer_phone, customer_email,
        plan_type, plan_details, duration, base_price, total_price,
        discount_percent, final_price, customer_message, status, whatsapp_sent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', TRUE)";
    
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([
        $orderId, $customerName, $customerPhone, $customerEmail,
        $planType, $planDetails, $duration, $basePrice, $totalPrice,
        $discountPercent, $finalPrice, $customerMessage
    ]);
    
    if ($result) {
        $orderId = $pdo->lastInsertId();
        
        // Get the inserted order
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();
        
        // Log the order
        error_log("New order saved: " . json_encode($order));
        
        // Send success response
        sendResponse(true, 'Order saved successfully', [
            'order_id' => $order['order_id'],
            'id' => $order['id'],
            'status' => $order['status'],
            'created_at' => $order['created_at']
        ], 201);
        
    } else {
        sendResponse(false, 'Failed to save order', null, 500);
    }
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    sendResponse(false, 'Database error occurred', null, 500);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    sendResponse(false, 'An error occurred', null, 500);
}

// Generate unique order ID
function generateOrderId() {
    $timestamp = time();
    $random = mt_rand(100, 999);
    return "GYM-{$timestamp}-{$random}";
}
?>
