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

// Dark mode has been removed, site now uses light mode only
function setupDarkMode() {
    // Function remains for compatibility but does nothing
    // as dark mode has been completely removed
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
    if (document.querySelector('.results-section')) {
        loadMatchResults();
    }
}

// Load and parse match results from CSV
async function loadMatchResults() {
    try {
        const response = await fetch('match-results.csv');
        const csvText = await response.text();
        const matches = parseCSV(csvText);
        
        displayResults(matches);
        setupSeasonFiltering(matches);
    } catch (error) {
        console.error('Error loading match results:', error);
        displayErrorMessage();
    }
}

// Parse CSV data into match objects
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const matches = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 7) {
            const match = {
                date: values[0].trim(),
                home: values[1].trim(),
                away: values[2].trim(),
                home_points: values[3].trim(),
                away_points: values[4].trim(),
                location: values[5].trim(),
                event: values[6].trim()
            };
            
            // Determine season and result for the match
            match.season = determineSeason(match.date);
            match.result = determineResult(match);
            
            matches.push(match);
        }
    }
    
    return matches.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Determine season from date
function determineSeason(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) {
        // Handle different date formats
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const month = parseInt(parts[0]);
            const year = parseInt(parts[2]);
            
            if (month >= 8) {
                return `${year}-${year + 1}`;
            } else {
                return `${year - 1}-${year}`;
            }
        }
        return 'Unknown';
    }
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    if (month >= 8) {
        return `${year}-${year + 1}`;
    } else {
        return `${year - 1}-${year}`;
    }
}

// Determine match result and color coding
function determineResult(match) {
    const { home, away, home_points, away_points } = match;
    const isDoggHome = home.toLowerCase().includes('dogg');
    const isDoggAway = away.toLowerCase().includes('dogg');
    
    // Handle W/L format
    if (home_points === 'W' || home_points === 'L' || away_points === 'W' || away_points === 'L') {
        if (isDoggHome) {
            return {
                result: home_points === 'W' ? 'Win' : 'Loss',
                color: home_points === 'W' ? 'green' : 'red',
                score: `${home_points}-${away_points}`
            };
        } else if (isDoggAway) {
            return {
                result: away_points === 'W' ? 'Win' : 'Loss',
                color: away_points === 'W' ? 'green' : 'red',
                score: `${away_points}-${home_points}`
            };
        }
    }
    
    // Handle numeric scores
    if (home_points && away_points && !isNaN(home_points) && !isNaN(away_points)) {
        const homeScore = parseInt(home_points);
        const awayScore = parseInt(away_points);
        
        if (homeScore === awayScore) {
            return {
                result: 'Draw',
                color: 'orange',
                score: `${homeScore}-${awayScore}`
            };
        }
        
        if (isDoggHome) {
            return {
                result: homeScore > awayScore ? 'Win' : 'Loss',
                color: homeScore > awayScore ? 'green' : 'red',
                score: `${homeScore}-${awayScore}`
            };
        } else if (isDoggAway) {
            return {
                result: awayScore > homeScore ? 'Win' : 'Loss',
                color: awayScore > homeScore ? 'green' : 'red',
                score: `${awayScore}-${homeScore}`
            };
        }
    }
    
    // Handle empty scores - check if match is in the past
    const matchDate = new Date(match.date);
    const now = new Date();
    
    // If the match date is in the past and no score is available, use shrug emoji
    if (matchDate < now && !isNaN(matchDate.getTime())) {
        return {
            result: '¯\\_(ツ)_/¯',
            color: 'orange',
            score: '¯\\_(ツ)_/¯'
        };
    }
    
    // Otherwise, it's an upcoming match
    return {
        result: 'TBD',
        color: 'orange',
        score: 'TBD'
    };
}

// Display results grouped by season
function displayResults(matches) {
    const resultsSection = document.querySelector('.results-section .container');
    if (!resultsSection) return;
    
    // Group matches by season
    const seasonGroups = {};
    matches.forEach(match => {
        if (!seasonGroups[match.season]) {
            seasonGroups[match.season] = [];
        }
        seasonGroups[match.season].push(match);
    });
    
    // Clear existing content
    resultsSection.innerHTML = '';
    
    // Generate season filter buttons
    generateSeasonFilters(Object.keys(seasonGroups));
    
    // Create season summaries
    Object.keys(seasonGroups).sort((a, b) => b.localeCompare(a)).forEach(season => {
        const seasonMatches = seasonGroups[season];
        const seasonSummary = createSeasonSummary(season, seasonMatches);
        resultsSection.appendChild(seasonSummary);
    });
}

