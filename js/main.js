// Main JavaScript for Rugby Team Website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Winona State Men\'s Rugby Website Loaded');
    
    // Mobile navigation toggle functionality
    setupMobileNav();
    
    // Initialize upcoming match countdown
    initMatchCountdown();
    
    // Image lazy loading
    setupLazyLoading();
    
    // Dark mode toggle
    setupDarkMode();
    
    // Initialize animations
    initAnimations();
});

// Mobile Navigation
function setupMobileNav() {
    const mobileMenuButton = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            
            // Animate the hamburger icon
            const spans = this.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
            
            // Accessibility
            const expanded = navLinks.classList.contains('show');
            this.setAttribute('aria-expanded', expanded);
            
            // Close the menu when clicking outside
            if (expanded) {
                document.addEventListener('click', closeMenuOutside);
            } else {
                document.removeEventListener('click', closeMenuOutside);
            }
        });
        
        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('show');
                mobileMenuButton.querySelectorAll('span').forEach(span => span.classList.remove('active'));
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Function to close menu when clicking outside
        function closeMenuOutside(e) {
            if (!navLinks.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                navLinks.classList.remove('show');
                mobileMenuButton.querySelectorAll('span').forEach(span => span.classList.remove('active'));
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                document.removeEventListener('click', closeMenuOutside);
            }
        }
    }
}

// Match Countdown
function initMatchCountdown() {
    // Find all upcoming matches
    const matches = document.querySelectorAll('.match');
    
    if (matches.length === 0) return;
    
    // Get the date of the first upcoming match
    const nextMatchElement = matches[0].querySelector('.match-date');
    if (!nextMatchElement) return;
    
    // Extract date components
    const monthElement = nextMatchElement.querySelector('.month');
    const dayElement = nextMatchElement.querySelector('.day');
    const yearElement = nextMatchElement.querySelector('.year');
    
    if (!monthElement || !dayElement || !yearElement) return;
    
    const month = monthElement.textContent;
    const day = dayElement.textContent;
    const year = yearElement.textContent;
    
    const nextMatchDateText = `${month} ${day}, ${year}`;
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
        countdownElement.innerHTML = `
            <div class="countdown-item">
                <span class="countdown-number">${days}</span>
                <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${hours}</span>
                <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${minutes}</span>
                <span class="countdown-label">Minutes</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${seconds}</span>
                <span class="countdown-label">Seconds</span>
            </div>
        `;
    }
}

// Dark Mode Toggle
function setupDarkMode() {
    const themeSwitch = document.getElementById('theme-switch');
    
    if (themeSwitch) {
        // Check for saved preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
        }
        
        themeSwitch.addEventListener('click', function() {
            // Toggle dark mode class
            document.body.classList.toggle('dark-mode');
            
            // Save preference
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
}

// Lazy Loading for Images
function setupLazyLoading() {
    // Check if the browser supports Intersection Observer
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if (lazyImages.length === 0) return;
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Ensure the image has a data-src attribute to replace
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    // Fade in the image
                    img.style.opacity = '0';
                    setTimeout(() => {
                        img.style.transition = 'opacity 0.5s ease-in-out';
                        img.style.opacity = '1';
                    }, 50);
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '0px 0px 50px 0px' // Start loading images when they are 50px from the viewport
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

// Initialize animations
function initAnimations() {
    // Scroll reveal animation for sections
    if ('IntersectionObserver' in window) {
        const sections = document.querySelectorAll('section');
        
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        });
        
        sections.forEach(section => {
            section.classList.add('reveal-section');
            sectionObserver.observe(section);
        });
    }
    
    // Button hover effects
    const buttons = document.querySelectorAll('.cta-button, .match-details, .read-more');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // News card hover effects
    const newsItems = document.querySelectorAll('.news-item');
    
    newsItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const image = this.querySelector('.news-img img');
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const image = this.querySelector('.news-img img');
            if (image) {
                image.style.transform = '';
            }
        });
    });
}

// Form Validation for Contact Page (if it exists)
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Results page functionality
    initResultsPage();
    
    // Donation page functionality
    initDonationPage();
});

