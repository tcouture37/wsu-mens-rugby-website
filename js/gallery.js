// Gallery JavaScript for Player Profiles
// This file handles the player gallery functionality

// Configuration
const S3_BUCKET_URL = 'https://wsu-mens-rugby-website.s3.us-east-1.amazonaws.com/images/players/';
const DEFAULT_PLAYER_IMAGE = 'default-player.jpg'; // Fallback image

// Player data structure
// Images should be stored in S3 with naming convention: firstname-lastname.jpg
const playersData = [
    {
        id: 'abe-lincoln',
        firstName: 'Abe',
        lastName: 'Lincoln',
        nickname: 'Honest',
        major: ['Social Services'],
        gradeLevel: 'senior',
        positions: ['Lock', 'Number 8'],
        socialMedia: {
            instagram: 'https://en.wikipedia.org/wiki/Abraham_Lincoln',
            twitter: 'https://en.wikipedia.org/wiki/Abraham_Lincoln'
        },
        bio: '4 scores and 8 beers ago.',
        imageFileName: 'lincolnator.jpg'
    },
    {
        id: 'theodore-roosevelt',
        firstName: 'Theodore',
        lastName: 'Roosevelt',
        nickname: 'Teddy',
        major: ['Environmental Sciences'],
        gradeLevel: 'junior',
        positions: ['Prop', 'Inside Centre'],
        socialMedia: {
            instagram: 'https://en.wikipedia.org/wiki/Theodore_Roosevelt'
        },
        bio: 'Strategic playmaker with excellent kicking ability.',
        imageFileName: 'tdawg.jpg'
    },
    {
        id: 'george-washington',
        firstName: 'George',
        lastName: 'Washington',
        major: ['Exercise Science', 'Health Promotion'],
        gradeLevel: 'sophomore',
        positions: ['Number 8', 'Flanker'],
        socialMedia: {
            instagram: 'https://instagram.com/alexbrown_rugby',
            facebook: 'https://facebook.com/alex.brown.rugby'
        },
        bio: 'Powerful back row forward with incredible speed.',
        imageFileName: 'gdub.webp'
    },
    {
        id: 'tim-couture',
        firstName: 'Tim',
        lastName: 'Couture',
        nickname: 'Drama',
        major: ['MIS'],
        gradeLevel: 'senior',
        positions: ['Lock'],
        socialMedia: {
            facebook: 'https://www.facebook.com/tim.couture'
        },
        bio: 'What a guy, what can I say.'
    },
    {
        id: 'chris-taylor',
        firstName: 'Chris',
        lastName: 'Taylor',
        nickname: null,
        major: ['Engineering'],
        gradeLevel: 'super-senior',
        positions: ['Lock', 'Flanker'],
        socialMedia: {
            linkedin: 'https://linkedin.com/in/christaylor'
        },
        bio: 'Veteran player and lineout specialist in his 5th year.'
    },
    {
        id: 'ryan-davis',
        firstName: 'Ryan',
        lastName: 'Davis',
        nickname: 'Mad Dog',
        major: ['Psychology'],
        gradeLevel: 'junior',
        positions: ['Scrum-half'],
        socialMedia: {
            instagram: 'https://instagram.com/ryandavis_rugby',
            twitter: 'https://twitter.com/maddog_rugby'
        },
        bio: 'Energetic scrum-half who controls the pace of the game.'
    }
];

// Position categories for filtering
const positionCategories = {
    forwards: ['Prop', 'Hooker', 'Lock', 'Flanker', 'Number 8'],
    backs: ['Scrum-half', 'Fly-half', 'Inside Centre', 'Outside Centre', 'Wing', 'Fullback']
};

// Track current filter state
let currentFilters = {
    position: ['forwards', 'backs'],
    grade: ['freshman', 'sophomore', 'junior', 'senior', 'super-senior'],
    major: []
};

// Initialize gallery when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('gallery.html') || 
        window.location.pathname.endsWith('gallery')) {
        initializeGallery();
    }
});

function initializeGallery() {
    console.log('Initializing player gallery...');
    
    // Setup filter functionality
    setupFilters();
    
    // Load and display players
    loadPlayers();
}

