// AutomateMeetings Production Bundle
// Centralized Components for AutomateMeetings
(function() {
  'use strict';

  // Component HTML templates
  const components = {
    navbar: `
      <header class="header" role="banner">
        <div class="container header-inner">
          <a href="/" class="logo" aria-label="AutomateMeetings home">
            <svg class="logo-icon" aria-hidden="true"><use href="#am-mark"/></svg>
            <span class="logo-text">AutomateMeetings</span>
          </a>
          <nav class="nav" aria-label="Primary navigation">
            <a href="/#product">Product</a>
            <a href="/#how">How it works</a>
            <a href="/#results">Results</a>
            <a href="/#trust">Trust</a>
            <a href="/#faq">FAQ</a>
          </nav>
          <div class="nav-cta">
            <button class="btn btn-secondary" aria-label="Book a demo" data-cal-link="kunalbhatia/15min" data-cal-namespace="15min" data-cal-config='{"layout":"month_view"}'>Book demo</button>
            <button class="btn btn-primary" data-testid="cta-header" data-cal-link="kunalbhatia/15min" data-cal-namespace="15min" data-cal-config='{"layout":"month_view"}'>
              Talk to sales
              <svg class="icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none"/></svg>
            </button>
          </div>
          <button class="menu-btn" aria-label="Open menu" aria-expanded="false">
            <svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </header>
      
      <!-- Mobile menu overlay -->
      <div class="menu-overlay" aria-hidden="true"></div>
      
      <!-- Mobile menu sidebar -->
      <div class="menu-sidebar" aria-hidden="true">
        <div class="menu-header">
          <a href="/" class="logo" aria-label="AutomateMeetings home">
            <svg class="logo-icon" aria-hidden="true"><use href="#am-mark"/></svg>
            <span class="logo-text">AutomateMeetings</span>
          </a>
          <button class="menu-close" aria-label="Close menu">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <nav class="menu-nav">
          <a href="/#product">Product</a>
          <a href="/#how">How it works</a>
          <a href="/#results">Results</a>
          <a href="/#trust">Trust</a>
          <a href="/#faq">FAQ</a>
        </nav>
        <div class="menu-cta">
          <button class="btn btn-primary btn-block" data-testid="cta-menu" data-cal-link="kunalbhatia/15min" data-cal-namespace="15min" data-cal-config='{"layout":"month_view"}'>
            Talk to sales
            <svg class="icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
      </div>
    `,
    
    footer: `
      <footer class="footer" role="contentinfo">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div style="display:flex; align-items:center; gap:8px">
                <svg class="footer-logo" aria-hidden="true"><use href="#am-mark"/></svg>
                <span style="font-size:14px; font-weight:600">AutomateMeetings</span>
              </div>
              <p class="footer-desc">Convert more of your high-intent traffic into qualified, attended sales meetings.</p>
            </div>
            <div class="footer-section"><h4>Product</h4><ul class="footer-links"><li><a href="/#product">AI SDR Engine</a></li><li><a href="/#how">How it works</a></li><li><a href="/#results">Outcomes</a></li></ul></div>
            <div class="footer-section"><h4>Company</h4><ul class="footer-links"><li><a href="/#trust">Security & Trust</a></li><li><a href="/#faq">FAQ</a></li><li><a href="/#contact">Contact</a></li></ul></div>
            <div class="footer-section"><h4>Contact</h4><ul class="footer-links"><li><a href="mailto:sales@automatemeetings.com">sales@automatemeetings.com</a></li></ul></div>
          </div>
          <div class="footer-bottom"><p id="copyright">© <span id="year"></span> AutomateMeetings. All rights reserved.</p><div class="footer-legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/#trust">Security</a></div></div>
        </div>
      </footer>
    `
  };

  // Component loader
  window.AM = window.AM || {};
  
  // Mobile menu functionality
  window.AM.initMobileMenu = function() {
    const menuBtn = document.querySelector('.menu-btn');
    const menuClose = document.querySelector('.menu-close');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuSidebar = document.querySelector('.menu-sidebar');
    const menuLinks = document.querySelectorAll('.menu-nav a');
    
    if (!menuBtn || !menuSidebar) return;
    
    function openMenu() {
      menuSidebar.setAttribute('aria-hidden', 'false');
      menuOverlay.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
      menuSidebar.setAttribute('aria-hidden', 'true');
      menuOverlay.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    
    menuBtn.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
    
    // Close menu when clicking on a link
    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  };
  
  window.AM.loadComponents = function() {
    // All files are now in the same directory, no subdirectory handling needed
    let navbarHtml = components.navbar;
    let footerHtml = components.footer;
    // Load navbar - replace the div with the header element
    const navbarEl = document.getElementById('navbar');
    if (navbarEl) {
      navbarEl.outerHTML = navbarHtml;
    }
    
    // Load footer - replace the div with the footer element
    const footerEl = document.getElementById('footer');
    if (footerEl) {
      footerEl.outerHTML = footerHtml;
      // Set year
      const yearEl = document.getElementById('year');
      if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
      }
    }
    
    // Initialize mobile menu functionality
    window.AM.initMobileMenu();
  };

  // Auto-load on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.AM.loadComponents);
  } else {
    window.AM.loadComponents();
  }
})();

