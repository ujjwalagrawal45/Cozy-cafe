/**
 * Cozy Cafe — Interactive JavaScript Module
 * ==========================================
 * Transforms the static cafe website into a fully interactive application.
 *
 * JS Concepts Demonstrated:
 *  1. Control & Looping Structures (if/else, switch, for, while, forEach)
 *  2. Arrays & Array Methods (map, filter, reduce, push, find, forEach)
 *  3. Event Handling (click, input, change, submit — all via addEventListener)
 *  4. Math & Date Objects (greeting, timestamp, random daily special)
 *  5. String Object (trim, toLowerCase, includes, replace, slice, padStart)
 *  6. Objects & Constructors (ES6 classes: MenuItem, CartItem, Cart)
 *  7. User-Defined Functions (modular, reusable, well-named)
 *  8. Form Validation (real-time + on-submit, user-friendly errors)
 */

// ── IIFE wrapper to avoid global scope pollution ──────────────────────────────
(function () {
    'use strict';

    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  6. OBJECTS & CONSTRUCTORS — ES6 Classes                             ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    /** Represents a single item on the menu */
    class MenuItem {
        constructor(id, name, price, image, category, description) {
            this.id = id;
            this.name = name;
            this.price = price;       // number in ₹
            this.image = image;       // relative path
            this.category = category; // 'beverages' | 'snacks' | 'desserts'
            this.description = description;
        }
    }

    /** Wraps a MenuItem with a quantity for the cart */
    class CartItem {
        constructor(menuItem, quantity = 1) {
            this.menuItem = menuItem;
            this.quantity = quantity;
        }

        /** Total price for this line item */
        getLineTotal() {
            return this.menuItem.price * this.quantity;
        }
    }

    // ── Cafe schedule constants ──
    const OPEN_HOUR = 9;   // 9 AM
    const CLOSE_HOUR = 21; // 9 PM

    /** Manages the shopping cart, persisted to localStorage */
    class Cart {
        constructor() {
            this.items = []; // Array of CartItem objects
            this.TAX_RATE = 0.05; // 5% tax
            this.OVERTIME_RATE = 0.10; // 10% overtime surcharge
            this._load();
        }

        // ── 2. ARRAYS — push, find, filter, reduce ──

        /** Add an item or increment its quantity */
        addItem(menuItem) {
            const existing = this.items.find(ci => ci.menuItem.id === menuItem.id);
            if (existing) {
                existing.quantity++;
            } else {
                this.items.push(new CartItem(menuItem, 1));
            }
            // Flag overtime if added during last 10 min before closing
            if (this.isOvertimeWindow()) {
                this._hasOvertimeItems = true;
                localStorage.setItem('cozyCafeOvertime', 'true');
            }
            this._save();
        }

        /** Remove an item entirely */
        removeItem(menuItemId) {
            this.items = this.items.filter(ci => ci.menuItem.id !== menuItemId);
            this._save();
        }

        /** Update quantity; removes if qty <= 0 */
        updateQuantity(menuItemId, delta) {
            const item = this.items.find(ci => ci.menuItem.id === menuItemId);
            if (!item) return;
            item.quantity += delta;
            // 1. CONTROL — if/else
            if (item.quantity <= 0) {
                this.removeItem(menuItemId);
            } else {
                this._save();
            }
        }

        /** Subtotal using reduce */
        getSubtotal() {
            return this.items.reduce((sum, ci) => sum + ci.getLineTotal(), 0);
        }

        getTax() {
            return this.getSubtotal() * this.TAX_RATE;
        }

        /** Check if current time is in the overtime window (last 10 min before closing) */
        isOvertimeWindow() {
            const now = new Date();
            const mins = now.getHours() * 60 + now.getMinutes();
            const closeMin = CLOSE_HOUR * 60;
            return mins >= (closeMin - 10) && mins < closeMin;
        }

        /** Get overtime surcharge amount (10% of subtotal, only if items were added during overtime) */
        getOvertimeCharge() {
            if (this._hasOvertimeItems) {
                return this.getSubtotal() * this.OVERTIME_RATE;
            }
            return 0;
        }

        getTotal() {
            return this.getSubtotal() + this.getTax() + this.getOvertimeCharge();
        }

        getItemCount() {
            return this.items.reduce((sum, ci) => sum + ci.quantity, 0);
        }

        clear() {
            this.items = [];
            this._hasOvertimeItems = false;
            localStorage.removeItem('cozyCafeOvertime');
            this._save();
        }

        // ── Persistence via localStorage ──

        _save() {
            const data = this.items.map(ci => ({
                id: ci.menuItem.id,
                name: ci.menuItem.name,
                price: ci.menuItem.price,
                image: ci.menuItem.image,
                category: ci.menuItem.category,
                description: ci.menuItem.description,
                quantity: ci.quantity
            }));
            localStorage.setItem('cozyCafeCart', JSON.stringify(data));
        }

        _load() {
            this._hasOvertimeItems = localStorage.getItem('cozyCafeOvertime') === 'true';
            const raw = localStorage.getItem('cozyCafeCart');
            if (!raw) return;
            try {
                const data = JSON.parse(raw);
                // 1. CONTROL — forEach loop to rebuild objects
                data.forEach(d => {
                    const mi = new MenuItem(d.id, d.name, d.price, d.image, d.category, d.description);
                    this.items.push(new CartItem(mi, d.quantity));
                });
            } catch (e) {
                // corrupted data — start fresh
                this.items = [];
            }
        }
    }

    // ── Instantiate cart (available across all pages) ──
    const cart = new Cart();


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  MENU DATA — Array of MenuItem instances                             ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    const menuData = [
        new MenuItem('masala-chai', 'Masala Chai', 150, 'images/masala_chai.jpg', 'beverages', 'Strong Assam tea with aromatic spices, ginger, and cardamom.'),
        new MenuItem('adrak-chai', 'Adrak Chai', 140, 'images/adrak_chai.jpg', 'beverages', 'Fresh ginger infused tea, perfect for a rainy day or sore throat.'),
        new MenuItem('filter-coffee', 'Madras Filter Coffee', 120, 'images/filter_coffee.webp', 'beverages', 'Traditional South Indian coffee brewed in a metal filter.'),
        new MenuItem('mango-lassi', 'Mango Lassi', 180, 'images/mango_lassi.webp', 'beverages', 'Thick, creamy yogurt drink blended with fresh alphonso mangoes.'),
        new MenuItem('lime-soda', 'Fresh Lime Soda', 100, 'images/masala_soda.webp', 'beverages', 'Refreshing lemon soda with a pinch of black salt and cumin.'),
        new MenuItem('vada-pav', 'Vada Pav', 80, 'images/vada_pav.webp', 'snacks', 'Spicy potato fritter in a pav bun with garlic and mint chutneys.'),
        new MenuItem('samosa', 'Samosa Plate', 60, 'images/samosa.webp', 'snacks', 'Two crispy samosas served with fried chili and chutneys.'),
        new MenuItem('bun-maska', 'Bun Maska', 50, 'images/bun_maska.jpeg', 'snacks', 'Soft bun slathered with generous amounts of butter. Perfect with Chai.'),
        new MenuItem('maggi', 'Vegetable Maggi', 70, 'images/maggi.webp', 'snacks', 'Everyone\'s favorite noodles cooked with fresh veggies and spices.'),
        new MenuItem('bombay-sandwich', 'Bombay Grilled Sandwich', 120, 'images/bombay_sandwich.webp', 'snacks', 'Triple layer sandwich with potato filling, cheese, and chutney.'),
        new MenuItem('poha', 'Indori Poha', 60, 'images/poha.jpg', 'snacks', 'Flattened rice cooked with turmeric, peanuts, and topped with sev.'),
        new MenuItem('gulab-jamun', 'Gulab Jamun (2 pcs)', 80, 'images/gulab_jamun.webp', 'desserts', 'Soft, deep-fried berry sized balls soaked in rose flavored sugar syrup.'),
        new MenuItem('rasmalai-cake', 'Rasmalai Cake Jar', 150, 'images/rasmalai_cake.jpg', 'desserts', 'Fusion dessert layering sponge cake with saffron milk and rasmalai.')
    ];


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  7. USER-DEFINED FUNCTIONS — Utilities                               ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    /**
     * Format a number as Indian Rupee currency string.
     * 5. STRING — uses replace for formatting
     */
    function formatCurrency(amount) {
        return '₹' + amount.toFixed(2);
    }

    /**
     * Return a greeting based on current hour.
     * 4. MATH & DATE — uses Date object
     */
    function getGreeting() {
        const hour = new Date().getHours();
        // 1. CONTROL — if/else chain
        if (hour < 12) {
            return 'Good Morning';
        } else if (hour < 17) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    }

    /**
     * Get a formatted current time string.
     * 4. DATE + 5. STRING — padStart for zero-padding
     */
    function getFormattedTime() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    /**
     * Get formatted date string.
     * 4. DATE
     */
    function getFormattedDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-IN', options);
    }

    /**
     * Debounce helper — delays fn execution until after `ms` of inactivity.
     * 7. USER-DEFINED FUNCTION
     */
    function debounce(fn, ms) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), ms);
        };
    }

    /**
     * Pick a random daily special index from the menu.
     * 4. MATH — Math.random, Math.floor
     */
    function pickDailySpecial(items) {
        const index = Math.floor(Math.random() * items.length);
        return items[index].id;
    }

    /**
     * Show a toast notification.
     * 7. USER-DEFINED FUNCTION + 5. STRING — trim
     */
    function showToast(message) {
        const msg = message.trim(); // 5. STRING — trim
        // Remove existing toast if any
        const old = document.querySelector('.toast');
        if (old) old.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = msg;
        document.body.appendChild(toast);

        // Trigger reflow then add visible class
        requestAnimationFrame(() => {
            toast.classList.add('toast--visible');
        });

        setTimeout(() => {
            toast.classList.remove('toast--visible');
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    }


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  PAGE DETECTION & INITIALIZATION                                     ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    /**
     * Detect active page from the current URL.
     * 5. STRING — includes
     */
    function detectPage() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('menu')) return 'menu';
        if (path.includes('cart')) return 'cart';
        if (path.includes('payment')) return 'payment';
        return 'home';
    }

    // Run on DOM ready
    document.addEventListener('DOMContentLoaded', function () {
        const page = detectPage();

        // 1. CONTROL — switch statement for page routing
        switch (page) {
            case 'home':
                initHomePage();
                break;
            case 'menu':
                initMenuPage();
                break;
            case 'cart':
                initCartPage();
                break;
            case 'payment':
                initPaymentPage();
                break;
        }

        // Common: update cart badge on all pages
        updateCartBadge();
    });


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  HOME PAGE                                                           ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    function initHomePage() {
        // 4. DATE — dynamic greeting
        const greetingEl = document.getElementById('greeting-text');
        if (greetingEl) {
            greetingEl.textContent = `${getGreeting()}! ${greetingEl.dataset.original || 'Experience the warmth of authentic Indian chai and snacks in a cozy atmosphere.'}`;
        }

        // 4. DATE — open/closed status in hero
        const statusEl = document.getElementById('cafe-status');
        if (statusEl) {
            const hour = new Date().getHours();
            // 1. CONTROL — if/else for open/closed
            if (hour >= 9 && hour < 21) {
                statusEl.innerHTML = '<i class="fas fa-circle" style="color: #4CAF50; font-size: 0.5rem; vertical-align: middle;"></i> We are currently <strong>Open</strong>';
                statusEl.style.color = '#4CAF50';
            } else {
                statusEl.innerHTML = '<i class="fas fa-circle" style="color: #cc3333; font-size: 0.5rem; vertical-align: middle;"></i> We are currently <strong>Closed</strong>';
                statusEl.style.color = '#cc3333';
            }
        }

        // Copyright year
        const copyrightEl = document.querySelector('.copyright p');
        if (copyrightEl) {
            const year = new Date().getFullYear();
            // 5. STRING — replace
            copyrightEl.textContent = copyrightEl.textContent.replace(/\d{4}/, String(year));
        }

        // Countdown timer (1hr before open / 1hr before close)
        initCountdownTimer();

        // Scroll-triggered fade-in animations
        initScrollAnimations();

        // Testimonial carousel auto-rotate
        initTestimonialCarousel();
    }

    /**
     * Countdown timer — shows 1hr before opening and 1hr before closing.
     * Turns red with pulse when ≤10 min before closing.
     */
    function initCountdownTimer() {
        const timerEl = document.getElementById('countdown-timer');
        if (!timerEl) return;

        function updateTimer() {
            const now = new Date();
            const mins = now.getHours() * 60 + now.getMinutes();
            const secs = now.getSeconds();
            const totalSecs = mins * 60 + secs;

            const openSec = OPEN_HOUR * 3600;   // 9:00 AM in seconds
            const closeSec = CLOSE_HOUR * 3600;  // 9:00 PM in seconds

            let targetSec = 0;
            let label = '';
            let isClosing = false;

            // 1 hour before opening (8:00 AM – 9:00 AM) — countdown to open
            if (totalSecs >= (openSec - 3600) && totalSecs < openSec) {
                targetSec = openSec;
                label = 'Opens in';
            }
            // 1 hour before closing (8:00 PM – 9:00 PM) — countdown to close
            else if (totalSecs >= (closeSec - 3600) && totalSecs < closeSec) {
                targetSec = closeSec;
                label = 'Closes in';
                isClosing = true;
            }
            else {
                timerEl.style.display = 'none';
                timerEl.classList.remove('urgent');
                return;
            }

            const remaining = targetSec - totalSecs;
            const rMin = Math.floor(remaining / 60);
            const rSec = remaining % 60;
            const timeStr = String(rMin).padStart(2, '0') + ':' + String(rSec).padStart(2, '0');

            const icon = isClosing ? 'fa-door-closed' : 'fa-door-open';
            timerEl.innerHTML = `<i class="fas ${icon}"></i> ${label} <strong>${timeStr}</strong>`;
            timerEl.style.display = 'inline-flex';

            // Urgent state: last 10 minutes before closing
            if (isClosing && rMin < 10) {
                timerEl.classList.add('urgent');
            } else {
                timerEl.classList.remove('urgent');
            }
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    /**
     * Observe elements with [data-animate] and add fade-in on scroll.
     * 3. EVENT — IntersectionObserver (passive observation)
     */
    function initScrollAnimations() {
        const animatedEls = document.querySelectorAll('[data-animate]');
        if (!animatedEls.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-scroll');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        // 1. LOOPING — forEach
        animatedEls.forEach(el => observer.observe(el));
    }

    /**
     * Auto-rotate testimonials every 5 seconds on the home page.
     * 1. CONTROL — looping via setInterval
     */
    function initTestimonialCarousel() {
        const cards = document.querySelectorAll('.testimonial-card');
        if (cards.length <= 1) return;

        let current = 0;

        // Show only the first one initially on small screens
        function showCard(index) {
            cards.forEach((card, i) => {
                if (window.innerWidth <= 768) {
                    card.style.display = i === index ? 'block' : 'none';
                    if (i === index) {
                        card.style.opacity = '0';
                        card.style.transition = 'opacity 0.5s ease';
                        requestAnimationFrame(() => { card.style.opacity = '1'; });
                    }
                } else {
                    card.style.display = '';
                    card.style.opacity = '';
                }
            });
        }

        // Only auto-rotate on mobile
        function rotateIfMobile() {
            if (window.innerWidth <= 768) {
                current = (current + 1) % cards.length;
                showCard(current);
            }
        }

        showCard(current);
        setInterval(rotateIfMobile, 5000);

        // 3. EVENT — resize
        window.addEventListener('resize', () => showCard(current));
    }


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  MENU PAGE                                                           ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    function initMenuPage() {
        const container = document.getElementById('menu-container');
        if (!container) return;

        let activeCategory = 'all';
        let searchQuery = '';

        // 4. MATH — random daily special
        const dailySpecialId = pickDailySpecial(menuData);

        // Initial render
        renderMenu();

        // ── 3. EVENT — input on search ──
        const searchInput = document.getElementById('menu-search');
        if (searchInput) {
            // Debounced search for performance
            const handleSearch = debounce(function () {
                // 5. STRING — trim, toLowerCase
                searchQuery = searchInput.value.trim().toLowerCase();
                renderMenu();
            }, 250);

            searchInput.addEventListener('input', handleSearch);
        }

        // ── 3. EVENT — click on filter pills ──
        const filterPills = document.querySelectorAll('.filter-pill');
        filterPills.forEach(pill => {
            pill.addEventListener('click', function () {
                // Remove active from all pills
                filterPills.forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                activeCategory = this.dataset.category;
                renderMenu();
            });
        });

        /**
         * Render menu cards based on current filters.
         * 2. ARRAYS — filter + map + forEach
         * 1. CONTROL — if/else for filtering logic
         */
        function renderMenu() {
            // 2. ARRAYS — filter
            let filtered = menuData.filter(item => {
                const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
                // 5. STRING — toLowerCase, includes for search matching
                const matchesSearch = item.name.toLowerCase().includes(searchQuery) ||
                    item.description.toLowerCase().includes(searchQuery);
                return matchesCategory && matchesSearch;
            });

            // Clear all existing category sections
            container.innerHTML = '';

            // 1. CONTROL — if/else for empty results
            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="text-center" style="padding: 60px 20px; grid-column: 1 / -1;">
                        <i class="fas fa-search" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 20px;"></i>
                        <h3>No items found</h3>
                        <p style="color: #777;">Try a different search term or category.</p>
                    </div>`;
                return;
            }

            // Group by category for rendering
            const categories = {
                beverages: { title: 'Chai & Beverages', items: [] },
                snacks: { title: 'Desi Snacks & Quick Bites', items: [] },
                desserts: { title: 'Sweet Cravings', items: [] }
            };

            // 1. LOOPING — forEach to group items
            filtered.forEach(item => {
                if (categories[item.category]) {
                    categories[item.category].items.push(item);
                }
            });

            // Render each non-empty category
            // 1. LOOPING — for...of loop
            for (const [key, cat] of Object.entries(categories)) {
                if (cat.items.length === 0) continue;

                const sectionHTML = `
                    <h2 class="category-title"
                        style="border-bottom: 2px solid var(--accent-color); display: inline-block; padding-bottom: 5px; margin-bottom: 30px; width: 100%;">
                        ${cat.title}
                    </h2>
                    <div class="grid-container"
                         style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-bottom: 60px;">
                        ${cat.items.map(item => createMenuCardHTML(item, dailySpecialId)).join('')}
                    </div>`;

                container.insertAdjacentHTML('beforeend', sectionHTML);
            }

            // ── 3. EVENT — click on dynamically created 'Add to Cart' buttons ──
            container.querySelectorAll('.btn-add-cart').forEach(btn => {
                btn.addEventListener('click', function () {
                    const itemId = this.dataset.id;
                    // 2. ARRAYS — find
                    const menuItem = menuData.find(m => m.id === itemId);
                    if (menuItem) {
                        cart.addItem(menuItem);
                        updateCartBadge();
                        showToast(`✓ ${menuItem.name} added to cart!`);
                    }
                });
            });
        }

        /**
         * Generate HTML for a single menu card.
         * 7. USER-DEFINED FUNCTION
         */
        function createMenuCardHTML(item, specialId) {
            const isSpecial = item.id === specialId;
            return `
                <div class="card ${isSpecial ? 'daily-special' : ''}">
                    ${isSpecial ? '<span class="special-badge"><i class="fas fa-star"></i> Today\'s Special</span>' : ''}
                    <img src="${item.image}" alt="${item.name}" class="card-img">
                    <div class="card-body">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <h3 class="card-title">${item.name}</h3>
                            <span class="card-price">${formatCurrency(item.price)}</span>
                        </div>
                        <p style="margin-bottom: 15px; font-size: 0.9rem; color: #555;">${item.description}</p>
                        <button class="btn btn-add-cart" data-id="${item.id}" style="width: 100%; font-size: 0.9rem;">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>`;
        }
    }


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  CART PAGE                                                           ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    function initCartPage() {
        const itemsContainer = document.getElementById('cart-items-container');
        const emptyMsg = document.getElementById('cart-empty-msg');
        const subtotalEl = document.getElementById('cart-subtotal');
        const taxEl = document.getElementById('cart-tax');
        const totalEl = document.getElementById('cart-total');

        if (!itemsContainer) return;

        renderCart();

        /**
         * Render all cart items from the Cart instance.
         * 1. CONTROL — if/else for empty cart
         * 2. ARRAYS — forEach for iteration
         */
        function renderCart() {
            itemsContainer.innerHTML = '';

            // 1. CONTROL — if/else
            if (cart.items.length === 0) {
                if (emptyMsg) emptyMsg.style.display = 'block';
                itemsContainer.innerHTML = `
                    <div class="cart-empty text-center" style="padding: 60px 20px;">
                        <i class="fas fa-shopping-cart" style="font-size: 4rem; color: var(--accent-color); margin-bottom: 20px;"></i>
                        <h3>Your cart is empty</h3>
                        <p style="color: #777; margin-bottom: 20px;">Looks like you haven't added anything yet.</p>
                        <a href="menu.html" class="btn">Browse Menu</a>
                    </div>`;
                updateSummary();
                return;
            }

            if (emptyMsg) emptyMsg.style.display = 'none';

            // 1. LOOPING — for loop to build cart rows
            for (let i = 0; i < cart.items.length; i++) {
                const ci = cart.items[i];
                const row = createCartRowHTML(ci);
                itemsContainer.insertAdjacentHTML('beforeend', row);
            }

            // ── 3. EVENT — click handlers for +, -, remove buttons ──
            itemsContainer.querySelectorAll('.cart-qty-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const id = this.dataset.id;
                    const delta = parseInt(this.dataset.delta, 10);
                    cart.updateQuantity(id, delta);
                    renderCart();
                    updateCartBadge();
                });
            });

            itemsContainer.querySelectorAll('.cart-remove-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const id = this.dataset.id;
                    // 2. ARRAYS — find for item name
                    const item = cart.items.find(ci => ci.menuItem.id === id);
                    cart.removeItem(id);
                    renderCart();
                    updateCartBadge();
                    if (item) showToast(`${item.menuItem.name} removed from cart`);
                });
            });

            updateSummary();
        }

        /** Update the order summary numbers */
        function updateSummary() {
            if (subtotalEl) subtotalEl.textContent = formatCurrency(cart.getSubtotal());
            if (taxEl) taxEl.textContent = formatCurrency(cart.getTax());

            // Overtime surcharge row
            const overtimeRow = document.getElementById('cart-overtime-row');
            const overtimeEl = document.getElementById('cart-overtime');
            const overtimeAmt = cart.getOvertimeCharge();
            if (overtimeRow) {
                if (overtimeAmt > 0) {
                    overtimeRow.style.display = 'flex';
                    if (overtimeEl) overtimeEl.textContent = formatCurrency(overtimeAmt);
                } else {
                    overtimeRow.style.display = 'none';
                }
            }

            if (totalEl) totalEl.textContent = formatCurrency(cart.getTotal());
        }

        /** Build HTML for one cart row */
        function createCartRowHTML(cartItem) {
            const ci = cartItem;
            return `
                <div class="cart-item"
                     style="display: flex; align-items: center; gap: 20px; background: white; padding: 20px; border-radius: 10px; box-shadow: var(--shadow); margin-bottom: 20px;">
                    <img src="${ci.menuItem.image}" alt="${ci.menuItem.name}"
                         style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;">
                    <div style="flex: 1;">
                        <h3 style="font-size: 1.1rem; margin-bottom: 5px;">${ci.menuItem.name}</h3>
                        <p style="color: var(--secondary-color); font-size: 0.9rem;">${formatCurrency(ci.menuItem.price)} each</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px; border: 1px solid #ddd; padding: 5px 10px; border-radius: 20px;">
                        <button class="cart-qty-btn" data-id="${ci.menuItem.id}" data-delta="-1"
                                style="background: none; border: none; cursor: pointer; color: var(--primary-color); font-size: 1.1rem; font-weight: 700; width: 28px; height: 28px;">−</button>
                        <span style="font-weight: 600; min-width: 20px; text-align: center;">${ci.quantity}</span>
                        <button class="cart-qty-btn" data-id="${ci.menuItem.id}" data-delta="1"
                                style="background: none; border: none; cursor: pointer; color: var(--primary-color); font-size: 1.1rem; font-weight: 700; width: 28px; height: 28px;">+</button>
                    </div>
                    <span style="font-weight: 700; color: var(--primary-color); min-width: 70px; text-align: right;">${formatCurrency(ci.getLineTotal())}</span>
                    <button class="cart-remove-btn" data-id="${ci.menuItem.id}"
                            style="background: none; border: none; color: #cc3333; cursor: pointer; font-size: 1.1rem;" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`;
        }
    }


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  PAYMENT PAGE — 8. FORM VALIDATION                                   ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    function initPaymentPage() {
        const form = document.getElementById('payment-form');
        if (!form) return;

        // Populate total from cart
        const totalDisplay = document.getElementById('pay-total');
        if (totalDisplay) {
            totalDisplay.textContent = 'Total: ' + formatCurrency(cart.getTotal());
        }

        // ── Field references ──
        const fields = {
            name: document.getElementById('pay-name'),
            email: document.getElementById('pay-email'),
            phone: document.getElementById('pay-phone'),
            address: document.getElementById('pay-address'),
            card: document.getElementById('pay-card'),
            expiry: document.getElementById('pay-expiry'),
            cvv: document.getElementById('pay-cvv')
        };

        // ── 3. EVENT — change on payment method radios ──
        const radios = document.querySelectorAll('input[name="payment"]');
        const cardLabel = document.querySelector('label[for="pay-card"]') ||
            (fields.card ? fields.card.previousElementSibling : null);

        radios.forEach(radio => {
            radio.addEventListener('change', function () {
                // 1. CONTROL — switch for payment method
                switch (this.value) {
                    case 'upi':
                        if (fields.card) fields.card.placeholder = 'yourname@upi';
                        if (cardLabel) cardLabel.textContent = 'UPI ID';
                        toggleCardFields(false);
                        break;
                    case 'card':
                        if (fields.card) fields.card.placeholder = '1234 5678 9876 5432';
                        if (cardLabel) cardLabel.textContent = 'Card Number';
                        toggleCardFields(true);
                        break;
                }
            });
        });

        /** Show/hide expiry & CVV fields depending on payment type */
        function toggleCardFields(show) {
            const expiryGroup = fields.expiry ? fields.expiry.closest('.form-group') : null;
            const cvvGroup = fields.cvv ? fields.cvv.closest('.form-group') : null;
            const gridParent = expiryGroup ? expiryGroup.parentElement : null;

            if (gridParent && gridParent.style) {
                gridParent.style.display = show ? '' : 'none';
            }
        }

        // ── 3. EVENT — real-time validation on blur ──
        Object.values(fields).forEach(field => {
            if (!field) return;
            field.addEventListener('blur', function () {
                validateField(this);
            });
            // Also clear error on input
            field.addEventListener('input', function () {
                clearError(this);
            });
        });

        // ── 3. EVENT — submit with validation ──
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let allValid = true;

            // 1. LOOPING — iterate over fields for validation
            Object.values(fields).forEach(field => {
                if (!field) return;
                if (!validateField(field)) {
                    allValid = false;
                }
            });

            // 1. CONTROL — if/else for submission
            if (allValid) {
                // 4. DATE — timestamp on successful order
                const timestamp = getFormattedDate() + ' at ' + getFormattedTime();
                cart.clear();
                updateCartBadge();

                // Show success message
                form.innerHTML = `
                    <div class="text-center fade-in" style="padding: 40px 0;">
                        <i class="fas fa-check-circle" style="font-size: 4rem; color: #4CAF50; margin-bottom: 20px;"></i>
                        <h2>Order Placed Successfully!</h2>
                        <p style="color: #555; margin: 15px 0;">Thank you for your order. Your food is being prepared.</p>
                        <p style="font-size: 0.85rem; color: #999;">Order placed on ${timestamp}</p>
                        <a href="index.html" class="btn" style="margin-top: 25px;">Back to Home</a>
                    </div>`;
            } else {
                showToast('⚠ Please fix the errors in the form');
                // Scroll to first error
                const firstError = form.querySelector('.form-input.error');
                if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        /**
         * Validate a single form field.
         * 8. FORM VALIDATION — comprehensive rules
         * 5. STRING — trim, match, slice, replace
         * @returns {boolean} whether the field is valid
         */
        function validateField(field) {
            if (!field) return true;

            // 5. STRING — trim whitespace
            const value = field.value.trim();
            const id = field.id;

            // 1. CONTROL — switch for field-specific rules
            switch (id) {
                case 'pay-name':
                    if (!value) return showError(field, 'Full name is required');
                    if (value.length < 3) return showError(field, 'Name must be at least 3 characters');
                    // 5. STRING — regex test for alpha + spaces
                    if (!/^[a-zA-Z\s]+$/.test(value)) return showError(field, 'Name can only contain letters and spaces');
                    break;

                case 'pay-email':
                    if (!value) return showError(field, 'Email address is required');
                    // 5. STRING — regex for email format
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return showError(field, 'Please enter a valid email address');
                    break;

                case 'pay-phone':
                    // Optional, but if filled must be valid
                    if (value) {
                        // 5. STRING — replace to strip non-digits
                        const digits = value.replace(/[\s\-+()]/g, '');
                        if (!/^\d{10,12}$/.test(digits)) return showError(field, 'Please enter a valid phone number (10-12 digits)');
                    }
                    break;

                case 'pay-address':
                    if (!value) return showError(field, 'Delivery address is required');
                    if (value.length < 10) return showError(field, 'Please provide a complete address (at least 10 characters)');
                    break;

                case 'pay-card': {
                    if (!value) return showError(field, 'This field is required');
                    const selectedPayment = document.querySelector('input[name="payment"]:checked');
                    if (selectedPayment && selectedPayment.value === 'upi') {
                        // 5. STRING — includes for UPI validation
                        if (!value.includes('@')) return showError(field, 'Please enter a valid UPI ID (e.g., name@upi)');
                    } else {
                        // 5. STRING — replace to strip spaces, check 16 digits
                        const cardDigits = value.replace(/\s/g, '');
                        if (!/^\d{16}$/.test(cardDigits)) return showError(field, 'Card number must be 16 digits');
                    }
                    break;
                }

                case 'pay-expiry': {
                    if (!value) return showError(field, 'Expiry date is required');
                    if (!/^\d{2}\/\d{2}$/.test(value)) return showError(field, 'Use MM/YY format');
                    // 4. DATE — check if card is expired
                    // 5. STRING — slice to extract month/year
                    const month = parseInt(value.slice(0, 2), 10);
                    const year = parseInt('20' + value.slice(3, 5), 10);
                    const now = new Date();
                    if (month < 1 || month > 12) return showError(field, 'Invalid month');
                    if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
                        return showError(field, 'Card has expired');
                    }
                    break;
                }

                case 'pay-cvv':
                    if (!value) return showError(field, 'CVV is required');
                    if (!/^\d{3}$/.test(value)) return showError(field, 'CVV must be exactly 3 digits');
                    break;
            }

            clearError(field);
            return true;
        }

        /**
         * Display an inline error message below a field.
         * @returns {boolean} always false (for easy return-chaining)
         */
        function showError(field, message) {
            field.classList.add('error');
            let errorEl = field.parentElement.querySelector('.error-msg');
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'error-msg';
                field.parentElement.appendChild(errorEl);
            }
            errorEl.textContent = message;
            return false;
        }

        /** Remove error styling and message from a field */
        function clearError(field) {
            field.classList.remove('error');
            const errorEl = field.parentElement.querySelector('.error-msg');
            if (errorEl) errorEl.remove();
        }

        // Trigger initial state for payment method
        const checkedRadio = document.querySelector('input[name="payment"]:checked');
        if (checkedRadio) checkedRadio.dispatchEvent(new Event('change'));
    }


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  COMMON — Cart Badge                                                 ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    /**
     * Update the cart count badge in the navbar across all pages.
     * 7. USER-DEFINED FUNCTION
     */
    function updateCartBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const count = cart.getItemCount();
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        });
    }

})();
