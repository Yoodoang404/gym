-- ========================================
-- DATABASE SETUP UNTUK FITLIFE GYM
-- ========================================

-- Buat database
CREATE DATABASE IF NOT EXISTS fitlife_gym;
USE fitlife_gym;

-- Buat tabel orders
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    plan_type ENUM('Basic', 'Premium', 'VIP') NOT NULL,
    plan_details TEXT NOT NULL,
    duration INT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    final_price DECIMAL(10,2) NOT NULL,
    customer_message TEXT,
    status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Buat tabel settings (untuk konfigurasi)
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES
('whatsapp_number', '6287734662869'),
('gym_name', 'FitLife Gym'),
('gym_address', 'Jl. Gym Street No. 123'),
('gym_phone', '021-1234567'),
('gym_email', 'info@fitlifegym.com'),
('currency', 'IDR'),
('tax_percent', '0'),
('admin_email', 'admin@fitlifegym.com');

-- Buat index untuk performa
CREATE INDEX idx_order_id ON orders(order_id);
CREATE INDEX idx_customer_phone ON orders(customer_phone);
CREATE INDEX idx_status ON orders(status);
CREATE INDEX idx_created_at ON orders(created_at);

-- Buat view untuk statistik
CREATE VIEW order_statistics AS
SELECT 
    COUNT(*) as total_orders,
    SUM(final_price) as total_revenue,
    AVG(duration) as avg_duration,
    COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_orders,
    COUNT(CASE WHEN status = 'Confirmed' THEN 1 END) as confirmed_orders,
    COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled_orders
FROM orders;

-- Buat view untuk paket terpopuler
CREATE VIEW popular_plans AS
SELECT 
    plan_type,
    COUNT(*) as order_count,
    SUM(final_price) as total_revenue
FROM orders 
GROUP BY plan_type 
ORDER BY order_count DESC;

-- Insert sample data (opsional)
INSERT INTO orders (
    order_id, customer_name, customer_phone, customer_email,
    plan_type, plan_details, duration, base_price, total_price,
    discount_percent, final_price, customer_message, status, whatsapp_sent
) VALUES
(
    'GYM-1703123456789-123',
    'John Doe',
    '08123456789',
    'john@email.com',
    'Premium',
    'Premium - Rp 499.000/bulan (Terpopuler)',
    6,
    499000.00,
    2994000.00,
    10.00,
    2694600.00,
    'Mau mulai bulan depan',
    'Pending',
    TRUE
),
(
    'GYM-1703123456789-456',
    'Jane Smith',
    '08765432109',
    'jane@email.com',
    'Basic',
    'Basic - Rp 299.000/bulan',
    3,
    299000.00,
    897000.00,
    5.00,
    852150.00,
    'Trial membership dulu',
    'Pending',
    TRUE
);

-- Buat user untuk aplikasi (ganti password sesuai kebutuhan)
-- CREATE USER 'fitlife_user'@'localhost' IDENTIFIED BY 'password123';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON fitlife_gym.* TO 'fitlife_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Tampilkan struktur tabel
DESCRIBE orders;
DESCRIBE settings;

-- Tampilkan sample data
SELECT * FROM orders LIMIT 5;
SELECT * FROM settings;

-- Tampilkan statistik
SELECT * FROM order_statistics;
SELECT * FROM popular_plans;
