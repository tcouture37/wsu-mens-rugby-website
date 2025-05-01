// Main JavaScript for Rugby Team Website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Rugby Team Website Loaded');
    
    // Mobile navigation toggle functionality
    setupMobileNav();
    
    // Initialize upcoming match countdown
    initMatchCountdown();
    
    // Image lazy loading
    setupLazyLoading();
});

// Mobile Navigation
function setupMobileNav() {
    // This is a placeholder for mobile navigation functionality
    // In a real implementation, you would add a hamburger menu toggle
    
    // Example code for a future mobile navigation implementation:
    // const mobileMenuButton = document.createElement('button');
    // mobileMenuButton.className = 'mobile-menu-toggle';
    // mobileMenuButton.innerHTML = '<span></span><span></span><span></span>';
    // document.querySelector('nav').appendChild(mobileMenuButton);
    // 
    // mobileMenuButton.addEventListener('click', function() {
    //     document.querySelector('.nav-links').classList.toggle('show');
    // });
}

// Match Countdown
function initMatchCountdown() {
    // Find all upcoming matches
    const matches = document.querySelectorAll('.match');
    
    if (matches.length === 0) return;
    
    // Get the date of the first upcoming match
    const nextMatchElement = matches[0].querySelector('.match-date');
    if (!nextMatchElement) return;
    
    const nextMatchDateText = nextMatchElement.textContent;
    const nextMatchDate = new Date(nextMatchDateText);
    
    // Check if we could parse the date correctly
    if (isNaN(nextMatchDate.getTime())) return;
    
    // Create countdown element if it doesn't exist yet
    let countdownElement = document.querySelector('.match-countdown');
    if (!countdownElement) {
        countdownElement = document.createElement('div');
        countdownElement.className = 'match-countdown';
        matches[0].appendChild(countdownElement);
    }
    
    // Update the countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    function updateCountdown() {
        const now = new Date();
        const distance = nextMatchDate.getTime() - now.getTime();
        
        // If the match date has passed
        if (distance < 0) {
            countdownElement.innerHTML = 'Match in progress or completed!';
            return;
        }
        
        // Calculate days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the countdown
        countdownElement.innerHTML = `Next match in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
}

// Lazy Loading for Images
function setupLazyLoading() {
    // Check if the browser supports Intersection Observer
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        // Load all images immediately
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// News Section Animation
document.querySelectorAll('.news-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
});

// Form Validation for Contact Page (if it exists)
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        let isValid = true;
        
        // Basic email validation
        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput && !validateEmail(emailInput.value)) {
            isValid = false;
            showError(emailInput, 'Please enter a valid email address');
        }
        
        // Prevent form submission if validation fails
        if (!isValid) {
            e.preventDefault();
        }
    });
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
        
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorElement);
        }
        
        input.classList.add('input-error');
    }
}