// Initialize Results Page functionality
function initResultsPage() {
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-button');
    const seasonSummaries = document.querySelectorAll('.season-summary');
    const historicResults = document.querySelector('.historic-results');
    
    if (filterButtons.length > 0 && seasonSummaries.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get season filter value
                const season = this.getAttribute('data-season');
                
                // Handle filtering logic
                if (season === 'all') {
                    // Show all seasons
                    seasonSummaries.forEach(summary => summary.style.display = 'block');
                    if (historicResults) historicResults.style.display = 'block';
                } else if (season === 'archive') {
                    // Show only archive
                    seasonSummaries.forEach(summary => summary.style.display = 'none');
                    if (historicResults) historicResults.style.display = 'block';
                } else {
                    // Show specific season
                    if (historicResults) historicResults.style.display = 'none';
                    seasonSummaries.forEach(summary => {
                        const seasonHeader = summary.querySelector('h3').textContent;
                        if (seasonHeader.includes(season)) {
                            summary.style.display = 'block';
                        } else {
                            summary.style.display = 'none';
                        }
                    });
                }
            });
        });
    }
    
    // Historic seasons expandable functionality
    const historicHeaders = document.querySelectorAll('.historic-season-header');
    
    if (historicHeaders.length > 0) {
        historicHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const seasonId = this.getAttribute('data-season');
                const details = document.getElementById('season-' + seasonId);
                const toggleIcon = this.querySelector('.toggle-icon');
                
                // Toggle the display of details
                if (details.style.display === 'block') {
                    details.style.display = 'none';
                    toggleIcon.textContent = '+';
                } else {
                    // Load season details via AJAX or reveal pre-loaded content
                    details.style.display = 'block';
                    toggleIcon.textContent = '−';
                    
                    // For demo purposes, we're just setting a placeholder message
                    if (details.innerHTML.trim() === '') {
                        details.innerHTML = `<p class="loading-data">Loading ${seasonId} season data...</p>`;
                        
                        // Simulate loading data
                        setTimeout(() => {
                            details.innerHTML = `
                                <div class="historic-details-content">
                                    <div class="historic-record">Final Record: ${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 2)}</div>
                                    <p>Detailed season results would be displayed here for the ${seasonId} season.</p>
                                </div>
                            `;
                        }, 1000);
                    }
                }
            });
        });
    }
}

// Initialize Donation Page functionality
function initDonationPage() {
    // Show/hide the "other amount" field based on dropdown selection
    const donationAmount = document.getElementById('donation-amount');
    const otherAmountContainer = document.getElementById('other-amount-container');
    
    if (donationAmount && otherAmountContainer) {
        donationAmount.addEventListener('change', function() {
            if (this.value === 'other') {
                otherAmountContainer.style.display = 'block';
            } else {
                otherAmountContainer.style.display = 'none';
            }
        });
    }
    
    // Donation form validation and submit handling
    const donationForm = document.getElementById('donation-form');
    
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual form submission
            
            let isValid = true;
            let errorMessages = [];
            
            // Basic validation
            const firstName = this.querySelector('#first-name');
            const lastName = this.querySelector('#last-name');
            const email = this.querySelector('#email');
            const amount = this.querySelector('#donation-amount');
            const otherAmount = this.querySelector('#other-amount');
            
            if (!firstName.value.trim()) {
                isValid = false;
                errorMessages.push('First name is required');
            }
            
            if (!lastName.value.trim()) {
                isValid = false;
                errorMessages.push('Last name is required');
            }
            
            if (!email.value.trim() || !validateEmail(email.value)) {
                isValid = false;
                errorMessages.push('Valid email address is required');
            }
            
            if (amount.value === 'other' && (!otherAmount.value.trim() || parseFloat(otherAmount.value) <= 0)) {
                isValid = false;
                errorMessages.push('Please enter a valid donation amount');
            }
            
            // Display success message if valid or show errors
            if (isValid) {
                // In a real implementation, this would submit to a payment processor
                // For demonstration purposes, just show a success message
                const formContainer = document.querySelector('.donate-form-container');
                
                if (formContainer) {
                    formContainer.innerHTML = `
                        <div class="donation-success">
                            <div class="success-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h3>Thank You for Your Donation!</h3>
                            <p>Your support makes a huge difference in our ability to provide a quality rugby experience.</p>
                            <p>You will receive a confirmation email shortly with details of your donation.</p>
                        </div>
                    `;
                }
            } else {
                // Display error messages
                let errorContainer = document.querySelector('.form-errors');
                
                if (!errorContainer) {
                    errorContainer = document.createElement('div');
                    errorContainer.className = 'form-errors';
                    donationForm.prepend(errorContainer);
                }
                
                errorContainer.innerHTML = `
                    <div class="error-alert">
                        <ul>
                            ${errorMessages.map(msg => `<li>${msg}</li>`).join('')}
                        </ul>
                    </div>
                `;
                
                // Scroll to the top of the form to show errors
                donationForm.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
}