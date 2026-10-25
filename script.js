const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRLTYynv1uUFO5kW-dJdsd283X8B8gcdZdR5eQmg5SeyjDciqXqRe_yK2pS39U3Rkg/exec"; 
let allImages = [];
let isAdmin = false;

window.onload = function() {
    loadGallery();
};

// Gallery Images Load karna (GET request)
function loadGallery() {
    fetch(SCRIPT_URL)
    .then(response => response.json())
    .then(data => {
        allImages = data;
        renderGallery('All');
    })
    .catch(error => console.error("Error loading gallery:", error));
}

// Gallery Render with Filter
function renderGallery(category) {
    const container = document.getElementById('galleryContainer');
    container.innerHTML = '';

    const filtered = (category === 'All') ? allImages : allImages.filter(img => img.category === category);

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color:#777;">इस कैटेगरी में अभी कोई फोटो नहीं है।</p>';
        return;
    }

    filtered.forEach(img => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${img.url}" alt="${img.title}">
            <div class="item-title">${img.title} (${img.category})</div>
        `;
        container.appendChild(item);
    });
}

function filterGallery(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGallery(category);
}

// Submit Appointment (POST request)
function submitAppointment(e) {
    e.preventDefault();
    const btn = document.getElementById('bookBtn');
    btn.disabled = true;
    btn.innerText = "प्रोसेसिंग...";

    const data = {
        action: "saveAppointment",
        customerName: document.getElementById('custName').value,
        phone: document.getElementById('custPhone').value,
        service: document.getElementById('custService').value,
        beautician: document.getElementById('custBeautician').value,
        date: document.getElementById('custDate').value,
        timeSlot: document.getElementById('custTime').value
    };

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(res => {
        alert("बधाई हो! आपका अपॉइंटमेंट सफलतापूर्वक बुक हो गया है।");
        document.getElementById('appointmentForm').reset();
        btn.disabled = false;
        btn.innerText = "कन्फर्म करें";
    })
    .catch(error => {
        alert("कुछ गड़बड़ हुई है, कृपया पुनः प्रयास करें।");
        btn.disabled = false;
        btn.innerText = "कन्फर्म करें";
    });
}

// Admin Login
function toggleAdminLogin() {
    if (!isAdmin) {
        let user = prompt("Admin Username:");
        let pass = prompt("Admin Password:");
        
        fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({ action: "adminLogin", username: user, password: pass })
        })
        .then(response => response.json())
        .then(res => {
            if (res.status === "success") {
                isAdmin = true;
                document.getElementById('adminPanel').style.display = 'block';
                document.getElementById('adminLoginBtn').innerText = "Admin Logout";
                alert("लॉगिन सफल!");
            } else {
                alert(res.message);
            }
        });
    } else {
        isAdmin = false;
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('adminLoginBtn').innerText = "Admin Login";
    }
}

// Upload Image (POST request)
function uploadImage() {
    let url = document.getElementById('imgUrl').value;
    let title = document.getElementById('imgTitle').value;
    let category = document.getElementById('imgCategory').value;

    if(!url) return alert("कृपया फोटो का URL दर्ज करें!");

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "addGallery", url: url, title: title, category: category })
    })
    .then(response => response.json())
    .then(res => {
        alert("फोटो सफलतापूर्वक अपलोड हो गई!");
        document.getElementById('imgUrl').value = '';
        document.getElementById('imgTitle').value = '';
        loadGallery();
    });
}
