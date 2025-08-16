# 🚀 **PANDUAN SETUP HOSTING FITLIFE GYM**

## 📋 **Persyaratan Hosting**

### **🔧 Server Requirements:**
- **PHP**: 7.4 atau lebih tinggi
- **MySQL**: 5.7 atau lebih tinggi (atau MariaDB 10.2+)
- **Web Server**: Apache atau Nginx
- **SSL Certificate**: HTTPS (wajib untuk keamanan)

### **📦 Hosting yang Direkomendasikan:**
- **Shared Hosting**: Hostinger, Niagahoster, IDCloudHost
- **VPS**: DigitalOcean, Linode, Vultr
- **Cloud**: AWS, Google Cloud, Azure

## 🗄️ **Setup Database**

### **1. Buat Database MySQL**
```sql
-- Login ke phpMyAdmin atau MySQL CLI
-- Buat database baru
CREATE DATABASE fitlife_gym;
USE fitlife_gym;

-- Import file database.sql yang sudah dibuat
-- Atau jalankan query satu per satu
```

### **2. Buat User Database**
```sql
-- Buat user khusus untuk aplikasi
CREATE USER 'fitlife_user'@'localhost' IDENTIFIED BY 'PASSWORD_YANG_AMAN';
GRANT SELECT, INSERT, UPDATE, DELETE ON fitlife_gym.* TO 'fitlife_user'@'localhost';
FLUSH PRIVILEGES;
```

### **3. Import Struktur Database**
```bash
# Upload file database.sql ke hosting
# Jalankan melalui phpMyAdmin atau MySQL CLI
mysql -u fitlife_user -p fitlife_gym < database.sql
```

## ⚙️ **Konfigurasi Aplikasi**

### **1. Update Database Config**
Edit file `config/database.php`:
```php
// Ganti dengan kredensial hosting Anda
define('DB_HOST', 'localhost');           // Host database
define('DB_NAME', 'fitlife_gym');         // Nama database
define('DB_USER', 'fitlife_user');        // Username database
define('DB_PASS', 'PASSWORD_ANDA');       // Password database
```

### **2. Set Permission File**
```bash
# Set permission yang benar
chmod 644 config/database.php
chmod 644 api/*.php
chmod 755 admin/
chmod 644 *.html
chmod 644 *.css
chmod 644 *.js
```

### **3. Disable Debug Mode (Production)**
Edit file `config/database.php`:
```php
// Ganti dari true ke false untuk production
define('DEBUG_MODE', false);
```

## 📁 **Upload File ke Hosting**

### **1. Struktur File yang Diupload:**
```
public_html/
├── index.html              # Website utama
├── style.css               # Styling
├── script.js               # JavaScript
├── order.txt               # File contoh
├── README.md               # Dokumentasi
├── HOSTING_SETUP.md        # Panduan ini
├── config/
│   └── database.php        # Konfigurasi database
├── api/
│   ├── save_order.php      # API simpan pesanan
│   └── get_orders.php      # API ambil data
└── admin/
    └── index.html          # Panel admin
```

### **2. Upload via FTP/File Manager:**
- Gunakan **FileZilla** atau **cPanel File Manager**
- Upload semua file ke folder `public_html`
- Pastikan struktur folder tetap sama

## 🔐 **Keamanan**

### **1. Password Database**
- Gunakan password yang **kuat dan unik**
- Minimal 12 karakter dengan kombinasi huruf, angka, simbol
- Jangan gunakan password default

### **2. File Permissions**
- `config/database.php`: 644 (read-only untuk public)
- `api/*.php`: 644
- Folder: 755

### **3. SSL Certificate**
- **Wajib** untuk production
- Lindungi data customer
- HTTPS untuk semua request

### **4. Admin Panel**
- Akses admin panel: `https://domain.com/admin/login.html`
- **Username**: `admin`
- **Password**: `user123`
- Login otomatis expire setelah 24 jam
- Tombol logout tersedia di header

