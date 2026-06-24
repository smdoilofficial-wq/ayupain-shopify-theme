/**
 * AYUPAIN Premium Theme JavaScript Controller
 * Handles UX enhancements, CRO features, and dynamic cart operations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initAjaxSearch();
  initFaqAccordions();
  initBeforeAfterSlider();
  initVisitorCounter();
  initStockCounter();
  initUrgencyTimer();
  initOrderPopups();
  initCartDrawer();
  initProductPageOperations();
});

/* ==========================================================================
   1. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const headerWrapper = document.querySelector('.site-header-wrapper');
  if (!headerWrapper) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      headerWrapper.querySelector('.site-header').classList.add('site-header--scrolled');
    } else {
      headerWrapper.querySelector('.site-header').classList.remove('site-header--scrolled');
    }
  });
}

/* ==========================================================================
   2. FAQ Accordions
   ========================================================================== */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const panel = item.querySelector('.faq-answer-panel');
    
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other panels
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer-panel').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
}

/* ==========================================================================
   3. Before & After Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.querySelector('.comparison-container');
  if (!container) return;

  const sliderBar = container.querySelector('.comparison-slider-bar');
  const afterImage = container.querySelector('.comparison-image-after');
  
  let isDragging = false;

  const updateSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    
    // Bounds clamping
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    
    sliderBar.style.left = `${percentage}%`;
    afterImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
  };

  const startDrag = (e) => {
    isDragging = true;
    e.preventDefault();
  };

  const stopDrag = () => {
    isDragging = false;
  };

  const dragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateSlider(clientX);
  };

  sliderBar.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('mousemove', dragMove);

  sliderBar.addEventListener('touchstart', startDrag);
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchmove', dragMove);
}

/* ==========================================================================
   4. Live Visitor Counter
   ========================================================================== */
function initVisitorCounter() {
  const countElement = document.getElementById('LiveVisitorCount');
  if (!countElement) return;

  setInterval(() => {
    // Generate organic flux between 85 and 145 visitors
    const current = parseInt(countElement.innerText, 10);
    const deviation = Math.floor(Math.random() * 9) - 4; // -4 to +4
    let next = current + deviation;
    if (next < 80) next = 80;
    if (next > 150) next = 150;
    countElement.innerText = next;
  }, 4000);
}

/* ==========================================================================
   5. Dynamic Stock Counter
   ========================================================================== */
function initStockCounter() {
  const stockElement = document.getElementById('StockCount');
  const barElement = document.getElementById('StockProgressFill');
  if (!stockElement || !barElement) return;

  let currentStock = parseInt(stockElement.innerText, 10);

  // Slow decay over time to stimulate urgency
  const interval = setInterval(() => {
    if (currentStock <= 3) {
      clearInterval(interval);
      return;
    }
    
    // 30% chance to drop 1 item every 15-30 seconds
    if (Math.random() < 0.3) {
      currentStock--;
      stockElement.innerText = currentStock;
      
      // Calculate width percentage (base is 50 bottles)
      const pct = (currentStock / 50) * 100;
      barElement.style.width = `${pct}%`;
    }
  }, 15000);
}

/* ==========================================================================
   6. Urgency Countdown Timer (15 Minutes Rotating Window)
   ========================================================================== */
function initUrgencyTimer() {
  const minutesEl = document.getElementById('TimerMinutes');
  const secondsEl = document.getElementById('TimerSeconds');
  if (!minutesEl || !secondsEl) return;

  let timeLimit = 15 * 60; // 15 mins

  const updateTimerDisplay = () => {
    const m = Math.floor(timeLimit / 60);
    const s = timeLimit % 60;
    minutesEl.innerText = m < 10 ? '0' + m : m;
    secondsEl.innerText = s < 10 ? '0' + s : s;
  };

  updateTimerDisplay();

  const timer = setInterval(() => {
    timeLimit--;
    if (timeLimit < 0) {
      timeLimit = 15 * 60; // reset loop
    }
    updateTimerDisplay();
  }, 1000);
}