function initializeGallery() {
    console.log('Initializing player gallery...');
    
    // Generate major filters from player data
    generateMajorFilters();
    
    // Setup filter functionality
    setupFilters();
    
    // Load and display players
    loadPlayers();
}

function generateMajorFilters() {
    // Extract all unique majors from player data
    const allMajors = new Set();
    
    playersData.forEach(player => {
        player.major.forEach(major => {
            allMajors.add(major);
        });
    });
    
    // Sort majors alphabetically
    const sortedMajors = Array.from(allMajors).sort();
    
    // Initialize all majors as selected
    currentFilters.major = sortedMajors;
    
    // Generate HTML for major checkboxes
    const majorFiltersContainer = document.getElementById('major-filters');
    if (!majorFiltersContainer) return;
    
    majorFiltersContainer.innerHTML = sortedMajors.map(major => `
        <label class="filter-checkbox">
            <input type="checkbox" data-filter-type="major" data-filter-value="${major}" checked>
            <span class="checkmark"></span>
            ${major}
        </label>
    `).join('');
}

function setupFilters() {
    const filterCheckboxes = document.querySelectorAll('input[type="checkbox"][data-filter-type]');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const selectAllBtn = document.getElementById('select-all');
    
    // Add event listeners to all filter checkboxes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
    
    // Clear filters button
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // Select all button
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', selectAllFilters);
    }
}

function handleFilterChange(event) {
    const filterType = event.target.getAttribute('data-filter-type');
    const filterValue = event.target.getAttribute('data-filter-value');
    const isChecked = event.target.checked;
    
    if (isChecked) {
        // Add to current filters
        if (!currentFilters[filterType].includes(filterValue)) {
            currentFilters[filterType].push(filterValue);
        }
    } else {
        // Remove from current filters
        currentFilters[filterType] = currentFilters[filterType].filter(value => value !== filterValue);
    }
    
    // Apply filters
    applyFilters();
}

function applyFilters() {
    const filteredPlayers = playersData.filter(player => {
        // Check position filter
        const playerPositionType = getPlayerPositionType(player);
        const positionMatch = currentFilters.position.includes(playerPositionType);
        
        // Check grade filter
        const gradeMatch = currentFilters.grade.includes(player.gradeLevel);
        
        // Check major filter - player must have at least one matching major
        const majorMatch = player.major.some(major => currentFilters.major.includes(major));
        
        return positionMatch && gradeMatch && majorMatch;
    });
    
    displayPlayers(filteredPlayers);
    updateResultsCount(filteredPlayers.length);
}

function getPlayerPositionType(player) {
    // Determine if player is primarily a forward or back
    const forwardPositions = player.positions.filter(pos => positionCategories.forwards.includes(pos));
    const backPositions = player.positions.filter(pos => positionCategories.backs.includes(pos));
    
    // If player has both forward and back positions, prioritize forward
    if (forwardPositions.length > 0) {
        return 'forwards';
    } else if (backPositions.length > 0) {
        return 'backs';
    }
    
    // Default to forwards if position not found in categories
    return 'forwards';
}

function clearAllFilters() {
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-filter-type]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear current filters
    currentFilters = {
        position: [],
        grade: [],
        major: []
    };
    
    // Apply filters (will show no results)
    applyFilters();
}

function selectAllFilters() {
    // Check all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-filter-type]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    
    // Reset current filters to include everything
    const allMajors = Array.from(new Set(playersData.flatMap(player => player.major))).sort();
    
    currentFilters = {
        position: ['forwards', 'backs'],
        grade: ['freshman', 'sophomore', 'junior', 'senior', 'super-senior'],
        major: allMajors
    };
    
    // Apply filters (will show all results)
    applyFilters();
}

function updateResultsCount(count) {
    const resultsCountElement = document.getElementById('results-count');
    if (!resultsCountElement) return;
    
    if (count === playersData.length) {
        resultsCountElement.textContent = 'Showing all players';
    } else if (count === 0) {
        resultsCountElement.textContent = 'No players match the selected filters';
    } else {
        resultsCountElement.textContent = `Showing ${count} of ${playersData.length} players`;
    }
}

