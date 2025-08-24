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