/* ==========================================================================
   7. Customer Order Popups (Social Proof Notification Loop)
   ========================================================================== */
function initOrderPopups() {
  const toast = document.getElementById('OrderToast');
  if (!toast) return;

  const names = ['Aarav from Mumbai', 'Priya from Delhi', 'Rajesh from Bangalore', 'Amit from Pune', 'Sneha from Hyderabad', 'Vikram from Chennai', 'Sunita from Kolkata', 'Karan from Ahmedabad', 'Anjali from Jaipur'];
  const times = ['2 minutes ago', '5 minutes ago', 'just now', '1 minute ago', '4 minutes ago'];
  const titles = ['AYUPAIN™ Oil (100ml) Pack of 1', 'AYUPAIN™ Pain Oil - Double Value Pack', 'AYUPAIN™ Ultimate Relief Trio Pack'];
  const thumbs = [
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=150'
  ];

  const updateToastContent = () => {
    const rName = names[Math.floor(Math.random() * names.length)];
    const rTime = times[Math.floor(Math.random() * times.length)];
    const rIdx = Math.floor(Math.random() * titles.length);
    const rTitle = titles[rIdx];
    const rThumb = thumbs[rIdx];

    document.getElementById('OrderToastName').innerText = rName;
    document.getElementById('OrderToastProduct').innerText = rTitle;
    document.getElementById('OrderToastTime').innerText = rTime;
  };

  const triggerToastSequence = () => {
    updateToastContent();
    setTimeout(() => {
      toast.classList.add('active');
    }, 1000);

    // Hide after 6 seconds
    setTimeout(() => {
      toast.classList.remove('active');
    }, 7000);
  };

  // Run first popup after 10s, then repeat every 30s
  setTimeout(triggerToastSequence, 10000);
  setInterval(triggerToastSequence, 32000);
}

/* ==========================================================================
   8. Cart Drawer (Add/Remove items, update shipping target)
   ========================================================================== */
/* Environment Detection */
const isRealShopify = window.location.protocol !== 'file:' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');

let cartItems = [];
const SHIPPING_THRESHOLD = 999; // Free shipping target: ₹999

// Initial load cart check for real Shopify sites
if (isRealShopify) {
  document.addEventListener('DOMContentLoaded', () => {
    refreshRealShopifyCart();
    
    // Intercept form submits for AJAX drawer
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.getAttribute('data-type') === 'add-to-cart-form') {
        // If it's a Buy Now submit, do not intercept (so it redirects to checkout)
        const returnToInput = form.querySelector('input[name="return_to"]');
        if (returnToInput && returnToInput.value) {
          return; 
        }
        
        e.preventDefault();
        const variantId = form.querySelector('[name="id"]').value;
        const qtyInput = form.querySelector('[name="quantity"]');
        const quantity = qtyInput ? parseInt(qtyInput.value, 10) : 1;
        addToCart(variantId, '', 0, '', quantity);
      }
    });
  });
}

function refreshRealShopifyCart() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      cartItems = cart.items.map(item => ({
        id: item.variant_id || item.id,
        name: item.product_title + (item.variant_title ? ' - ' + item.variant_title : ''),
        price: item.price / 100, // Cents to rupees
        image: item.image || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=150',
        quantity: item.quantity,
        handle: item.handle
      }));
      updateGlobalCartBadges();
      renderCartItems();
    })
    .catch(err => console.log('Shopify Cart AJAX offline or bypassed: ', err));
}

