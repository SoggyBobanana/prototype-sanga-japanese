// Fake Database
class FakeDatabase {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('sangaMenu')) || [];
        this.nextId = Math.max(...this.items.map(item => item.id), 0) + 1;
    }

    addItem(item) {
        const newItem = {
            id: this.nextId++,
            ...item,
            createdAt: new Date().toISOString()
        };
        this.items.push(newItem);
        this.save();
        return newItem;
    }

    getAll() {
        return this.items;
    }

    getById(id) {
        return this.items.find(item => item.id === id);
    }

    updateItem(id, updates) {
        const item = this.getById(id);
        if (item) {
            Object.assign(item, updates);
            item.updatedAt = new Date().toISOString();
            this.save();
            return item;
        }
        return null;
    }

    deleteItem(id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index > -1) {
            this.items.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    deleteAll() {
        this.items = [];
        this.nextId = 1;
        this.save();
    }

    save() {
        localStorage.setItem('sangaMenu', JSON.stringify(this.items));
    }

    export() {
        return JSON.stringify(this.items, null, 2);
    }

    import(jsonData) {
        try {
            this.items = JSON.parse(jsonData);
            this.nextId = Math.max(...this.items.map(item => item.id), 0) + 1;
            this.save();
            return true;
        } catch (e) {
            console.error('Invalid JSON:', e);
            return false;
        }
    }

    getStats() {
        if (this.items.length === 0) {
            return { count: 0, avgRating: 0, totalValue: 0 };
        }
        const totalValue = this.items.reduce((sum, item) => sum + parseFloat(item.price), 0);
        const avgRating = (this.items.reduce((sum, item) => sum + parseFloat(item.rating), 0) / this.items.length).toFixed(1);
        return {
            count: this.items.length,
            avgRating: avgRating,
            totalValue: totalValue.toFixed(2)
        };
    }
}

// Initialize Database
const db = new FakeDatabase();

// DOM Elements
const menuForm = document.getElementById('menuForm');
const menuList = document.getElementById('menuList');
const totalItemsEl = document.getElementById('totalItems');
const avgRatingEl = document.getElementById('avgRating');
const totalValueEl = document.getElementById('totalValue');
const clearAllBtn = document.getElementById('clearAllBtn');
const exportBtn = document.getElementById('exportBtn');

// Form Submission
menuForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const item = {
        name: document.getElementById('itemName').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        rating: parseFloat(document.getElementById('itemRating').value),
        description: document.getElementById('itemDescription').value
    };

    db.addItem(item);
    renderMenu();
    updateStats();
    menuForm.reset();
    document.getElementById('itemName').focus();
});

// Render Menu Items
function renderMenu() {
    const items = db.getAll();
    
    if (items.length === 0) {
        menuList.innerHTML = '<p class="empty-message">No items yet. Add one to get started!</p>';
        return;
    }

    menuList.innerHTML = items.map(item => `
        <div class="menu-item" data-id="${item.id}">
            <div class="menu-item-header">
                <span class="menu-item-title">${escapeHtml(item.name)}</span>
                <span class="menu-item-price">RM ${parseFloat(item.price).toFixed(2)}</span>
            </div>
            <div class="menu-item-rating">⭐ ${parseFloat(item.rating).toFixed(1)}/10</div>
            <p class="menu-item-description">${escapeHtml(item.description)}</p>
            <div class="menu-item-actions">
                <button class="btn btn-edit" onclick="editItem(${item.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteItem(${item.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Edit Item
function editItem(id) {
    const item = db.getById(id);
    if (item) {
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemRating').value = item.rating;
        document.getElementById('itemDescription').value = item.description;
        
        // Change form to edit mode
        const submitBtn = menuForm.querySelector('button[type="submit"]');
        submitBtn.textContent = `Update Item ${item.id}`;
        submitBtn.dataset.editingId = id;
        
        // Scroll to form
        menuForm.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('itemName').focus();
    }
}

// Handle form submission for edit
menuForm.addEventListener('submit', function(e) {
    const submitBtn = this.querySelector('button[type="submit"]');
    if (submitBtn.dataset.editingId) {
        e.preventDefault();
        const id = parseInt(submitBtn.dataset.editingId);
        const updates = {
            name: document.getElementById('itemName').value,
            price: parseFloat(document.getElementById('itemPrice').value),
            rating: parseFloat(document.getElementById('itemRating').value),
            description: document.getElementById('itemDescription').value
        };
        db.updateItem(id, updates);
        renderMenu();
        updateStats();
        menuForm.reset();
        submitBtn.textContent = 'Add Item';
        delete submitBtn.dataset.editingId;
    }
});

// Delete Item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        db.deleteItem(id);
        renderMenu();
        updateStats();
    }
}

// Update Stats
function updateStats() {
    const stats = db.getStats();
    totalItemsEl.textContent = stats.count;
    avgRatingEl.textContent = stats.avgRating;
    totalValueEl.textContent = `RM ${stats.totalValue}`;
}

// Clear All Data
clearAllBtn.addEventListener('click', function() {
    if (confirm('⚠️ This will delete ALL menu items. Are you sure?')) {
        db.deleteAll();
        renderMenu();
        updateStats();
        menuForm.reset();
        alert('All data cleared!');
    }
});

// Export Data
exportBtn.addEventListener('click', function() {
    const data = db.export();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(data);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "sanga_menu_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
});

// Utility function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Initial render
document.addEventListener('DOMContentLoaded', function() {
    renderMenu();
    updateStats();

    // Sample data button (optional for testing)
    const addSampleBtn = document.createElement('button');
    addSampleBtn.textContent = 'Load Sample Data';
    addSampleBtn.className = 'btn btn-secondary';
    addSampleBtn.style.marginRight = '0.5rem';
    addSampleBtn.addEventListener('click', function() {
        const samples = [
            { name: 'Sushi Roll', price: 28, rating: 8.5, description: 'Fresh assorted sushi with cucumber and avocado' },
            { name: 'Tempura', price: 32, rating: 8.8, description: 'Lightly battered and fried shrimp and vegetables' },
            { name: 'Ramen', price: 22, rating: 9.0, description: 'Rich tonkotsu broth with noodles and toppings' },
            { name: 'Yakitori', price: 25, rating: 8.3, description: 'Grilled chicken skewers with teriyaki glaze' }
        ];
        samples.forEach(sample => db.addItem(sample));
        renderMenu();
        updateStats();
        alert('Sample data loaded! Check your database.');
    });
    
    const footer = document.querySelector('.admin-footer .admin-container');
    footer.insertBefore(addSampleBtn, footer.firstChild);
});