## 🧪 **Testing Setup**

### **1. Test Koneksi Database**
Buat file `test_db.php`:
```php
<?php
require_once 'config/database.php';
echo "Database connected successfully!";
?>
```

### **2. Test API Endpoints**
```bash
# Test save order
curl -X POST https://domain.com/api/save_order.php \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test","customer_phone":"08123456789","customer_email":"test@email.com","plan_type":"Basic","plan_details":"Basic - Rp 299.000/bulan","duration":3,"base_price":299000,"total_price":897000,"discount_percent":5,"final_price":852150}'

# Test get orders
curl https://domain.com/api/get_orders.php
```

### **3. Test Website**
- Buka `https://domain.com`
- Test form pemesanan
- Cek apakah data tersimpan di database
- Buka panel admin: `https://domain.com/admin/login.html`
- Login dengan username: `admin`, password: `user123`

## 📊 **Monitoring dan Maintenance**

### **1. Log Files**
```bash
# Cek error log
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log

# Cek PHP error log
tail -f /var/log/php/error.log
```

### **2. Database Backup**
```bash
# Backup otomatis (cron job)
mysqldump -u fitlife_user -p fitlife_gym > backup_$(date +%Y%m%d).sql

# Atau gunakan fitur backup hosting
```

### **3. Performance Monitoring**
- Monitor response time API
- Cek penggunaan database
- Optimasi query jika diperlukan

## 🚨 **Troubleshooting**

### **1. Database Connection Error**
```php
// Cek error di config/database.php
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    echo "Connected successfully";
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
```

### **2. API Not Working**
- Cek file permission
- Cek error log
- Test dengan Postman/curl
- Pastikan URL path benar

### **3. Admin Panel Error**
- Cek console browser (F12)
- Cek network tab untuk API calls
- Pastikan CORS headers benar

## 📱 **Fitur yang Tersedia Setelah Setup**

### **✅ Website Utama:**
- Form pemesanan membership
- Kalkulasi harga otomatis
- Integrasi WhatsApp
- Download file JSON/TXT

### **✅ Database Storage:**
- Data tersimpan permanen di server
- Tidak hilang saat refresh
- Backup otomatis
- Data aman dan terstruktur

### **✅ Panel Admin:**
- Lihat semua pesanan
- Filter dan search
- Update status pesanan
- Statistik dan analytics
- Export data

### **✅ API Endpoints:**
- `POST /api/save_order.php` - Simpan pesanan
- `GET /api/get_orders.php` - Ambil data pesanan
- `POST /api/update_status.php` - Update status

## 🔄 **Update dan Maintenance**

### **1. Update Website**
- Upload file baru via FTP
- Backup database sebelum update
- Test di staging environment

### **2. Database Migration**
- Backup data lama
- Jalankan script migration
- Test data integrity

### **3. Security Updates**
- Update PHP version
- Update dependencies
- Monitor security advisories

## 📞 **Support dan Bantuan**

### **Jika Ada Masalah:**
1. **Cek error log** terlebih dahulu
2. **Test koneksi database** dengan file test
3. **Verifikasi file permission**
4. **Cek URL dan path** file
5. **Test API** dengan Postman/curl

### **Contact Information:**
- **WhatsApp**: 6287734662869
- **Email**: info@fitlifegym.com

---

## 🎯 **Checklist Setup Hosting**

- [ ] Upload semua file ke hosting
- [ ] Buat database MySQL
- [ ] Import struktur database
- [ ] Update konfigurasi database
- [ ] Set file permissions
- [ ] Test koneksi database
- [ ] Test API endpoints
- [ ] Test website utama
- [ ] Test panel admin
- [ ] Setup SSL certificate
- [ ] Test WhatsApp integration
- [ ] Backup database
- [ ] Monitor error logs

**🎉 Selamat! Website FitLife Gym sudah siap dengan database dan bisa diakses online!**
