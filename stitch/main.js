// ============================================
// BOMBAY ARTISANAL FUSION - MAIN JAVASCRIPT
// Complete website functionality
// ============================================

// ============================================
// 1. CART MANAGEMENT SYSTEM
// ============================================

class Cart {
  constructor() {
    this.items = this.loadCart();
    this.updateCartUI();
  }

  loadCart() {
    const saved = localStorage.getItem('bombay_cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('bombay_cart', JSON.stringify(this.items));
    this.updateCartUI();
    this.renderCart();
  }

  renderCart() {
    const cartItemsContainer = document.querySelector('[data-cart-items]');
    const basketCountEl = document.querySelector('[data-basket-count]');

    if (!cartItemsContainer) return;

    // Update basket count
    if (basketCountEl) {
      const count = this.getItemCount();
      basketCountEl.textContent = `${count} ITEM${count !== 1 ? 'S' : ''}`;
    }

    if (this.items.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-center text-on-surface-variant py-8">Your basket is empty</p>';
      this.updateSummary(0, 0);
      return;
    }

    cartItemsContainer.innerHTML = this.items.map((item, index) => `
      <div class="flex gap-4 group">
        <div class="w-20 h-20 rounded-xl overflow-hidden shrink-0">
          <img alt="${item.name}" class="w-full h-full object-cover" src="${item.image}"/>
        </div>
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold leading-tight">${item.name}</h3>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider">${item.options?.size || 'Standard'} ${item.options?.crust ? '| ' + item.options.crust : ''}</p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 bg-surface-container rounded-lg px-2 py-1">
              <button data-remove-item data-item-index="${index}" class="material-symbols-outlined text-sm hover:text-primary cursor-pointer">remove</button>
              <span class="text-sm font-bold">${item.quantity}</span>
              <button data-add-item data-item-index="${index}" class="material-symbols-outlined text-sm hover:text-primary cursor-pointer">add</button>
            </div>
            <span class="font-bold">₹${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
      </div>
    `).join('');

    // Re-attach event listeners for quantity buttons
    document.querySelectorAll('[data-remove-item]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(btn.getAttribute('data-item-index'));
        const quantity = this.items[index].quantity;
        this.updateQuantity(index, quantity - 1);
      });
    });

    document.querySelectorAll('[data-add-item]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(btn.getAttribute('data-item-index'));
        const quantity = this.items[index].quantity;
        this.updateQuantity(index, quantity + 1);
      });
    });

    // Update summary
    const subtotal = this.getTotal();
    this.updateSummary(subtotal, 0);
  }

  updateSummary(subtotal, discountAmount = 0) {
    const subtotalEl = document.querySelector('[data-subtotal]');
    const taxesEl = document.querySelector('[data-taxes]');
    const discountEl = document.querySelector('[data-discount]');
    const totalEl = document.querySelector('[data-total-amount]');

    const taxRate = 0.09; // 9% GST
    const taxes = subtotal * taxRate;
    const total = subtotal + taxes - discountAmount;

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    if (taxesEl) taxesEl.textContent = `₹${taxes.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-₹${discountAmount.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
  }

  addItem(item) {
    const existingItem = this.items.find(
      (i) => i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options)
    );

    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      this.items.push({
        ...item,
        quantity: item.quantity || 1,
      });
    }
    this.saveCart();
    this.showNotification(`${item.name} added to cart!`);
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.saveCart();
  }

  updateQuantity(index, quantity) {
    if (quantity <= 0) {
      this.removeItem(index);
    } else {
      this.items[index].quantity = quantity;
      this.saveCart();
    }
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  clear() {
    this.items = [];
    this.saveCart();
  }

  updateCartUI() {
    const count = this.getItemCount();
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className =
      'fixed bottom-20 left-4 right-4 md:left-auto md:right-8 bg-primary text-on-primary px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize cart globally
const cart = new Cart();

// ============================================
// 2. MOBILE MENU TOGGLE
// ============================================

function initMobileMenu() {
  const menuButton = document.querySelector('[data-menu-btn]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// ============================================
// 3. HOME PAGE FUNCTIONALITY
// ============================================

function initHomePage() {
  // Add to cart from home page
  const addToCartBtns = document.querySelectorAll('[data-add-to-cart-home]');
  addToCartBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      cart.addItem({
        id: 'home-special',
        name: 'Paneer Tikka Inferno',
        price: 549,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCvt7SvElrharbk1CS5YJyCPb8ke9Zch4WO4LgG2_jbvu0B3I86YybcFqMgC7wgr-soPzSSXlIfvQKTMlCaF_5LBVYL1-D3ci3N_N1BdvuTlTq7L_-T2P7vPXfj0l6nKOGjmKg6wa_CZQosi3DXk0bziK36uzC_Dy4hgCvOxctyUm4U8XAUk9tkPPEm7vsVTBtEtx895H1jmlVgGSzj-F6h1DsiM15NWwrbvTGMLtiY1JFWJLr3oqL0jRAJvwKLr3Uw54JguG9wQFo',
        quantity: 1,
      });
    });
  });
}

// ============================================
// 4. MENU PAGE FUNCTIONALITY
// ============================================

function initMenuPage() {
  // Filter functionality
  const filterBtns = document.querySelectorAll('[data-filter]');
  const menuItems = document.querySelectorAll('[data-menu-item]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('bg-primary', 'text-on-primary'));
      btn.classList.add('bg-primary', 'text-on-primary');

      const filter = btn.getAttribute('data-filter');

      menuItems.forEach((item) => {
        const categories = item.getAttribute('data-categories')?.split(',') || [];
        if (filter === 'all' || categories.includes(filter)) {
          item.style.display = 'flex';
          setTimeout(() => item.style.opacity = '1', 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => (item.style.display = 'none'), 300);
        }
      });
    });
  });

  // Search functionality
  const searchInput = document.querySelector('[data-search]');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      menuItems.forEach((item) => {
        const name = item.getAttribute('data-name')?.toLowerCase() || '';
        const description = item.getAttribute('data-description')?.toLowerCase() || '';

        if (name.includes(query) || description.includes(query)) {
          item.style.display = 'flex';
          setTimeout(() => (item.style.opacity = '1'), 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => (item.style.display = 'none'), 300);
        }
      });
    });
  }

  // Add to cart buttons
  const addToCartBtns = document.querySelectorAll('[data-add-to-cart-menu]');
  addToCartBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const itemCard = e.target.closest('[data-menu-item]');
      const itemId = itemCard.getAttribute('data-id');
      const itemName = itemCard.getAttribute('data-name');
      const itemPrice = parseFloat(itemCard.getAttribute('data-price'));
      const itemImage = itemCard.querySelector('img')?.src || '';

      cart.addItem({
        id: itemId,
        name: itemName,
        price: itemPrice,
        image: itemImage,
        quantity: 1,
      });

      cart.showNotification(`${itemName} added to Spice Basket! 🍕`);
    });
  });
}

// ============================================
// 5. CUSTOMIZER PAGE FUNCTIONALITY
// ============================================

function initCustomizerPage() {
  const basePrice = 549; // Base price for customizer
  let currentSize = 'medium'; // Default size
  let currentCrust = 'thin'; // Default crust
  let selectedToppings = [];

  const priceDisplay = document.querySelector('[data-total-price]');
  const sizeButtons = document.querySelectorAll('[data-size]');
  const crustRadios = document.querySelectorAll('[data-crust]');
  const toppingButtons = document.querySelectorAll('[data-topping]');
  const addToBasketBtn = document.querySelector('[data-add-to-basket]');
  const heatLevelBtns = document.querySelectorAll('[data-heat-level]');

  // Size selection
  sizeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach((b) => {
        b.classList.remove('bg-primary', 'text-on-primary', 'scale-105', 'shadow-lg');
        b.classList.add('bg-surface-container-highest');
      });
      btn.classList.remove('bg-surface-container-highest');
      btn.classList.add('bg-primary', 'text-on-primary', 'scale-105', 'shadow-lg');

      currentSize = btn.getAttribute('data-size');
      updatePrice();
    });
  });

  // Crust selection
  crustRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      currentCrust = radio.getAttribute('data-crust');
      updatePrice();
    });
  });

  // Topping selection
  toppingButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('bg-primary/10');
      btn.classList.toggle('border-primary/40');

      const topping = {
        name: btn.getAttribute('data-topping'),
        price: parseFloat(btn.getAttribute('data-topping-price')),
      };

      const exists = selectedToppings.find((t) => t.name === topping.name);
      if (exists) {
        selectedToppings = selectedToppings.filter((t) => t.name !== topping.name);
      } else {
        selectedToppings.push(topping);
      }

      updatePrice();
    });
  });

  // Heat level selection
  heatLevelBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      heatLevelBtns.forEach((b) => {
        b.classList.remove('bg-secondary-container', 'text-on-secondary-container');
        b.classList.add('text-on-surface-variant');
      });
      btn.classList.remove('text-on-surface-variant');
      btn.classList.add('bg-secondary-container', 'text-on-secondary-container');
    });
  });

  function updatePrice() {
    let total = basePrice;

    // Add crust cost
    const selectedCrustRadio = document.querySelector(`[data-crust="${currentCrust}"]:checked`);
    if (selectedCrustRadio) {
      const crustCost = parseFloat(selectedCrustRadio.getAttribute('data-crust-cost'));
      total += crustCost;
    }

    // Add toppings cost
    selectedToppings.forEach((topping) => {
      total += topping.price;
    });

    if (priceDisplay) {
      priceDisplay.textContent = `₹${total.toFixed(2)}`;
    }

    if (addToBasketBtn) {
      addToBasketBtn.textContent = `Add to Spice Basket — ₹${total.toFixed(2)}`;
      addToBasketBtn.setAttribute('data-item-price', total.toString());
    }
  }

  // Add to cart
  if (addToBasketBtn) {
    addToBasketBtn.addEventListener('click', () => {
      const price = parseFloat(addToBasketBtn.getAttribute('data-item-price'));

      cart.addItem({
        id: `customizer-${Date.now()}`,
        name: 'Paneer Tikka Pizza',
        price: price,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBwCqDd_sdUdtPlYVXk1srdl1NSIe-3FbrRe_YKYqZoMP96Nq7bUw4EuHLk7b_bw79FO653HWfNad2P3gUuRNdbUJAXxJmQy4G4S9nund0KQVvjXAcEmTmk84TtyyuhnZhu45HkWuNyxKsWKvgGjNktJxInZ87gKrvBXjAw0ONzyjEs-0VNnHlQSTpJAzfC2f2ljodtXsJgpCqoBcALPvY2AuOb7e0tZL_JDnbO0gheUe9tcOp93ZOj5nyjZLydYAU_NaJSI5uussY',
        options: {
          size: currentSize,
          crust: currentCrust,
          toppings: selectedToppings,
        },
        quantity: 1,
      });

      cart.showNotification('Added to Spice Basket! 🌶️');
    });
  }

  // Initial price update
  updatePrice();

  // Cart items quantity controls
  const removeButtons = document.querySelectorAll('[data-remove-item]');
  const addButtons = document.querySelectorAll('[data-add-item]');

  removeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(btn.getAttribute('data-item-index'));
      const quantity = cart.items[index].quantity;
      cart.updateQuantity(index, quantity - 1);
    });
  });

  addButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(btn.getAttribute('data-item-index'));
      const quantity = cart.items[index].quantity;
      cart.updateQuantity(index, quantity + 1);
    });
  });

  // Render cart items on page load
  cart.renderCart();
}

// ============================================
// 6. CHECKOUT PAGE FUNCTIONALITY
// ============================================

function initCheckoutPage() {
  const deliveryToggle = document.querySelector('[data-delivery-toggle]');
  const pickupToggle = document.querySelector('[data-pickup-toggle]');
  const deliverySection = document.querySelector('[data-delivery-section]');
  const promoInput = document.querySelector('[data-promo-input]');
  const promoBtn = document.querySelector('[data-promo-btn]');
  const placeOrderBtn = document.querySelector('[data-place-order]');
  const checkoutForm = document.querySelector('[data-checkout-form]');

  let isDelivery = true;
  let appliedPromo = null;

  // Delivery/Pickup toggle
  if (deliveryToggle && pickupToggle) {
    deliveryToggle.addEventListener('click', () => {
      isDelivery = true;
      deliveryToggle.classList.add('bg-surface-container-lowest', 'shadow-sm');
      pickupToggle.classList.remove('bg-surface-container-lowest', 'shadow-sm');
      if (deliverySection) deliverySection.style.display = 'block';
      updateCheckoutTotal();
    });

    pickupToggle.addEventListener('click', () => {
      isDelivery = false;
      pickupToggle.classList.add('bg-surface-container-lowest', 'shadow-sm');
      deliveryToggle.classList.remove('bg-surface-container-lowest', 'shadow-sm');
      if (deliverySection) deliverySection.style.display = 'none';
      updateCheckoutTotal();
    });
  }

  // Promo code application
  if (promoBtn) {
    promoBtn.addEventListener('click', () => {
      const promoCode = promoInput.value.trim().toUpperCase();
      appliedPromo = validatePromoCode(promoCode);

      if (appliedPromo) {
        promoInput.disabled = true;
        promoBtn.disabled = true;
        promoBtn.textContent = '✓ Applied';
        promoBtn.classList.add('bg-green-500');
        updateCheckoutTotal();
      } else {
        cart.showNotification('Invalid promo code');
        promoInput.value = '';
      }
    });
  }

  function validatePromoCode(code) {
    const promoCodes = {
      BOMBAY15: 0.15,
      SPICY20: 0.2,
      INVITE10: 0.1,
      FUSION25: 0.25,
    };

    return promoCodes[code] || null;
  }

  function updateCheckoutTotal() {
    const subtotal = cart.getTotal();
    const deliveryFee = isDelivery ? 45 : 0;
    const tax = (subtotal + deliveryFee) * 0.09;
    let discount = 0;

    if (appliedPromo) {
      discount = subtotal * appliedPromo;
    }

    const total = subtotal + deliveryFee + tax - discount;

    // Update display elements
    const subtotalEl = document.querySelector('[data-subtotal]');
    const deliveryFeeEl = document.querySelector('[data-delivery-fee]');
    const taxEl = document.querySelector('[data-tax]');
    const discountEl = document.querySelector('[data-discount]');
    const totalEl = document.querySelector('[data-checkout-total]');

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = `₹${deliveryFee.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `₹${tax.toFixed(2)}`;
    if (discountEl) {
      discountEl.textContent = `-₹${discount.toFixed(2)}`;
      discountEl.parentElement.style.display = discount > 0 ? 'flex' : 'none';
    }
    if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
  }

  // Form submission
  if (placeOrderBtn && checkoutForm) {
    placeOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const fullName = document.querySelector('[data-full-name]')?.value;
      const phone = document.querySelector('[data-phone]')?.value;
      const address = document.querySelector('[data-address]')?.value;

      if (!fullName || !phone || (isDelivery && !address)) {
        cart.showNotification('Please fill in all required fields');
        return;
      }

      // Validation for phone
      if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
        cart.showNotification('Please enter a valid phone number');
        return;
      }

      // Order confirmation
      const orderData = {
        items: cart.items,
        customer: {
          name: fullName,
          phone: phone,
          address: isDelivery ? address : 'Pickup',
        },
        isDelivery: isDelivery,
        promoCode: appliedPromo ? Object.keys({ BOMBAY15: 0.15, SPICY20: 0.2, INVITE10: 0.1, FUSION25: 0.25 }).find((k) => ({ BOMBAY15: 0.15, SPICY20: 0.2, INVITE10: 0.1, FUSION25: 0.25 })[k] === appliedPromo) : null,
        total: parseFloat(document.querySelector('[data-checkout-total]')?.textContent.replace('₹', '')),
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('bombay_order', JSON.stringify(orderData));
      cart.showNotification('Order placed successfully! 🎉');

      setTimeout(() => {
        cart.clear();
        window.location.href = '../home_page/code.html';
      }, 2000);
    });
  }

  // Initial calculation
  updateCheckoutTotal();
}

// ============================================
// 7. DARK MODE TOGGLE
// ============================================

function initDarkMode() {
  const darkModeToggle = document.querySelector('[data-dark-mode-toggle]');

  if (darkModeToggle) {
    const isDark = localStorage.getItem('bombay_darkMode') === 'true';
    if (isDark) {
      document.documentElement.classList.add('dark');
    }

    darkModeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDarkNow = document.documentElement.classList.contains('dark');
      localStorage.setItem('bombay_darkMode', isDarkNow);
    });
  }
}

// ============================================
// 8. SMOOTH SCROLLING
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// ============================================
// 9. INITIALIZE ALL PAGE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Universal initialization
  initMobileMenu();
  initDarkMode();
  initSmoothScroll();

  // Page-specific initialization
  const currentPage = window.location.pathname;

  if (currentPage.includes('home_page')) {
    initHomePage();
  } else if (currentPage.includes('menu_page')) {
    initMenuPage();
  } else if (currentPage.includes('customizer_cart')) {
    initCustomizerPage();
  } else if (currentPage.includes('checkout')) {
    initCheckoutPage();
  }
});

// ============================================
// 10. UTILITY FUNCTIONS
// ============================================

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

// Validate email
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Cart, cart };
}