// Simple client-side router for React-like behavior
(function() {
  'use strict';

  window.AM = window.AM || {};

  // Check if running from file:// protocol
  const isFileProtocol = window.location.protocol === 'file:';

  // Router implementation
  window.AM.Router = {
    init: function() {
      // Handle all internal navigation clicks
      document.addEventListener('click', function(e) {
        // Check if it's an internal link
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Skip external links, mailto, tel, and Cal.com buttons
        if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || link.hasAttribute('data-cal-link')) {
          return;
        }
        
        // Handle hash navigation (both #, /#, and ./#)
        if (href.startsWith('#') || href.startsWith('/#') || href.startsWith('./#')) {
          e.preventDefault();
          const hash = href.replace(/^\.?\/?#/, '');
          
          // Check if we're on the homepage (index.html or /)
          const isHomepage = window.location.pathname === '/' || 
                           window.location.pathname.endsWith('index.html') ||
                           window.location.pathname.endsWith('/');
          
          if (isHomepage) {
            // We're on homepage, just scroll to section
            const target = document.getElementById(hash);
            if (target) {
              // Get the position of the target element
              const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
              // Account for sticky navbar height (64px + some padding)
              const offsetPosition = targetPosition - 80;
              
              // Smooth scroll to target with offset
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
              
              // Update URL hash without page reload
              if (!isFileProtocol) {
                history.replaceState(null, '', '#' + hash);
              }
            }
          } else {
            // We're on another page, navigate to homepage with hash
            window.location.href = '/#' + hash;
          }
          return;
        }
        
        // Handle navigation to other pages with hash (like index.html#product)
        if (href.includes('.html#')) {
          // For same page hash navigation
          if (href.startsWith(window.location.pathname.split('/').pop() + '#')) {
            e.preventDefault();
            const hash = href.split('#')[1];
            const target = document.getElementById(hash);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
            return;
          }
          // For different page, let browser handle naturally
          return;
        }
        
        // Handle internal page navigation with smooth transition
        if (href.endsWith('.html')) {
          e.preventDefault();
          window.AM.Router.navigate(href);
        }
      });
      
      // Only handle popstate if not file protocol
      if (!isFileProtocol) {
        window.addEventListener('popstate', function() {
          window.location.reload();
        });
      }
    },
    
    navigate: function(url) {
      // Navigate immediately without transition
      window.location.href = url;
    },
    
    handleInitialHash: function() {
      // Check if there's a hash in the URL on page load
      if (window.location.hash) {
        setTimeout(function() {
          const hash = window.location.hash.substring(1);
          const target = document.getElementById(hash);
          if (target) {
            // Get the position of the target element
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            // Account for sticky navbar height (64px + some padding)
            const offsetPosition = targetPosition - 80;
            
            // Scroll to target
            window.scrollTo({
              top: offsetPosition,
              behavior: 'auto' // instant scroll on page load
            });
          }
        }, 100); // Small delay to ensure page is fully loaded
      }
    }
  };

  // Initialize router
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.AM.Router.init();
      // Handle hash on page load
      window.AM.Router.handleInitialHash();
    });
  } else {
    window.AM.Router.init();
    // Handle hash on page load
    window.AM.Router.handleInitialHash();
  }
})();