// Generate season filter buttons
function generateSeasonFilters(seasons) {
    const filterSection = document.querySelector('.results-filter .filter-buttons');
    if (!filterSection) return;
    
    filterSection.innerHTML = '';
    
    // Add "All Seasons" button
    const allButton = document.createElement('button');
    allButton.className = 'filter-button active';
    allButton.setAttribute('data-season', 'all');
    allButton.textContent = 'All Seasons';
    filterSection.appendChild(allButton);
    
    // Add season-specific buttons
    seasons.sort((a, b) => b.localeCompare(a)).forEach(season => {
        const button = document.createElement('button');
        button.className = 'filter-button';
        button.setAttribute('data-season', season);
        button.textContent = season;
        filterSection.appendChild(button);
    });
}

// Create season summary element
function createSeasonSummary(season, matches) {
    const summary = document.createElement('div');
    summary.className = 'season-summary';
    summary.setAttribute('data-season', season);
    
    // Calculate season stats
    const stats = calculateSeasonStats(matches);
    
    summary.innerHTML = `
        <div class="season-header">
            <h3>${season} Season</h3>
            <div class="season-stats">
                <div class="season-stat">
                    <span class="stat-value">${stats.wins}</span>
                    <span class="stat-label">Wins</span>
                </div>
                <div class="season-stat">
                    <span class="stat-value">${stats.losses}</span>
                    <span class="stat-label">Losses</span>
                </div>
                <div class="season-stat">
                    <span class="stat-value">${stats.draws}</span>
                    <span class="stat-label">Draws</span>
                </div>
                <div class="season-stat">
                    <span class="stat-value">${stats.winRate}%</span>
                    <span class="stat-label">Win Rate</span>
                </div>
            </div>
        </div>
        
        <div class="results-table-container">
            <table class="results-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Opponent</th>
                        <th>Location</th>
                        <th>Result</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    ${matches.map(match => createMatchRow(match)).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    return summary;
}

// Calculate season statistics
function calculateSeasonStats(matches) {
    let wins = 0, losses = 0, draws = 0;
    
    matches.forEach(match => {
        if (match.result.result === 'Win') wins++;
        else if (match.result.result === 'Loss') losses++;
        else if (match.result.result === 'Draw') draws++;
    });
    
    const totalGames = wins + losses + draws;
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
    
    return { wins, losses, draws, winRate };
}

// Create individual match row
function createMatchRow(match) {
    const opponent = match.home.toLowerCase().includes('dogg') ? match.away : match.home;
    const location = match.home.toLowerCase().includes('dogg') ? 'Home' : 'Away';
    const formattedDate = formatDate(match.date);
    
    return `
        <tr class="${match.result.color}">
            <td>${formattedDate}</td>
            <td>${opponent}</td>
            <td>${location}</td>
            <td>${match.result.result}</td>
            <td>${match.result.score}</td>
        </tr>
    `;
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date)) {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Handle MM/DD/YYYY format
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const month = parseInt(parts[0]);
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    return dateStr;
}

// Setup season filtering functionality
function setupSeasonFiltering(matches) {
    const filterButtons = document.querySelectorAll('.filter-button');
    const seasonSummaries = document.querySelectorAll('.season-summary');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get season filter value
            const season = this.getAttribute('data-season');
            
            // Filter seasons
            seasonSummaries.forEach(summary => {
                if (season === 'all') {
                    summary.style.display = 'block';
                } else {
                    const summarySeasonAttr = summary.getAttribute('data-season');
                    summary.style.display = summarySeasonAttr === season ? 'block' : 'none';
                }
            });
        });
    });
}

// Display error message if CSV loading fails
function displayErrorMessage() {
    const resultsSection = document.querySelector('.results-section .container');
    if (resultsSection) {
        resultsSection.innerHTML = `
            <div class="error-message">
                <h3>Unable to load match results</h3>
                <p>Please try refreshing the page or contact us if the problem persists.</p>
            </div>
        `;
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