function initCartDrawer() {
  const drawerOverlay = document.getElementById('CartDrawerOverlay');
  const openButtons = document.querySelectorAll('.js-open-cart');
  const closeButtons = document.querySelectorAll('.js-close-cart');
  
  if (!drawerOverlay) return;

  const toggleDrawer = (state) => {
    if (state === 'open') {
      drawerOverlay.classList.add('active');
      renderCartItems();
    } else {
      drawerOverlay.classList.remove('active');
    }
  };

  openButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleDrawer('open');
  }));

  closeButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleDrawer('close');
  }));

  drawerOverlay.addEventListener('click', (e) => {
    if (e.target === drawerOverlay) toggleDrawer('close');
  });

  // Attach drawer action to global window so other scripts can fire it
  window.openCartDrawer = () => toggleDrawer('open');
  window.closeCartDrawer = () => toggleDrawer('close');
}

function addToCart(id, name, price, image, quantity = 1) {
  if (isRealShopify) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: String(id),
        quantity: quantity
      })
    })
    .then(response => response.json())
    .then(data => {
      refreshRealShopifyCart();
      window.openCartDrawer();
    })
    .catch(err => {
      console.error('Error adding variant to cart: ', err);
    });
  } else {
    // Simulator local list addition fallback
    const existingItemIndex = cartItems.findIndex(item => item.id === id);
    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({ id, name, price, image, quantity });
    }
    updateGlobalCartBadges();
    window.openCartDrawer();
  }
}

function updateGlobalCartBadges() {
  const badges = document.querySelectorAll('.cart-count-badge');
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  badges.forEach(badge => {
    badge.innerText = totalCount;
    badge.style.display = totalCount > 0 ? 'flex' : 'none';
  });
}

function renderCartItems() {
  const cartBody = document.getElementById('CartDrawerBody');
  const subtotalEl = document.getElementById('CartSubtotalPrice');
  const progressText = document.getElementById('CartShippingGoalText');
  const progressBar = document.getElementById('CartShippingBarFill');
  
  if (!cartBody) return;

  if (cartItems.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty-message">
        <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Your cart is empty. Add AYUPAIN™ to begin your relief journey!</p>
      </div>
    `;
    subtotalEl.innerText = '₹0';
    progressText.innerHTML = `Add only <strong>₹999</strong> more for FREE Shipping!`;
    progressBar.style.width = '0%';
    return;
  }

  // Populate line items
  let html = '';
  let subtotal = 0;

  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    html += `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <span class="cart-item-name">${item.name}</span>
          <div class="cart-item-price-row">
            <span class="cart-item-price">₹${itemTotal}</span>
            <div class="qty-selector" style="height: 32px;">
              <button class="qty-btn" onclick="adjustCartQty(${index}, -1)" style="width: 32px;">-</button>
              <input type="text" class="qty-input" value="${item.quantity}" readonly style="width: 30px; font-size:0.85rem;">
              <button class="qty-btn" onclick="adjustCartQty(${index}, 1)" style="width: 32px;">+</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  // Inject Upsell Box inside Body if double value isn't added
  const hasDoublePack = cartItems.some(item => String(item.name).includes('200ml') || String(item.name).includes('Pack of 2') || item.id === 2);
  if (!hasDoublePack) {
    html += `
      <div class="cart-drawer-upsell-box">
        <div class="cart-drawer-upsell-title">💡 UPGRADE & SAVE EXTRA</div>
        <div class="cart-drawer-upsell-item">
          <div class="cart-drawer-upsell-info">
            <span class="cart-drawer-upsell-name">Double Value Pack (200ml)</span>
            <span class="cart-drawer-upsell-price">₹999</span>
          </div>
          <button class="cart-drawer-upsell-add-btn" onclick="addUpsellToCart()">Upgrade</button>
        </div>
      </div>
    `;
  }

  cartBody.innerHTML = html;
  subtotalEl.innerText = `₹${subtotal}`;

  // Shipping progress updates
  if (subtotal >= SHIPPING_THRESHOLD) {
    progressText.innerText = `Congratulations! You've unlocked FREE Shipping! 🚚`;
    progressBar.style.width = '100%';
  } else {
    const missing = SHIPPING_THRESHOLD - subtotal;
    progressText.innerHTML = `Add only <strong>₹${missing}</strong> more for FREE Shipping!`;
    const percent = (subtotal / SHIPPING_THRESHOLD) * 100;
    progressBar.style.width = `${percent}%`;
  }
}

// Global scope helpers for cart drawer buttons
window.adjustCartQty = (idx, amount) => {
  const item = cartItems[idx];
  const nextQty = item.quantity + amount;

  if (isRealShopify) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: String(item.id),
        quantity: nextQty
      })
    })
    .then(response => response.json())
    .then(cart => {
      refreshRealShopifyCart();
    });
  } else {
    item.quantity = nextQty;
    if (item.quantity <= 0) {
      cartItems.splice(idx, 1);
    }
    updateGlobalCartBadges();
    renderCartItems();
  }
};

