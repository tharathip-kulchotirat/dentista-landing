// Modern JavaScript with ES6+ features

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initScreenshotsSlider();
    initTestimonialsSlider();
    initBackToTop();
    initAOS();
    updateCopyrightYear();
});

// Initialize sticky header
function initHeader() {
    const header = document.getElementById('header');
    
    function toggleHeaderClass() {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }
    
    // Initial check
    toggleHeaderClass();
    
    // Add scroll event listener
    window.addEventListener('scroll', toggleHeaderClass);
}

// Initialize mobile menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!menuToggle || !mobileMenu) return;
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// Initialize smooth scrolling for anchor links
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize screenshots slider
function initScreenshotsSlider() {
    const slider = document.querySelector('.screenshots-slider');
    const sliderDots = document.querySelector('.slider-dots');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    
    if (!slider || !sliderDots) return;
    
    const screenshots = slider.querySelectorAll('.screenshot');
    if (screenshots.length === 0) return;
    
    let currentIndex = 0;
    let slideWidth = screenshots[0].offsetWidth + 25; // width + gap
    let isMobile = window.innerWidth <= 768;
    
    // Create dots
    screenshots.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        
        sliderDots.appendChild(dot);
    });
    
    // Previous slide button
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    }
    
    // Next slide button
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        // Handle index bounds
        if (index < 0) {
            index = screenshots.length - 1;
        } else if (index >= screenshots.length) {
            index = 0;
        }
        
        currentIndex = index;
        updateSlider();
    }
    
    // Update slider position and active dot
    function updateSlider() {
        // Update slider position
        if (isMobile) {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        } else {
            slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }
        
        // Update active dot
        const dots = sliderDots.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 768;
        
        // Only update if mobile state changed
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            slideWidth = screenshots[0].offsetWidth + 25;
            updateSlider();
        }
    });
    
    // Auto slide every 5 seconds
    setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);
}

// Initialize testimonials slider
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const dotsContainer = document.querySelector('.testimonials-dots');
    
    if (!slider || !dotsContainer) return;
    
    const testimonials = slider.querySelectorAll('.testimonial');
    if (testimonials.length === 0) return;
    
    let currentIndex = 0;
    
    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    // Update slider
    function goToSlide(index) {
        if (index < 0) {
            index = testimonials.length - 1;
        } else if (index >= testimonials.length) {
            index = 0;
        }
        
        currentIndex = index;
        
        // Update slider position
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active dot
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }
    
    // Auto slide every 6 seconds
    setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 6000);
    
    // Touch events for mobile swiping
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            goToSlide(currentIndex + 1);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            goToSlide(currentIndex - 1);
        }
    }
}

// Initialize back to top button
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Update copyright year
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialize AOS (Animate On Scroll) library
function initAOS() {
    // Check if AOS is available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 50
        });
    }
}

// Track app downloads - simulated function
function trackDownload(platform) {
    console.log(`App download clicked for ${platform} platform`);
    
    // In a real implementation, this would send analytics data to a server
    // For demo purposes, show alert
    const message = `Thank you for your interest in downloading Dentista Photo for ${platform}! 
                    The app would begin downloading if it were available in the store.`;
    
    // Show toast notification instead of alert
    showToast(message);
}

// Show toast notification
function showToast(message, duration = 4000) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast-notification');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
        
        // Add CSS for toast
        const style = document.createElement('style');
        style.textContent = `
            .toast-notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                max-width: 80%;
                text-align: center;
                z-index: 9999;
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            .toast-notification.show {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set message
    toast.textContent = message;
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}