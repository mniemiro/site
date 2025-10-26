/**
 * Mode Controller - Handles switching between visual themes
 * 
 * This module provides functionality to switch between different visual modes
 * of the website. Currently supports "professional" and "worldwideweb" modes.
 */

class ModeController {
    constructor() {
        this.currentMode = 'professional';
        this.availableModes = ['professional', 'worldwideweb'];
        this.listeners = [];
        
        // Initialize with default mode
        this.setMode(this.currentMode);
    }
    
    /**
     * Get the current mode
     * @returns {string} Current mode name
     */
    getMode() {
        return this.currentMode;
    }
    
    /**
     * Set the current mode
     * @param {string} mode - Mode to switch to
     */
    setMode(mode) {
        if (!this.availableModes.includes(mode)) {
            console.warn(`Mode "${mode}" is not available. Available modes: ${this.availableModes.join(', ')}`);
            return;
        }
        
        const oldMode = this.currentMode;
        this.currentMode = mode;
        
        // Remove all mode classes from body
        this.availableModes.forEach(modeName => {
            document.body.classList.remove(`mode-${modeName}`);
        });
        
        // Add the new mode class
        document.body.classList.add(`mode-${mode}`);
        
        // Notify listeners
        this.notifyListeners(oldMode, mode);
    }
    
    /**
     * Toggle between available modes
     */
    toggleMode() {
        const currentIndex = this.availableModes.indexOf(this.currentMode);
        const nextIndex = (currentIndex + 1) % this.availableModes.length;
        this.setMode(this.availableModes[nextIndex]);
    }
    
    /**
     * Add a listener for mode changes
     * @param {function} callback - Function to call when mode changes
     */
    addListener(callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
        }
    }
    
    /**
     * Remove a listener
     * @param {function} callback - Function to remove
     */
    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
    
    /**
     * Notify all listeners of mode change
     * @param {string} oldMode - Previous mode
     * @param {string} newMode - New mode
     */
    notifyListeners(oldMode, newMode) {
        this.listeners.forEach(callback => {
            try {
                callback(oldMode, newMode);
            } catch (error) {
                console.error('Error in mode change listener:', error);
            }
        });
    }
    
    /**
     * Get list of available modes
     * @returns {string[]} Array of available mode names
     */
    getAvailableModes() {
        return [...this.availableModes];
    }
}

// Create global instance
window.modeController = new ModeController();

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModeController;
}
