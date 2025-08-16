# 🏋️‍♂️ **Website Membership Gym - FitLife Gym**

Website modern untuk membeli membership gym dengan integrasi WhatsApp dan sistem penyimpanan data pesanan.

## ✨ **Fitur Utama**

### 🛒 **Sistem Pemesanan**
- 3 paket membership: Basic, Premium, VIP
- Kalkulasi harga otomatis dengan diskon
- Form pemesanan lengkap dengan validasi
- Modal konfirmasi pesanan

### 📱 **Integrasi WhatsApp**
- Notifikasi otomatis ke nomor: **6287734662869**
- Pesan langsung dari tombol "Pesan Sekarang"
- Form pemesanan lengkap dengan detail customer
- Pesan terformat rapi dan informatif

### 💾 **Sistem Penyimpanan Data**
- **Local Storage**: Data tersimpan di browser pengguna
- **Server Database**: Data tersimpan permanen di MySQL database
- **File Download**: Setiap pesanan otomatis download sebagai file JSON dan TXT
- **Export All**: Export semua data pesanan dalam satu file JSON atau TXT
- **Copy to Clipboard**: Data pesanan otomatis di-copy untuk paste ke file order.txt
- **Data Panel**: Panel khusus untuk melihat semua pesanan
- **Console Log**: Log lengkap untuk debugging

## 🗄️ **Struktur Data Pesanan**

Setiap pesanan tersimpan dengan format:

```json
{
  "id": "GYM-1703123456789-123",
  "timestamp": "2023-12-21T10:30:56.789Z",
  "customer": {
    "name": "Nama Customer",
    "phone": "08123456789",
    "email": "customer@email.com"
  },
  "order": {
    "plan": "Premium",
    "planDetails": "Premium - Rp 499.000/bulan (Terpopuler)",
    "duration": 6,
    "basePrice": 499000,
    "totalPrice": 2994000,
    "discount": 0.1,
    "finalPrice": 2694600,
    "message": "Pesan tambahan customer"
  },
  "status": "Pending",
  "whatsappSent": true
}
```

## 📊 **Cara Mengakses Data Pesanan**

### 1. **Tombol Panel Data** (📊)
- Klik tombol merah bulat di pojok kiri atas
- Panel akan muncul menampilkan semua pesanan
- Data diupdate secara real-time

### 2. **Export Data**
- **Export JSON**: Download semua data dalam satu file JSON
- **Export TXT**: Download semua data dalam format order.txt
- **Auto Download**: Setiap pesanan otomatis download file JSON dan TXT
- **Format Nama**: 
  - JSON: `gym-orders-YYYY-MM-DD.json`
  - TXT: `order-YYYY-MM-DD-HH-MM-SS.txt`
- **Copy to Clipboard**: Data otomatis di-copy untuk paste ke file order.txt

### 3. **Local Storage**
- Data tersimpan di browser pengguna
- Tidak hilang saat refresh halaman
- Bisa diakses melalui Developer Tools → Application → Local Storage

### 4. **Console Log**
- Buka Developer Tools (F12) → Console
- Setiap pesanan akan muncul log lengkap
- Berguna untuk debugging dan monitoring

## 🎯 **Paket Membership**

| Paket | Harga | Fitur |
|-------|-------|-------|
| **Basic** | Rp 299.000/bulan | Akses gym 24/7, Locker room, Free WiFi, Air conditioning |
| **Premium** | Rp 499.000/bulan | Semua fitur Basic + Personal trainer, Group classes, Sauna & steam room, Nutrition consultation |
| **VIP** | Rp 799.000/bulan | Semua fitur Premium + Private training room, Spa & massage, Meal planning, Priority booking |

## 💰 **Sistem Diskon**

- **3-5 bulan**: Diskon 5%
- **6+ bulan**: Diskon 10%
- **1-2 bulan**: Tanpa diskon

## 🛠️ **Teknologi yang Digunakan**

- **HTML5**: Struktur website
- **CSS3**: Styling dan animasi
- **JavaScript ES6+**: Interaktivitas dan logika bisnis
- **Local Storage API**: Penyimpanan data lokal
- **File API**: Download dan export data
- **WhatsApp API**: Integrasi notifikasi

## 📁 **Struktur File**

```
Gym/
├── index.html          # Halaman utama website
├── style.css           # Styling dan animasi
├── script.js           # JavaScript dan logika bisnis
└── README.md           # Dokumentasi lengkap
```

