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