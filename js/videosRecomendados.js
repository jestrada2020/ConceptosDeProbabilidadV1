// VIDEOS RECOMENDADOS - Tab functionality
// Manejo de la pestaña de videos recomendados

document.addEventListener('DOMContentLoaded', function() {
    console.log("Videos Recomendados module loaded");

    // Tab switching functionality is handled by the main application
    // This module can contain specific functionality for the videos tab

    // Add any interactive features for the videos tab here
    initializeVideoInteractions();
});

function initializeVideoInteractions() {
    console.log("Initializing video interactions...");

    // Add click tracking for video links (optional analytics)
    const videoLinks = document.querySelectorAll('#videos-recomendados a[href*="youtube.com"]');

    videoLinks.forEach(function(link, index) {
        link.addEventListener('click', function(e) {
            console.log(`Video ${index + 1} clicked: ${this.href}`);
            // You can add analytics tracking here if needed
        });
    });

    // Add hover effects or other interactions as needed
    const videoCards = document.querySelectorAll('#videos-recomendados .bg-white.rounded-lg.shadow-md');

    videoCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Function to handle tab activation (called by main tab system)
function activateVideosTab() {
    console.log("Videos Recomendados tab activated");
    // Any specific functionality when the tab becomes active
}

// Function to handle tab deactivation
function deactivateVideosTab() {
    console.log("Videos Recomendados tab deactivated");
    // Any cleanup when leaving the tab
}

// Export functions if needed by other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        activateVideosTab,
        deactivateVideosTab
    };
}