<?php
// ========================================
// API GET ORDERS - FITLIFE GYM
// ========================================

// Enable debug mode for development
define('DEBUG_MODE', true);

// Include database configuration
require_once '../config/database.php';

// Check if it's a GET request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(false, 'Method not allowed', null, 405);
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Get query parameters
    $status = isset($_GET['status']) ? sanitizeInput($_GET['status']) : null;
    $planType = isset($_GET['plan_type']) ? sanitizeInput($_GET['plan_type']) : null;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
    $orderBy = isset($_GET['order_by']) ? sanitizeInput($_GET['order_by']) : 'created_at';
    $orderDir = isset($_GET['order_dir']) ? sanitizeInput($_GET['order_dir']) : 'DESC';
    
    // Validate limit and offset
    if ($limit < 1 || $limit > 1000) {
        $limit = 100;
    }
    if ($offset < 0) {
        $offset = 0;
    }
    
    // Validate order by
    $allowedOrderBy = ['id', 'order_id', 'customer_name', 'plan_type', 'final_price', 'status', 'created_at'];
    if (!in_array($orderBy, $allowedOrderBy)) {
        $orderBy = 'created_at';
    }
    
    // Validate order direction
    $orderDir = strtoupper($orderDir) === 'ASC' ? 'ASC' : 'DESC';
    
    // Build WHERE clause
    $whereConditions = [];
    $params = [];
    
    if ($status) {
        $validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
        if (in_array($status, $validStatuses)) {
            $whereConditions[] = "status = ?";
            $params[] = $status;
        }
    }
    
    if ($planType) {
        $validPlanTypes = ['Basic', 'Premium', 'VIP'];
        if (in_array($planType, $validPlanTypes)) {
            $whereConditions[] = "plan_type = ?";
            $params[] = $planType;
        }
    }
    
    $whereClause = '';
    if (!empty($whereConditions)) {
        $whereClause = 'WHERE ' . implode(' AND ', $whereConditions);
    }
    
    // Build SQL query
    $sql = "SELECT 
                id, order_id, customer_name, customer_phone, customer_email,
                plan_type, plan_details, duration, base_price, total_price,
                discount_percent, final_price, customer_message, status,
                whatsapp_sent, created_at, updated_at
            FROM orders 
            {$whereClause}
            ORDER BY {$orderBy} {$orderDir}
            LIMIT ? OFFSET ?";
    
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll();
    
    // Get total count for pagination
    $countSql = "SELECT COUNT(*) as total FROM orders {$whereClause}";
    $countStmt = $pdo->prepare($countSql);
    
    if (!empty($whereConditions)) {
        $countStmt->execute(array_slice($params, 0, -2));
    } else {
        $countStmt->execute();
    }
    
    $totalCount = $countStmt->fetch()['total'];
    
    // Get statistics
    $statsSql = "SELECT * FROM order_statistics";
    $statsStmt = $pdo->prepare($statsSql);
    $statsStmt->execute();
    $statistics = $statsStmt->fetch();
    
    // Get popular plans
    $popularSql = "SELECT * FROM popular_plans";
    $popularStmt = $pdo->prepare($popularSql);
    $popularStmt->execute();
    $popularPlans = $popularStmt->fetchAll();
    
    // Format response data
    $formattedOrders = [];
    foreach ($orders as $order) {
        $formattedOrders[] = [
            'id' => $order['id'],
            'order_id' => $order['order_id'],
            'customer' => [
                'name' => $order['customer_name'],
                'phone' => $order['customer_phone'],
                'email' => $order['customer_email']
            ],
            'order' => [
                'plan_type' => $order['plan_type'],
                'plan_details' => $order['plan_details'],
                'duration' => intval($order['duration']),
                'base_price' => floatval($order['base_price']),
                'total_price' => floatval($order['total_price']),
                'discount_percent' => floatval($order['discount_percent']),
                'final_price' => floatval($order['final_price']),
                'message' => $order['customer_message']
            ],
            'status' => $order['status'],
            'whatsapp_sent' => (bool)$order['whatsapp_sent'],
            'created_at' => $order['created_at'],
            'updated_at' => $order['updated_at']
        ];
    }
    
    // Send success response
    sendResponse(true, 'Orders retrieved successfully', [
        'orders' => $formattedOrders,
        'pagination' => [
            'total' => intval($totalCount),
            'limit' => $limit,
            'offset' => $offset,
            'has_more' => ($offset + $limit) < $totalCount
        ],
        'statistics' => [
            'total_orders' => intval($statistics['total_orders']),
            'total_revenue' => floatval($statistics['total_revenue']),
            'avg_duration' => floatval($statistics['avg_duration']),
            'pending_orders' => intval($statistics['pending_orders']),
            'confirmed_orders' => intval($statistics['confirmed_orders']),
            'completed_orders' => intval($statistics['completed_orders']),
            'cancelled_orders' => intval($statistics['cancelled_orders'])
        ],
        'popular_plans' => $popularPlans
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    sendResponse(false, 'Database error occurred', null, 500);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    sendResponse(false, 'An error occurred', null, 500);
}
?>
