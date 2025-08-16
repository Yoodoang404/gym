<?php
// ========================================
// DATABASE CONFIGURATION
// ========================================

// Database credentials
define('DB_HOST', 'localhost');        // Ganti dengan host database Anda
define('DB_NAME', 'fitlife_gym');      // Nama database
define('DB_USER', 'fitlife_user');     // Username database
define('DB_PASS', 'password123');      // Password database (GANTI!)

// Database connection class
class Database {
    private $connection;
    private static $instance = null;
    
    private function __construct() {
        try {
            $this->connection = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }
    
    // Singleton pattern
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    // Get database connection
    public function getConnection() {
        return $this->connection;
    }
    
    // Close connection
    public function closeConnection() {
        $this->connection = null;
    }
}

// Test connection
try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    // echo "Database connected successfully!";
} catch (Exception $e) {
    die("Connection failed: " . $e->getMessage());
}

// Helper functions
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhone($phone) {
    // Remove all non-numeric characters
    $phone = preg_replace('/[^0-9]/', '', $phone);
    // Check if phone number is valid (min 10 digits, max 15 digits)
    return strlen($phone) >= 10 && strlen($phone) <= 15;
}

// Response helper
function sendResponse($success, $message, $data = null, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    
    $response = [
        'success' => $success,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// Error handler
function handleError($errno, $errstr, $errfile, $errline) {
    $error = [
        'type' => $errno,
        'message' => $errstr,
        'file' => $errfile,
        'line' => $errline
    ];
    
    error_log("Error: " . json_encode($error));
    
    if (defined('DEBUG_MODE') && DEBUG_MODE) {
        sendResponse(false, "Error: $errstr", $error, 500);
    } else {
        sendResponse(false, "Terjadi kesalahan sistem", null, 500);
    }
}

// Set error handler
set_error_handler('handleError');

// Enable error reporting for development (disable in production)
if (defined('DEBUG_MODE') && DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// CORS headers (if needed)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
