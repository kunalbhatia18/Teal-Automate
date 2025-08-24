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