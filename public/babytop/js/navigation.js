/**
 * Navigation Controller - Handles active page highlighting
 * 
 * This module detects the current page and highlights the appropriate
 * navigation button with active styling.
 */

class NavigationController {
    constructor() {
        this.init();
    }
    
    /**
     * Initialize the navigation controller
     */
    init() {
        this.highlightActivePage();
    }
    
    /**
     * Highlight the active page button based on current URL
     */
    highlightActivePage() {
        const currentPath = window.location.pathname;
        const currentSemesterBtn = document.getElementById('current-semester-btn');
        const pastSemestersBtn = document.getElementById('past-semesters-btn');
        
        // Remove active class from both buttons first
        if (currentSemesterBtn) currentSemesterBtn.classList.remove('active');
        if (pastSemestersBtn) pastSemestersBtn.classList.remove('active');
        
        // Determine which page we're on and highlight the appropriate button
        if (currentPath.includes('past-seminars') || currentPath.includes('semesters/')) {
            // Past semesters page or individual semester page
            if (pastSemestersBtn) pastSemestersBtn.classList.add('active');
        } else if (currentPath.endsWith('/') || currentPath.endsWith('index.html') || currentPath === '') {
            // Current semester page (index)
            if (currentSemesterBtn) currentSemesterBtn.classList.add('active');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationController();
});

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationController;
}