// AutomateMeetings Analytics Tracking
(function() {
  'use strict';

  // Only track analytics on production
  const isProduction = window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1' && 
                      window.location.protocol !== 'file:';

  if (!isProduction) return;

  // Wait for gtag to be available
  function waitForGtag(callback) {
    if (typeof gtag !== 'undefined') {
      callback();
    } else {
      setTimeout(() => waitForGtag(callback), 100);
    }
  }

  // Track custom events
  function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'marketing',
        ...parameters
      });
      // Debug logging removed for production
    }
  }

  // Initialize analytics after DOM loads
  function initAnalytics() {
    waitForGtag(() => {
      
      // 1. CTA Click Tracking
      document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-testid]');
        if (!target) return;

        const testId = target.getAttribute('data-testid');
        if (testId === 'cta-hero') {
          trackEvent('cta_hero_click', {
            button_text: target.textContent.trim(),
            page_location: window.location.pathname
          });
        } else if (testId === 'cta-footer') {
          trackEvent('cta_footer_click', {
            button_text: target.textContent.trim(),
            page_location: window.location.pathname
          });
        }
      });

      // 2. Cal.com Modal Tracking
      document.addEventListener('click', (e) => {
        const calButton = e.target.closest('[data-cal-link]');
        if (calButton) {
          const calLink = calButton.getAttribute('data-cal-link');
          const buttonText = calButton.textContent.trim();
          
          trackEvent('cal_modal_open', {
            cal_link: calLink,
            button_text: buttonText,
            button_location: calButton.getAttribute('data-testid') || 'unknown'
          });
        }
      });

      // 3. Scroll Depth Tracking
      let scrollDepths = [25, 50, 75, 100];
      let trackedDepths = new Set();
      
      function trackScrollDepth() {
        const scrollPercent = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        scrollDepths.forEach(depth => {
          if (scrollPercent >= depth && !trackedDepths.has(depth)) {
            trackedDepths.add(depth);
            trackEvent('scroll_depth', {
              depth_percent: depth,
              page_location: window.location.pathname
            });
          }
        });
      }

      // Throttled scroll tracking
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScrollDepth, 250);
      });

      // 4. Section View Tracking (Intersection Observer)
      const sectionsToTrack = [
        { selector: '#product', name: 'product' },
        { selector: '#how', name: 'how_it_works' },
        { selector: '#results', name: 'results' },
        { selector: '#trust', name: 'trust' },
        { selector: '#faq', name: 'faq' },
        { selector: '#contact', name: 'contact' }
      ];

      if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const sectionName = entry.target.getAttribute('data-analytics-section');
              trackEvent('section_view', {
                section_name: sectionName,
                page_location: window.location.pathname
              });
              sectionObserver.unobserve(entry.target);
            }
          });
        }, {
          rootMargin: '0px 0px -20% 0px',
          threshold: 0.1
        });

        sectionsToTrack.forEach(({ selector, name }) => {
          const element = document.querySelector(selector);
          if (element) {
            element.setAttribute('data-analytics-section', name);
            sectionObserver.observe(element);
          }
        });
      }

      // 5. Mobile Menu Tracking
      document.addEventListener('click', (e) => {
        if (e.target.closest('.menu-btn')) {
          trackEvent('mobile_menu_open', {
            page_location: window.location.pathname
          });
        }
      });

      // 6. Navigation Link Tracking
      document.addEventListener('click', (e) => {
        const navLink = e.target.closest('.nav a, .footer-links a');
        if (navLink && navLink.getAttribute('href').startsWith('/#')) {
          const section = navLink.getAttribute('href').substring(2);
          trackEvent('navigation_click', {
            link_section: section,
            link_location: navLink.closest('.nav') ? 'header' : 'footer',
            page_location: window.location.pathname
          });
        }
      });

      // 7. Time on Page Tracking
      const startTime = Date.now();
      let timeTracked = false;
      
      function trackTimeOnPage() {
        if (!timeTracked) {
          const timeSpent = Math.round((Date.now() - startTime) / 1000);
          trackEvent('time_on_page', {
            time_seconds: timeSpent,
            page_location: window.location.pathname
          });
          timeTracked = true;
        }
      }

      // Track time on page after 30 seconds
      setTimeout(trackTimeOnPage, 30000);

      // Track when user leaves page
      window.addEventListener('beforeunload', trackTimeOnPage);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) trackTimeOnPage();
      });

      // 8. External Link Tracking
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (link && (link.hostname !== window.location.hostname || link.getAttribute('href').startsWith('mailto:'))) {
          const href = link.getAttribute('href');
          trackEvent('external_link_click', {
            link_url: href,
            link_text: link.textContent.trim(),
            page_location: window.location.pathname
          });
        }
      });

      // Analytics initialized
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
  } else {
    initAnalytics();
  }

})();