window.addUpsellToCart = () => {
  if (isRealShopify) {
    const singleInCart = cartItems.find(item => !item.name.includes('200ml') && !item.name.includes('Pack of 2'));
    const handle = singleInCart ? singleInCart.handle : (window.currentProductHandle || 'ayupain-pain-relief-oil');

    fetch(`/products/${handle}.js`)
      .then(response => {
        if (!response.ok) throw new Error('Product not found');
        return response.json();
      })
      .then(product => {
        const doubleVariant = product.variants.find(v => v.title.includes('200ml')) || product.variants[1] || product.variants[0];
        const singleVariant = product.variants.find(v => v.title.includes('100ml')) || product.variants[0];
        
        // Find single pack quantity currently in cart to replace it
        const qty = singleInCart ? singleInCart.quantity : 1;
        
        // Add double pack
        return fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: String(doubleVariant.id), quantity: qty })
        }).then(() => {
          // Remove single pack
          return fetch('/cart/change.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: String(singleVariant.id), quantity: 0 })
          });
        });
      })
      .then(() => {
        refreshRealShopifyCart();
      })
      .catch(err => {
        console.error('Error upgrading cart: ', err);
      });
  } else {
    // Simulator local list fallback
    const singleIdx = cartItems.findIndex(item => item.id === 1);
    const qty = singleIdx > -1 ? cartItems[singleIdx].quantity : 1;
    if (singleIdx > -1) {
      cartItems.splice(singleIdx, 1);
    }
    addToCart(2, 'AYUPAIN™ Oil (200ml)', 999, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=150', qty);
  }
};

// Expose addition helper
window.addProductToCart = (id, name, price, image) => {
  addToCart(id, name, price, image, 1);
};

/* ==========================================================================
   9. Product Page Operations (Bundles, Sticky ATC)
   ========================================================================== */