function loadPlayers() {
    const loadingMessage = document.getElementById('loading-message');
    const playerGrid = document.getElementById('player-grid');
    
    if (!playerGrid) {
        console.error('Player grid element not found');
        return;
    }
    
    // Show loading state
    loadingMessage.style.display = 'block';
    
    // Simulate loading delay (in real implementation, this might be an API call)
    setTimeout(() => {
        applyFilters(); // Use the new filter system instead of displayPlayers
        loadingMessage.style.display = 'none';
    }, 500);
}

function displayPlayers(players) {
    const playerGrid = document.getElementById('player-grid');
    const noPlayersMessage = document.getElementById('no-players-message');
    
    if (players.length === 0) {
        playerGrid.innerHTML = '';
        noPlayersMessage.style.display = 'block';
        return;
    }
    
    noPlayersMessage.style.display = 'none';
    
    // Generate HTML for each player
    const playersHTML = players.map((player, index) => createPlayerCard(player, index)).join('');
    playerGrid.innerHTML = playersHTML;
    
    // Add event listeners for social media links
    setupSocialMediaLinks();
    
    // Add staggered animation
    const playerCards = playerGrid.querySelectorAll('.player-card');
    playerCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

function createPlayerCard(player, index) {
    const imageUrl = getPlayerImageUrl(player.imageFileName);
    const displayName = player.nickname ? 
        `${player.firstName} "${player.nickname}" ${player.lastName}` : 
        `${player.firstName} ${player.lastName}`;
    
    const majorDisplay = player.major.length > 1 ? 
        player.major.join(' & ') : 
        player.major[0];
    
    const positionsDisplay = player.positions.join(', ');
    
    const socialMediaLinks = createSocialMediaLinks(player.socialMedia);
    
    const gradeDisplayMap = {
        'freshman': 'Freshman',
        'sophomore': 'Sophomore', 
        'junior': 'Junior',
        'senior': 'Senior',
        'super-senior': 'Super Senior'
    };
    
    return `
        <div class="player-card" data-positions="${player.positions.join(',').toLowerCase()}" data-grade="${player.gradeLevel}">
            <div class="player-image">
                <img src="${imageUrl}" alt="${displayName}" loading="lazy" onerror="this.src='${DEFAULT_PLAYER_IMAGE}'">
                <div class="player-overlay">
                    <div class="player-bio">
                        <p>${player.bio}</p>
                    </div>
                </div>
            </div>
            <div class="player-info">
                <h3 class="player-name">${displayName}</h3>
                <div class="player-details">
                    <div class="player-major">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                        </svg>
                        <span>${majorDisplay}</span>
                    </div>
                    <div class="player-grade">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        <span>${gradeDisplayMap[player.gradeLevel]}</span>
                    </div>
                    <div class="player-positions">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        <span>${positionsDisplay}</span>
                    </div>
                </div>
                ${socialMediaLinks}
            </div>
        </div>
    `;
}

function createSocialMediaLinks(socialMedia) {
    if (!socialMedia || Object.keys(socialMedia).length === 0) {
        return '';
    }
    
    const socialIcons = {
        instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>`,
        facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>`,
        twitter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
        </svg>`,
        linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
        </svg>`
    };
    
    let linksHTML = '<div class="social-media-links">';
    
    Object.entries(socialMedia).forEach(([platform, url]) => {
        if (socialIcons[platform]) {
            linksHTML += `
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="social-link" data-platform="${platform}" aria-label="${platform}">
                    ${socialIcons[platform]}
                </a>
            `;
        }
    });
    
    linksHTML += '</div>';
    
    return linksHTML;
}

function setupSocialMediaLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

function getPlayerImageUrl(imageFileName) {
    if (!imageFileName) {
        return DEFAULT_PLAYER_IMAGE;
    }
    
    return S3_BUCKET_URL + imageFileName;
}

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        playersData,
        initializeGallery,
        applyFilters
    };
}