## 🚀 **Cara Menjalankan**

### **🏠 Local Development:**
1. **Buka file `index.html`** di browser
2. **Test fitur pemesanan** dengan mengisi form
3. **Lihat data tersimpan** di panel data (tombol 📊)
4. **Export data** untuk backup atau analisis
5. **Data otomatis tersimpan** ke file order.txt (download + copy clipboard)

### **🌐 Hosting/Production:**
1. **Upload semua file** ke hosting dengan database MySQL
2. **Setup database** menggunakan file `database.sql`
3. **Update konfigurasi** di `config/database.php`
4. **Akses website** melalui domain hosting
5. **Panel admin** tersedia di `/admin/`
6. **Data tersimpan permanen** di database server

## 📱 **Fitur WhatsApp**

### **Pesan Quick Order:**
```
PESANAN MEMBERSHIP GYM

Halo! Saya ingin memesan membership gym:

Detail Paket:
[Paket yang dipilih]

Harga: [Harga paket]

Fitur yang Didapat:
[Fitur-fitur paket]

Status: Konfirmasi Pesanan

Mohon informasi lebih lanjut untuk:
- Proses pembayaran
- Jadwal mulai membership
- Syarat dan ketentuan

Terima kasih!
```

### **Pesan Form Lengkap:**
```
PESANAN MEMBERSHIP GYM BARU

Ada pesanan membership gym baru dari customer:

Data Customer:
- Nama: [Nama]
- Telepon: [Telepon]
- Email: [Email]

Detail Paket:
[Detail paket]

Durasi: [Durasi] bulan

Perhitungan Harga:
- Harga per bulan: Rp [Harga/bulan]
- Total harga: Rp [Total harga]
- Diskon: [Persentase diskon]
- Harga akhir: Rp [Harga setelah diskon]

Fitur yang Didapat:
[Fitur-fitur paket]

Pesan Tambahan:
[Pesan customer]

Mohon segera diproses untuk:
- Konfirmasi ketersediaan
- Proses pembayaran
- Jadwal mulai membership

Terima kasih!
```

## 🔧 **Kustomisasi**

### **Mengubah Nomor WhatsApp:**
Edit variabel `whatsappNumber` di `script.js`:
```javascript
const whatsappNumber = '6287734662869'; // Ganti dengan nomor yang diinginkan
```

### **Mengubah Harga Paket:**
Edit harga di fungsi `updatePrice()` dan switch case paket di `script.js`

### **Mengubah Pesan WhatsApp:**
Edit template pesan di fungsi `confirmOrder` dan form submission

## 📊 **Monitoring dan Analytics**

### **Data yang Tersimpan:**
- Total pesanan per hari/bulan
- Paket yang paling populer
- Rata-rata durasi membership
- Total revenue (jika dihitung)

### **Cara Export untuk Analisis:**
1. Klik tombol 📊 untuk buka panel data
2. Klik "📥 Export JSON" untuk download semua data JSON
3. Klik "📄 Export TXT" untuk download semua data dalam format order.txt
4. Buka file JSON di Excel atau aplikasi analisis data
5. Buka file TXT di Notepad atau text editor

### **Format File order.txt:**
- Data terformat rapi dengan pemisah yang jelas
- Setiap pesanan memiliki section terpisah
- Ringkasan total revenue dan statistik
- Mudah dibaca dan dipahami

### **Panel Admin (Hosting):**
- Akses melalui `/admin/login.html` untuk login
- **Username**: `admin`
- **Password**: `user123`
- Dashboard statistik real-time
- Filter dan search pesanan
- Update status pesanan
- Export data dalam berbagai format
- **Logout** otomatis setelah 24 jam

## 🚨 **Keamanan Data**

### **Local Development:**
- Data tersimpan **hanya di browser lokal**
- **Tidak ada server** yang menyimpan data
- Data **hilang** jika browser di-clear
- **Backup manual** diperlukan dengan export

### **Hosting/Production:**
- Data tersimpan **permanen di database MySQL**
- **Server aman** dengan SSL certificate
- Data **tidak hilang** dan tersimpan terstruktur
- **Backup otomatis** dan monitoring real-time

## 📞 **Support**

Untuk pertanyaan atau masalah:
- **WhatsApp**: 6287734662869
- **Email**: info@fitlifegym.com

---

**© 2024 FitLife Gym - Website Membership Gym dengan Integrasi WhatsApp dan Sistem Penyimpanan Data**