function initProductPageOperations() {
  const qtyInput = document.getElementById('ProductQtyInput');
  const qtyMinus = document.getElementById('QtyMinus');
  const qtyPlus = document.getElementById('QtyPlus');
  const bundleOptions = document.querySelectorAll('.bundle-option');
  
  let currentPrice = 599;
  let currentProductTitle = 'AYUPAIN™ Oil (100ml)';
  let currentProductId = 1;
  const productImage = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=150';

  // Initialize variables from pre-selected variants on real store
  const selectedVariantEl = document.getElementById('SelectedVariantId');
  if (selectedVariantEl) {
    currentProductId = parseInt(selectedVariantEl.value, 10) || 1;
    const activeBundleOpt = document.querySelector('.bundle-option.active');
    if (activeBundleOpt) {
      currentProductTitle = activeBundleOpt.getAttribute('data-title') || currentProductTitle;
      currentPrice = parseInt(activeBundleOpt.getAttribute('data-price'), 10) || currentPrice;
    }
  }

  // Quantity controllers
  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      let currentVal = parseInt(qtyInput.value, 10);
      if (currentVal > 1) {
        qtyInput.value = currentVal - 1;
      }
    });

    qtyPlus.addEventListener('click', () => {
      let currentVal = parseInt(qtyInput.value, 10);
      qtyInput.value = currentVal + 1;
    });
  }

  // Bundle Selector Logic
  bundleOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      bundleOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      
      // Update variables based on selected card
      currentProductId = parseInt(opt.getAttribute('data-id'), 10);
      currentProductTitle = opt.getAttribute('data-title');
      currentPrice = parseInt(opt.getAttribute('data-price'), 10);

      // Update pricing DOM in mock store
      const buyBox = opt.closest('.product-buy-box');
      if (buyBox) {
        const curPriceEl = buyBox.querySelector('.price-current');
        const cmpPriceEl = buyBox.querySelector('.price-compare');
        const discEl = buyBox.querySelector('.price-discount-tag');
        
        if (curPriceEl) curPriceEl.innerText = '₹' + currentPrice;
        
        if (cmpPriceEl) {
          const compPrice = currentPrice === 599 ? 999 : currentPrice === 999 ? 1998 : 2997;
          cmpPriceEl.innerText = '₹' + compPrice;
          if (discEl) {
            const pct = Math.round(((compPrice - currentPrice) / compPrice) * 100);
            discEl.innerText = '(Save ' + pct + '%)';
          }
        }
      }
    });
  });

  // Main Add to Cart trigger
  const mainAtc = document.getElementById('MainAddToCart');
  if (mainAtc) {
    mainAtc.addEventListener('click', (e) => {
      if (isRealShopify) {
        // If we are on a real Shopify store, let the form submit event handle it
        return;
      }
      const q = qtyInput ? parseInt(qtyInput.value, 10) : 1;
      addToCart(currentProductId, currentProductTitle, currentPrice, productImage, q);
    });
  }

  // Sticky Mobile ATC
  const stickyMobileAtc = document.getElementById('StickyMobileAddToCart');
  const stickyCtaWrapper = document.querySelector('.sticky-mobile-cta');
  if (stickyMobileAtc) {
    stickyMobileAtc.addEventListener('click', () => {
      addToCart(currentProductId, currentProductTitle, currentPrice, productImage, 1);
    });
  }

  // Toggle sticky mobile CTA visibility on scroll
  if (mainAtc && stickyCtaWrapper) {
    window.addEventListener('scroll', () => {
      const mainBtnRect = mainAtc.getBoundingClientRect();
      // If the main buy button is scrolled out of viewport, show sticky CTA
      if (mainBtnRect.bottom < 0) {
        stickyCtaWrapper.classList.add('active');
      } else {
        stickyCtaWrapper.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   10. Mobile Menu Drawer & AJAX Predictive Search
   ========================================================================== */

function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const menuDrawer = document.getElementById('MobileMenuDrawer');
  if (!menuBtn || !menuDrawer) return;

  const closeBtn = menuDrawer.querySelector('.mobile-menu-drawer__close');
  const overlay = menuDrawer.querySelector('.mobile-menu-drawer__overlay');

  const openDrawer = () => {
    menuDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    menuDrawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openDrawer();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
}

function initAjaxSearch() {
  const searchTriggers = document.querySelectorAll('.js-open-search');
  const searchDrawer = document.getElementById('SearchDrawer');
  if (!searchDrawer) return;

  const closeBtn = searchDrawer.querySelector('.search-drawer__close');
  const overlay = searchDrawer.querySelector('.search-drawer__overlay');
  const searchInput = document.getElementById('SearchDrawerInput');
  const loader = searchDrawer.querySelector('.search-drawer__loader');
  const resultsContainer = document.getElementById('SearchResultsContainer');

  const openSearch = (e) => {
    if (e) e.preventDefault();
    searchDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput && searchInput.focus(), 250);
  };

  const closeSearch = () => {
    searchDrawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  searchTriggers.forEach(trigger => trigger.addEventListener('click', openSearch));
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  if (overlay) overlay.addEventListener('click', closeSearch);

  // Debounce helper
  let debounceTimeout = null;

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimeout);
      const query = e.target.value.trim();

      if (query.length === 0) {
        resultsContainer.innerHTML = `
          <div class="search-drawer__empty-state">
            <p>Type to search... e.g. "Oil", "Joint Relief", "Nirgundi"</p>
          </div>
        `;
        if (loader) loader.style.display = 'none';
        return;
      }

      if (loader) loader.style.display = 'flex';

      debounceTimeout = setTimeout(() => {
        performSearch(query);
      }, 300);
    });
  }

  function performSearch(query) {
    if (isRealShopify) {
      // Real Shopify Predictive Search API
      fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=6`)
        .then(response => {
          if (!response.ok) throw new Error('Search failed');
          return response.json();
        })
        .then(data => {
          const products = data.resources.results.products;
          renderSearchResults(products);
        })
        .catch(err => {
          console.error('AJAX Search error: ', err);
          renderSearchResults([]);
        });
    } else {
      // Fallback/Simulated Search (for local files preview)
      setTimeout(() => {
        const mockProducts = [
          {
            title: "AYUPAIN™ Oil (100ml) Pack of 1",
            url: "#product",
            price: "59900",
            price_formatted: "₹599",
            compare_at_price: "99900",
            compare_price_formatted: "₹999",
            image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=150"
          },
          {
            title: "AYUPAIN™ Pain Oil - Double Value Pack (200ml)",
            url: "#product",
            price: "99900",
            price_formatted: "₹999",
            compare_at_price: "199800",
            compare_price_formatted: "₹1998",
            image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=150"
          },
          {
            title: "AYUPAIN™ Ultimate Relief Trio Pack (300ml)",
            url: "#product",
            price: "139900",
            price_formatted: "₹1399",
            compare_at_price: "299700",
            compare_price_formatted: "₹2997",
            image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=150"
          }
        ];

        // Filter based on query
        const filtered = mockProducts.filter(p => 
          p.title.toLowerCase().includes(query.toLowerCase()) || 
          query.toLowerCase().includes('oil') ||
          query.toLowerCase().includes('ayupain')
        );

        // Convert format to match rendering expectations
        const formattedResults = filtered.map(p => ({
          title: p.title,
          url: p.url,
          price: p.price_formatted,
          compare_at_price: p.compare_price_formatted,
          image: p.image
        }));

        renderSearchResults(formattedResults);
      }, 400);
    }
  }

  function renderSearchResults(products) {
    if (loader) loader.style.display = 'none';

    if (!products || products.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-drawer__empty-state">
          <p>No results found for "${escapeHTML(searchInput.value)}". Try searching for "Oil".</p>
        </div>
      `;
      return;
    }

    let html = '<div class="predictive-search-results">';
    products.forEach(product => {
      let priceText = product.price;
      let comparePriceText = product.compare_at_price;

      if (typeof product.price === 'number') {
        priceText = '₹' + (product.price / 100).toFixed(0);
      }
      if (typeof product.compare_at_price === 'number' && product.compare_at_price > 0) {
        comparePriceText = '₹' + (product.compare_at_price / 100).toFixed(0);
      } else if (product.compare_at_price === null || product.compare_at_price === undefined) {
        comparePriceText = '';
      }

      html += `
        <a href="${product.url}" class="predictive-search-item">
          <div class="predictive-search-item__image">
            <img src="${product.image || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=150'}" alt="${escapeHTML(product.title)}">
          </div>
          <div class="predictive-search-item__info">
            <span class="predictive-search-item__title">${escapeHTML(product.title)}</span>
            <div class="predictive-search-item__price-row">
              <span class="predictive-search-item__price">${priceText}</span>
              ${comparePriceText ? `<span class="predictive-search-item__compare-price">${comparePriceText}</span>` : ''}
            </div>
          </div>
        </a>
      `;
    });
    html += '</div>';

    resultsContainer.innerHTML = html;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}
