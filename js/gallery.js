// Gallery JavaScript for Player Profiles
// This file handles the player gallery functionality

// Configuration
const S3_BUCKET_URL = 'https://wsu-mens-rugby-website.s3.us-east-1.amazonaws.com/images/players/';
const DEFAULT_PLAYER_IMAGE = 'images/players/default-player.jpeg';

// Player data
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

// Position categories
const positionCategories = {
    forwards: ['Prop', 'Hooker', 'Lock', 'Flanker', 'Number 8'],
    backs: ['Scrum-half', 'Fly-half', 'Inside Centre', 'Outside Centre', 'Wing', 'Fullback']
};

// Current filter state
let currentFilters = {
    position: ['forwards', 'backs'],
    grade: ['freshman', 'sophomore', 'junior', 'senior', 'super-senior'],
    major: []
};

// Initialize gallery
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
});

function initializeGallery() {
    generateMajorFilters();
    setupDropdowns();
    setupFilters();
    loadPlayers();
}

function generateMajorFilters() {
    const allMajors = new Set();
    playersData.forEach(player => {
        player.major.forEach(major => allMajors.add(major));
    });
    
    const sortedMajors = Array.from(allMajors).sort();
    currentFilters.major = sortedMajors;
    
    const majorOptions = document.getElementById('major-options');
    majorOptions.innerHTML = sortedMajors.map(major => `
        <div class="filter-option">
            <input type="checkbox" id="major-${major.replace(/\s+/g, '-')}" data-filter-type="major" data-filter-value="${major}" checked>
            <label for="major-${major.replace(/\s+/g, '-')}">${major}</label>
        </div>
    `).join('');
}

function setupDropdowns() {
    const dropdowns = document.querySelectorAll('.filter-dropdown');
    
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.filter-dropdown-btn');
        const content = dropdown.querySelector('.filter-dropdown-content');
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });
            
            dropdown.classList.toggle('active');
        });
        
        // Prevent dropdown from closing when clicking inside
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
}

function setupFilters() {
    const filterCheckboxes = document.querySelectorAll('input[type="checkbox"][data-filter-type]');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const selectAllBtn = document.getElementById('select-all');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', selectAllFilters);
    }
}

function handleFilterChange(event) {
    const filterType = event.target.getAttribute('data-filter-type');
    const filterValue = event.target.getAttribute('data-filter-value');
    const isChecked = event.target.checked;
    
    if (isChecked) {
        if (!currentFilters[filterType].includes(filterValue)) {
            currentFilters[filterType].push(filterValue);
        }
    } else {
        currentFilters[filterType] = currentFilters[filterType].filter(value => value !== filterValue);
    }
    
    updateDropdownLabels();
    applyFilters();
}

function updateDropdownLabels() {
    // Update position dropdown
    const positionBtn = document.querySelector('#position-dropdown .filter-dropdown-btn span');
    const positionCount = currentFilters.position.length;
    if (positionCount === 0) {
        positionBtn.textContent = 'No Positions';
    } else if (positionCount === 2) {
        positionBtn.textContent = 'All Positions';
    } else {
        positionBtn.textContent = currentFilters.position[0].charAt(0).toUpperCase() + currentFilters.position[0].slice(1);
    }

    // Update grade dropdown
    const gradeBtn = document.querySelector('#grade-dropdown .filter-dropdown-btn span');
    const gradeCount = currentFilters.grade.length;
    if (gradeCount === 0) {
        gradeBtn.textContent = 'No Classes';
    } else if (gradeCount === 5) {
        gradeBtn.textContent = 'All Classes';
    } else if (gradeCount === 1) {
        const gradeMap = {
            'freshman': 'Freshmen',
            'sophomore': 'Sophomores',
            'junior': 'Juniors',
            'senior': 'Seniors',
            'super-senior': 'Super Seniors'
        };
        gradeBtn.textContent = gradeMap[currentFilters.grade[0]];
    } else {
        gradeBtn.textContent = `${gradeCount} Classes`;
    }

    // Update major dropdown
    const majorBtn = document.querySelector('#major-dropdown .filter-dropdown-btn span');
    const majorCount = currentFilters.major.length;
    const totalMajors = new Set(playersData.flatMap(p => p.major)).size;
    if (majorCount === 0) {
        majorBtn.textContent = 'No Majors';
    } else if (majorCount === totalMajors) {
        majorBtn.textContent = 'All Majors';
    } else if (majorCount === 1) {
        majorBtn.textContent = currentFilters.major[0];
    } else {
        majorBtn.textContent = `${majorCount} Majors`;
    }
}

function applyFilters() {
    const filteredPlayers = playersData.filter(player => {
        const playerPositionType = getPlayerPositionType(player);
        const positionMatch = currentFilters.position.includes(playerPositionType);
        const gradeMatch = currentFilters.grade.includes(player.gradeLevel);
        const majorMatch = player.major.some(major => currentFilters.major.includes(major));
        
        return positionMatch && gradeMatch && majorMatch;
    });
    
    displayPlayers(filteredPlayers);
    updateResultsCount(filteredPlayers.length);
}

function getPlayerPositionType(player) {
    const forwardPositions = player.positions.filter(pos => positionCategories.forwards.includes(pos));
    return forwardPositions.length > 0 ? 'forwards' : 'backs';
}

function clearAllFilters() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-filter-type]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    currentFilters = {
        position: [],
        grade: [],
        major: []
    };
    
    updateDropdownLabels();
    applyFilters();
}

function selectAllFilters() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-filter-type]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    
    const allMajors = Array.from(new Set(playersData.flatMap(player => player.major))).sort();
    
    currentFilters = {
        position: ['forwards', 'backs'],
        grade: ['freshman', 'sophomore', 'junior', 'senior', 'super-senior'],
        major: allMajors
    };
    
    updateDropdownLabels();
    applyFilters();
}

function updateResultsCount(count) {
    const resultsCountElement = document.getElementById('results-count');
    if (!resultsCountElement) return;
    
    if (count === playersData.length) {
        resultsCountElement.textContent = 'Showing all players';
    } else if (count === 0) {
        resultsCountElement.textContent = 'No players found';
    } else {
        resultsCountElement.textContent = `Showing ${count} of ${playersData.length}`;
    }
}

function loadPlayers() {
    const loadingMessage = document.getElementById('loading-message');
    const playerGrid = document.getElementById('player-grid');
    
    if (!playerGrid) {
        console.error('Player grid element not found');
        return;
    }
    
    loadingMessage.style.display = 'block';
    
    setTimeout(() => {
        applyFilters();
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
    
    const playersHTML = players.map((player, index) => createPlayerCard(player, index)).join('');
    playerGrid.innerHTML = playersHTML;
    
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
                <img src="${imageUrl}" alt="${displayName}" loading="lazy" onerror="this.onerror=null; this.src='${DEFAULT_PLAYER_IMAGE}';">
                <div class="player-overlay">
                    <div class="player-bio">
                        <p>${player.bio || 'No bio available'}</p>
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

function getPlayerImageUrl(imageFileName) {
    if (!imageFileName) {
        return DEFAULT_PLAYER_IMAGE;
    }
    
    return S3_BUCKET_URL + imageFileName;
}