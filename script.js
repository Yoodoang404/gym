// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Order functionality
const orderButtons = document.querySelectorAll('.order-btn');
const orderModal = document.getElementById('orderModal');
const orderDetails = document.getElementById('orderDetails');
const closeModal = document.querySelector('.close');
const confirmOrder = document.getElementById('confirmOrder');
const cancelOrder = document.getElementById('cancelOrder');

// Show order modal when clicking order buttons
orderButtons.forEach(button => {
    button.addEventListener('click', () => {
        const plan = button.getAttribute('data-plan');
        const price = button.getAttribute('data-price');
        
        orderDetails.innerHTML = `
            <p><strong>Paket:</strong> ${plan}</p>
            <p><strong>Harga:</strong> Rp ${parseInt(price).toLocaleString('id-ID')}/bulan</p>
            <p><strong>Status:</strong> Menunggu konfirmasi</p>
        `;
        
        orderModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
closeModal.addEventListener('click', () => {
    orderModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === orderModal) {
        orderModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Cancel order
cancelOrder.addEventListener('click', () => {
    orderModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Confirm order and send WhatsApp notification
confirmOrder.addEventListener('click', () => {
    const plan = orderDetails.querySelector('p:first-child').textContent.split(': ')[1];
    const price = orderDetails.querySelector('p:nth-child(2)').textContent.split(': ')[1];
    
    // Get plan details based on selection
    let planDetails = '';
    let planFeatures = '';
    
    switch(plan) {
        case 'Basic':
            planDetails = 'Basic - Rp 299.000/bulan';
            planFeatures = '- Akses gym 24/7\n- Locker room\n- Free WiFi\n- Air conditioning';
            break;
        case 'Premium':
            planDetails = 'Premium - Rp 499.000/bulan (Terpopuler)';
            planFeatures = '- Semua fitur Basic\n- Personal trainer\n- Group classes\n- Sauna & steam room\n- Nutrition consultation';
            break;
        case 'VIP':
            planDetails = 'VIP - Rp 799.000/bulan';
            planFeatures = '- Semua fitur Premium\n- Private training room\n- Spa & massage\n- Meal planning\n- Priority booking';
            break;
    }
    
    // Create detailed WhatsApp message
    const message = `PESANAN MEMBERSHIP GYM

Halo! Saya ingin memesan membership gym:

Detail Paket:
${planDetails}

Harga: ${price}

Fitur yang Didapat:
${planFeatures}

Status: Konfirmasi Pesanan

Mohon informasi lebih lanjut untuk:
- Proses pembayaran
- Jadwal mulai membership
- Syarat dan ketentuan

Terima kasih!`;

    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '6287734662869';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Debug: Log message to console
    console.log('=== DEBUG QUICK ORDER ===');
    console.log('Plan:', plan);
    console.log('Price:', price);
    console.log('Plan Details:', planDetails);
    console.log('Plan Features:', planFeatures);
    console.log('Original message:', message);
    console.log('Encoded message:', encodedMessage);
    console.log('WhatsApp URL:', whatsappUrl);
    console.log('========================');
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Close modal
    orderModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Show success message
    showNotification('Pesanan berhasil dikirim ke WhatsApp!', 'success');
});

// Contact form handling
const orderForm = document.getElementById('orderForm');

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(orderForm);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const plan = formData.get('plan');
    const duration = formData.get('duration');
    const message = formData.get('message');
    
    // Get plan details and calculate price for form submission
    let planDetails = '';
    let planFeatures = '';
    let basePrice = 0;
    
    switch(plan) {
        case 'Basic':
            planDetails = 'Basic - Rp 299.000/bulan';
            planFeatures = '- Akses gym 24/7\n- Locker room\n- Free WiFi\n- Air conditioning';
            basePrice = 299000;
            break;
        case 'Premium':
            planDetails = 'Premium - Rp 499.000/bulan (Terpopuler)';
            planFeatures = '- Semua fitur Basic\n- Personal trainer\n- Group classes\n- Sauna & steam room\n- Nutrition consultation';
            basePrice = 499000;
            break;
        case 'VIP':
            planDetails = 'VIP - Rp 799.000/bulan';
            planFeatures = '- Semua fitur Premium\n- Private training room\n- Spa & massage\n- Meal planning\n- Priority booking';
            basePrice = 799000;
            break;
    }
    
    // Calculate total price with discount
    const totalPrice = basePrice * parseInt(duration);
    const discount = duration >= 6 ? 0.1 : duration >= 3 ? 0.05 : 0;
    const finalPrice = totalPrice * (1 - discount);
    
    // Create detailed WhatsApp message for form submission
    const formMessage = `PESANAN MEMBERSHIP GYM BARU

Ada pesanan membership gym baru dari customer:

Data Customer:
- Nama: ${name}
- Telepon: ${phone}
- Email: ${email}

Detail Paket:
${planDetails}

Durasi: ${duration} bulan

Perhitungan Harga:
- Harga per bulan: Rp ${basePrice.toLocaleString('id-ID')}
- Total harga: Rp ${totalPrice.toLocaleString('id-ID')}
${discount > 0 ? `- Diskon ${duration >= 6 ? '10%' : '5%'}: Rp ${(totalPrice * discount).toLocaleString('id-ID')}\n` : ''}- Harga akhir: Rp ${finalPrice.toLocaleString('id-ID')}

Fitur yang Didapat:
${planFeatures}

Pesan Tambahan:
${message || 'Tidak ada pesan tambahan'}

Mohon segera diproses untuk:
- Konfirmasi ketersediaan
- Proses pembayaran
- Jadwal mulai membership

Terima kasih!`;

    // Encode message for WhatsApp
    const encodedFormMessage = encodeURIComponent(formMessage);
    const whatsappNumber = '6287734662869';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedFormMessage}`;
    
    // Debug: Log message to console
    console.log('=== DEBUG FORM SUBMISSION ===');
    console.log('Name:', name);
    console.log('Phone:', phone);
    console.log('Email:', email);
    console.log('Plan:', plan);
    console.log('Duration:', duration);
    console.log('Message:', message);
    console.log('Plan Details:', planDetails);
    console.log('Plan Features:', planFeatures);
    console.log('Base Price:', basePrice);
    console.log('Total Price:', totalPrice);
    console.log('Discount:', discount);
    console.log('Final Price:', finalPrice);
    console.log('Original form message:', formMessage);
    console.log('Encoded form message:', encodedFormMessage);
    console.log('WhatsApp URL:', whatsappUrl);
    console.log('============================');
    
    // SAVE ORDER DATA
    const orderData = {
        id: generateOrderId(),
        timestamp: new Date().toISOString(),
        customer: {
            name: name,
            phone: phone,
            email: email
        },
        order: {
            plan: plan,
            planDetails: planDetails,
            duration: parseInt(duration),
            basePrice: basePrice,
            totalPrice: totalPrice,
            discount: discount,
            finalPrice: finalPrice,
            message: message || 'Tidak ada pesan tambahan'
        },
        status: 'Pending',
        whatsappSent: true
    };
    
    // Save to Local Storage
    saveOrderToLocalStorage(orderData);
    
    // Save to Server Database
    saveOrderToServer(orderData);
    
    // Save to File (Download JSON)
    downloadOrderData(orderData);
    
    // Save to TXT file (for order.txt)
    downloadOrderAsTxt(orderData);
    
    // Copy to clipboard (for manual paste to order.txt)
    copyOrderToClipboard(orderData);
    
    // Log to Console
    console.log('=== ORDER SAVED ===');
    console.log('Order ID:', orderData.id);
    console.log('Order Data:', orderData);
    console.log('==================');
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    orderForm.reset();
    
    // Show success message
    showNotification('Form pesanan berhasil dikirim ke WhatsApp dan data tersimpan!', 'success');
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.membership-card, .facility-item, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Form validation
function validateForm() {
    const requiredFields = orderForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            field.style.borderColor = '#e1e5e9';
        }
    });
    
    return isValid;
}

// Add form validation on submit
orderForm.addEventListener('submit', (e) => {
    if (!validateForm()) {
        e.preventDefault();
        showNotification('Mohon lengkapi semua field yang wajib diisi!', 'error');
        return false;
    }
});

// Add input validation on blur
orderForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => {
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.style.borderColor = '#e74c3c';
        } else {
            field.style.borderColor = '#e1e5e9';
        }
    });
    
    field.addEventListener('input', () => {
        if (field.value.trim()) {
            field.style.borderColor = '#e1e5e9';
        }
    });
});

// Price calculation for duration
const planSelect = document.getElementById('plan');
const durationSelect = document.getElementById('duration');

function updatePrice() {
    const plan = planSelect.value;
    const duration = durationSelect.value;
    
    if (plan && duration) {
        let basePrice = 0;
        switch(plan) {
            case 'Basic':
                basePrice = 299000;
                break;
            case 'Premium':
                basePrice = 499000;
                break;
            case 'VIP':
                basePrice = 799000;
                break;
        }
        
        const totalPrice = basePrice * parseInt(duration);
        const discount = duration >= 6 ? 0.1 : duration >= 3 ? 0.05 : 0;
        const finalPrice = totalPrice * (1 - discount);
        
        // Show price info
        const priceInfo = document.createElement('div');
        priceInfo.className = 'price-info';
        priceInfo.innerHTML = `
            <p><strong>Total Harga:</strong> Rp ${totalPrice.toLocaleString('id-ID')}</p>
            ${discount > 0 ? `<p><strong>Diskon:</strong> ${discount * 100}%</p>` : ''}
            <p><strong>Harga Akhir:</strong> Rp ${finalPrice.toLocaleString('id-ID')}</p>
        `;
        
        // Remove existing price info
        const existingPriceInfo = document.querySelector('.price-info');
        if (existingPriceInfo) {
            existingPriceInfo.remove();
        }
        
        // Add new price info
        durationSelect.parentNode.appendChild(priceInfo);
    }
}

planSelect.addEventListener('change', updatePrice);
durationSelect.addEventListener('change', updatePrice);

// ========================================
// ORDER MANAGEMENT SYSTEM
// ========================================

// Generate unique order ID
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `GYM-${timestamp}-${random}`;
}

// Save order to Local Storage
function saveOrderToLocalStorage(orderData) {
    try {
        let orders = JSON.parse(localStorage.getItem('gymOrders') || '[]');
        orders.push(orderData);
        localStorage.setItem('gymOrders', JSON.stringify(orders));
        console.log('Order saved to Local Storage:', orderData.id);
        updateOrdersPanel();
    } catch (error) {
        console.error('Error saving to Local Storage:', error);
    }
}

// Save order to Server Database
async function saveOrderToServer(orderData) {
    try {
        // Prepare data for server
        const serverData = {
            order_id: orderData.id,
            customer_name: orderData.customer.name,
            customer_phone: orderData.customer.phone,
            customer_email: orderData.customer.email,
            plan_type: orderData.order.plan,
            plan_details: orderData.order.planDetails,
            duration: orderData.order.duration,
            base_price: orderData.order.basePrice,
            total_price: orderData.order.totalPrice,
            discount_percent: orderData.order.discount * 100,
            final_price: orderData.order.finalPrice,
            customer_message: orderData.order.message
        };
        
        // Send to server
        const response = await fetch('api/save_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serverData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Order saved to Server:', result.data);
            showNotification('Data tersimpan ke server database!', 'success');
            
            // Update order ID from server if needed
            if (result.data && result.data.order_id) {
                orderData.id = result.data.order_id;
            }
        } else {
            console.error('Server error:', result.message);
            showNotification('Gagal simpan ke server: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('Error saving to Server:', error);
        showNotification('Gagal koneksi ke server database', 'error');
    }
}

// Get all orders from Local Storage
function getOrdersFromLocalStorage() {
    try {
        return JSON.parse(localStorage.getItem('gymOrders') || '[]');
    } catch (error) {
        console.error('Error reading from Local Storage:', error);
        return [];
    }
}

// Download order data as JSON file
function downloadOrderData(orderData) {
    try {
        const dataStr = JSON.stringify(orderData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `order-${orderData.id}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('Order data downloaded:', orderData.id);
    } catch (error) {
        console.error('Error downloading order data:', error);
    }
}

// Download order data as TXT file (for order.txt)
function downloadOrderAsTxt(orderData) {
    try {
        // Format data untuk file order.txt
        const txtContent = `=== PESANAN MEMBERSHIP GYM ===
Order ID: ${orderData.id}
Tanggal: ${new Date(orderData.timestamp).toLocaleString('id-ID')}
Status: ${orderData.status}

DATA CUSTOMER:
Nama: ${orderData.customer.name}
Telepon: ${orderData.customer.phone}
Email: ${orderData.customer.email}

DETAIL PESANAN:
Paket: ${orderData.order.plan}
Detail Paket: ${orderData.order.planDetails}
Durasi: ${orderData.order.duration} bulan
Harga per Bulan: Rp ${orderData.order.basePrice.toLocaleString('id-ID')}
Total Harga: Rp ${orderData.order.totalPrice.toLocaleString('id-ID')}
Diskon: ${orderData.order.discount > 0 ? `${orderData.order.discount * 100}%` : 'Tidak ada'}
Harga Akhir: Rp ${orderData.order.finalPrice.toLocaleString('id-ID')}

Pesan Tambahan: ${orderData.order.message}

WhatsApp Terkirim: ${orderData.whatsappSent ? 'Ya' : 'Tidak'}

==========================================
`;

        const dataBlob = new Blob([txtContent], {type: 'text/plain;charset=utf-8'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `order-${orderData.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('Order TXT downloaded:', orderData.id);
    } catch (error) {
        console.error('Error downloading order TXT:', error);
    }
}

// Copy order data to clipboard (for manual paste to order.txt)
function copyOrderToClipboard(orderData) {
    try {
        const txtContent = `=== PESANAN MEMBERSHIP GYM ===
Order ID: ${orderData.id}
Tanggal: ${new Date(orderData.timestamp).toLocaleString('id-ID')}
Status: ${orderData.status}

DATA CUSTOMER:
Nama: ${orderData.customer.name}
Telepon: ${orderData.customer.phone}
Email: ${orderData.customer.email}

DETAIL PESANAN:
Paket: ${orderData.order.plan}
Detail Paket: ${orderData.order.planDetails}
Durasi: ${orderData.order.duration} bulan
Harga per Bulan: Rp ${orderData.order.basePrice.toLocaleString('id-ID')}
Total Harga: Rp ${orderData.order.totalPrice.toLocaleString('id-ID')}
Diskon: ${orderData.order.discount > 0 ? `${orderData.order.discount * 100}%` : 'Tidak ada'}
Harga Akhir: Rp ${orderData.order.finalPrice.toLocaleString('id-ID')}

Pesan Tambahan: ${orderData.order.message}

WhatsApp Terkirim: ${orderData.whatsappSent ? 'Ya' : 'Tidak'}

==========================================
`;

        navigator.clipboard.writeText(txtContent).then(() => {
            showNotification('Data pesanan berhasil di-copy ke clipboard! Paste ke file order.txt', 'success');
            console.log('Order data copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy to clipboard:', err);
            // Fallback: show data in alert for manual copy
            alert('Data pesanan:\n\n' + txtContent + '\n\nCopy data di atas dan paste ke file order.txt');
        });
    } catch (error) {
        console.error('Error copying order data:', error);
    }
}

// Export all orders to JSON file
function exportAllOrders() {
    try {
        const orders = getOrdersFromLocalStorage();
        if (orders.length === 0) {
            showNotification('Tidak ada data pesanan untuk diexport!', 'error');
            return;
        }
        
        const dataStr = JSON.stringify(orders, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `gym-orders-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification(`Berhasil export ${orders.length} data pesanan!`, 'success');
    } catch (error) {
        console.error('Error exporting orders:', error);
        showNotification('Gagal export data pesanan!', 'error');
    }
}

// Export all orders to TXT file (for order.txt)
function exportAllOrdersToTxt() {
    try {
        const orders = getOrdersFromLocalStorage();
        if (orders.length === 0) {
            showNotification('Tidak ada data pesanan untuk diexport!', 'error');
            return;
        }
        
        let txtContent = `=== DATA PESANAN MEMBERSHIP GYM ===
Tanggal Export: ${new Date().toLocaleString('id-ID')}
Total Pesanan: ${orders.length}

`;

        orders.forEach((order, index) => {
            txtContent += `=== PESANAN #${index + 1} ===
Order ID: ${order.id}
Tanggal: ${new Date(order.timestamp).toLocaleString('id-ID')}
Status: ${order.status}

DATA CUSTOMER:
Nama: ${order.customer.name}
Telepon: ${order.customer.phone}
Email: ${order.customer.email}

DETAIL PESANAN:
Paket: ${order.order.plan}
Detail Paket: ${order.order.planDetails}
Durasi: ${order.order.duration} bulan
Harga per Bulan: Rp ${order.order.basePrice.toLocaleString('id-ID')}
Total Harga: Rp ${order.order.totalPrice.toLocaleString('id-ID')}
Diskon: ${order.order.discount > 0 ? `${order.order.discount * 100}%` : 'Tidak ada'}
Harga Akhir: Rp ${order.order.finalPrice.toLocaleString('id-ID')}

Pesan Tambahan: ${order.order.message}

WhatsApp Terkirim: ${order.whatsappSent ? 'Ya' : 'Tidak'}

==========================================

`;
        });
        
        txtContent += `=== RINGKASAN ===
Total Revenue: Rp ${orders.reduce((sum, order) => sum + order.order.finalPrice, 0).toLocaleString('id-ID')}
Paket Terpopuler: ${getMostPopularPlan(orders)}
Rata-rata Durasi: ${(orders.reduce((sum, order) => sum + order.order.duration, 0) / orders.length).toFixed(1)} bulan

=== END OF REPORT ===`;

        const dataBlob = new Blob([txtContent], {type: 'text/plain;charset=utf-8'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `order.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification(`Berhasil export ${orders.length} data pesanan ke order.txt!`, 'success');
    } catch (error) {
        console.error('Error exporting orders to TXT:', error);
        showNotification('Gagal export data pesanan ke TXT!', 'error');
    }
}

// Get most popular plan
function getMostPopularPlan(orders) {
    const planCounts = {};
    orders.forEach(order => {
        planCounts[order.order.plan] = (planCounts[order.order.plan] || 0) + 1;
    });
    
    let mostPopular = '';
    let maxCount = 0;
    
    Object.keys(planCounts).forEach(plan => {
        if (planCounts[plan] > maxCount) {
            maxCount = planCounts[plan];
            mostPopular = plan;
        }
    });
    
    return mostPopular;
}

// Clear all orders from Local Storage
function clearAllOrders() {
    if (confirm('Apakah Anda yakin ingin menghapus semua data pesanan? Tindakan ini tidak dapat dibatalkan!')) {
        try {
            localStorage.removeItem('gymOrders');
            updateOrdersPanel();
            showNotification('Semua data pesanan berhasil dihapus!', 'success');
        } catch (error) {
            console.error('Error clearing orders:', error);
            showNotification('Gagal menghapus data pesanan!', 'error');
        }
    }
}

// Update orders panel display
function updateOrdersPanel() {
    const ordersPanel = document.getElementById('ordersPanel');
    const ordersList = document.getElementById('ordersList');
    const orders = getOrdersFromLocalStorage();
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: #6c757d;">Belum ada pesanan</p>';
        return;
    }
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-item">
            <h4>Order #${order.id}</h4>
            <p><strong>Customer:</strong> ${order.customer.name}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Plan:</strong> ${order.order.plan}</p>
            <p><strong>Duration:</strong> ${order.order.duration} bulan</p>
            <p><strong>Total Price:</strong> Rp ${order.order.finalPrice.toLocaleString('id-ID')}</p>
            <p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleString('id-ID')}</p>
            <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
        </div>
    `).join('');
}

// Toggle orders panel
function toggleOrdersPanel() {
    const ordersPanel = document.getElementById('ordersPanel');
    if (ordersPanel.style.display === 'none' || ordersPanel.style.display === '') {
        ordersPanel.style.display = 'block';
        updateOrdersPanel();
    } else {
        ordersPanel.style.display = 'none';
    }
}

// Create orders panel HTML
function createOrdersPanel() {
    const ordersPanel = document.createElement('div');
    ordersPanel.id = 'ordersPanel';
    ordersPanel.className = 'orders-panel';
    ordersPanel.innerHTML = `
        <h3>📋 Data Pesanan</h3>
        <div id="ordersList"></div>
        <div style="text-align: center; margin-top: 20px;">
            <button onclick="exportAllOrders()" style="background: #27ae60; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin: 5px; cursor: pointer;">📥 Export JSON</button>
            <button onclick="exportAllOrdersToTxt()" style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin: 5px; cursor: pointer;">📄 Export TXT</button>
            <button onclick="clearAllOrders()" style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin: 5px; cursor: pointer;">🗑️ Clear All</button>
            <button onclick="toggleOrdersPanel()" style="background: #6c757d; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin: 5px; cursor: pointer;">❌ Close</button>
        </div>
    `;
    
    const ordersToggle = document.createElement('button');
    ordersToggle.className = 'orders-toggle';
    ordersToggle.innerHTML = '📊';
    ordersToggle.title = 'Lihat Data Pesanan';
    ordersToggle.onclick = toggleOrdersPanel;
    
    document.body.appendChild(ordersPanel);
    document.body.appendChild(ordersToggle);
}

// Initialize orders panel when page loads
document.addEventListener('DOMContentLoaded', () => {
    createOrdersPanel();
    
    // Show notification if there are existing orders
    const existingOrders = getOrdersFromLocalStorage();
    if (existingOrders.length > 0) {
        console.log(`Found ${existingOrders.length} existing orders in Local Storage`);
    }
});

// Add CSS for price info
const priceInfoStyles = document.createElement('style');
priceInfoStyles.textContent = `
    .price-info {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 10px;
        margin-top: 1rem;
        border-left: 4px solid #e74c3c;
    }
    
    .price-info p {
        margin: 0.5rem 0;
        font-size: 0.9rem;
    }
    
    .notification-error {
        background: #e74c3c !important;
    }
    
    .orders-panel {
        position: fixed;
        top: 20px;
        left: 20px;
        background: white;
        border: 2px solid #e74c3c;
        border-radius: 15px;
        padding: 20px;
        max-width: 400px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 2000;
        display: none;
    }
    
    .orders-panel h3 {
        margin: 0 0 15px 0;
        color: #e74c3c;
        text-align: center;
    }
    
    .order-item {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 15px;
    }
    
    .order-item h4 {
        margin: 0 0 10px 0;
        color: #495057;
    }
    
    .order-item p {
        margin: 5px 0;
        font-size: 0.9rem;
    }
    
    .order-status {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: bold;
        color: white;
    }
    
    .status-pending {
        background: #f39c12;
    }
    
    .status-completed {
        background: #27ae60;
    }
    
    .status-cancelled {
        background: #e74c3c;
    }
    
    .orders-toggle {
        position: fixed;
        top: 20px;
        left: 20px;
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 2001;
    }
    
    .orders-toggle:hover {
        background: #c0392b;
        transform: scale(1.1);
    }
`;
document.head.appendChild(priceInfoStyles);
