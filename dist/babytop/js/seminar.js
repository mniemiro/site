// Babytop Seminar JavaScript Renderer

class SeminarRenderer {
    constructor() {
        this.talksContainer = document.getElementById('talks-container');
        this.semesterInfo = document.getElementById('semester-info');
        this.loadingElement = document.getElementById('loading');
        this.errorElement = document.getElementById('error');
    }

    async loadSeminarData(dataPath) {
        try {
            this.showLoading();
            const response = await fetch(dataPath);
            
            if (!response.ok) {
                throw new Error(`Failed to load seminar data: ${response.status}`);
            }
            
            const data = await response.json();
            this.renderSeminar(data);
            this.hideLoading();
        } catch (error) {
            console.error('Error loading seminar data:', error);
            this.showError(`Failed to load seminar data: ${error.message}`);
            this.hideLoading();
        }
    }

    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'block';
        }
        if (this.talksContainer) {
            this.talksContainer.style.display = 'none';
        }
        if (this.errorElement) {
            this.errorElement.style.display = 'none';
        }
    }

    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
        if (this.talksContainer) {
            this.talksContainer.style.display = 'block';
        }
    }

    showError(message) {
        if (this.errorElement) {
            this.errorElement.textContent = message;
            this.errorElement.style.display = 'block';
        }
        if (this.talksContainer) {
            this.talksContainer.style.display = 'none';
        }
    }

    renderSeminar(data) {
        this.renderSemesterInfo(data);
        this.renderTalks(data.talks);
        this.renderOrganizers(data);
    }

    renderSemesterInfo(data) {
        if (!this.semesterInfo) return;

        const semesterTitle = document.getElementById('semester-title');
        const organizerInfo = document.getElementById('organizer-info');
        const semesterDescription = document.getElementById('semester-description');
        const meetingInfo = document.getElementById('meeting-info');
        const calendarLink = document.getElementById('calendar-link');

        if (semesterTitle) {
            // Apply scramble effect to title
            // this.startScrambledTextAnimation(semesterTitle, data.semester);
            semesterTitle.textContent = data.semester;
        }

        if (organizerInfo) {
            const organizers = data.organizers || [];
            if (organizers.length === 1) {
                organizerInfo.textContent = `Organizer: ${organizers[0]}`;
            } else if (organizers.length === 2) {
                organizerInfo.textContent = `Organizers: ${organizers[0]} and ${organizers[1]}`;
            } else if (organizers.length > 2) {
                const lastOrganizer = organizers[organizers.length - 1];
                const otherOrganizers = organizers.slice(0, -1).join(', ');
                organizerInfo.textContent = `Organizers: ${otherOrganizers}, and ${lastOrganizer}`;
            } else {
                organizerInfo.textContent = '';
            }
        }

        if (semesterDescription) {
            semesterDescription.textContent = data.topic;
        }

        if (meetingInfo) {
            meetingInfo.textContent = `We meet at ${data.meeting}.`;
        }

        if (calendarLink && data.calendarLink) {
            calendarLink.href = data.calendarLink;
            calendarLink.textContent = 'Click here to add the seminar to your Google calendar.';
        }
    }

    renderOrganizers(data) {
        const organizerElement = document.getElementById('organizer');
        if (!organizerElement) return;

        const organizers = data.organizers || ['Unknown'];
        organizerElement.textContent = this.formatOrganizers(organizers);
    }

    formatOrganizers(organizers) {
        if (organizers.length === 1) {
            return organizers[0];
        } else if (organizers.length === 2) {
            return `${organizers[0]} and ${organizers[1]}`;
        } else {
            const lastOrganizer = organizers[organizers.length - 1];
            const otherOrganizers = organizers.slice(0, -1);
            return `${otherOrganizers.join(', ')}, and ${lastOrganizer}`;
        }
    }

    renderTalks(talks) {
        if (!this.talksContainer) return;

        this.talksContainer.innerHTML = '';

        talks.forEach((talk, index) => {
            const talkElement = this.createTalkElement(talk, index);
            this.talksContainer.appendChild(talkElement);
        });
    }

    createTalkElement(talk, index) {
        const talkDiv = document.createElement('div');
        talkDiv.className = 'talk';
        talkDiv.addEventListener('click', () => this.toggleAbstract(index));

        const headerDiv = document.createElement('div');
        headerDiv.className = 'talk-header';

        // Create date element
        const dateDiv = document.createElement('div');
        dateDiv.className = 'talk-date';
        dateDiv.textContent = `${talk.date} ${talk.year}`;

        // Create title element
        const titleDiv = document.createElement('div');
        titleDiv.className = 'talk-title';
        titleDiv.textContent = talk.title && talk.title.trim() ? talk.title : 'TBA';

        // Create speaker element
        const speakerDiv = document.createElement('div');
        speakerDiv.className = 'talk-speaker';
        speakerDiv.innerHTML = `${talk.speaker} <span class="talk-affiliation">(${talk.affiliation})</span>`;

        // Create expand indicator
        const expandIndicator = document.createElement('div');
        expandIndicator.className = 'talk-expand-indicator';
        expandIndicator.textContent = '∏';

        headerDiv.appendChild(dateDiv);
        headerDiv.appendChild(titleDiv);
        headerDiv.appendChild(speakerDiv);
        
        // Position expander relative to the title
        titleDiv.style.position = 'relative';
        titleDiv.appendChild(expandIndicator);

        const abstractDiv = document.createElement('div');
        abstractDiv.className = 'talk-abstract';
        abstractDiv.id = `abstract-${index}`;

        const abstractContent = document.createElement('div');
        abstractContent.className = 'talk-abstract-content';
        abstractContent.textContent = talk.abstract && talk.abstract.trim() ? talk.abstract : 'TBA';

        abstractDiv.appendChild(abstractContent);

        talkDiv.appendChild(headerDiv);
        talkDiv.appendChild(abstractDiv);

        return talkDiv;
    }

    toggleAbstract(index) {
        const abstract = document.getElementById(`abstract-${index}`);
        const talkElement = abstract?.closest('.talk');
        const expandIndicator = talkElement?.querySelector('.talk-expand-indicator');
        const abstractContent = abstract?.querySelector('.talk-abstract-content');
        
        if (abstract && abstractContent) {
            const isExpanded = abstract.classList.contains('expanded');
            
            if (!isExpanded) {
                // Expanding - show scrambled text animation
                this.startScrambledTextAnimation(abstractContent, abstractContent.textContent);
                abstract.classList.add('expanded');
                
                // Animate the expand indicator
                if (expandIndicator) {
                    expandIndicator.textContent = '∐';
                    expandIndicator.style.transform = 'translateY(-50%) rotate(0deg)';
                }
            } else {
                // Collapsing - hide immediately
                abstract.classList.remove('expanded');
                
                // Animate the expand indicator
                if (expandIndicator) {
                    expandIndicator.textContent = '∏';
                    expandIndicator.style.transform = 'translateY(-50%) rotate(0deg)';
                }
            }
        }
    }

    startScrambledTextAnimation(element, originalText) {
        const scrambleDuration = 460; // Total duration of scrambling effect
        const scrambleInterval = 50; // How often to update scrambled text
        
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let startTime = Date.now();
        
        // Add scrambling class for visual effects
        element.classList.add('scrambling');
        
        // Show initial scrambled text immediately
        let initialScrambled = this.scrambleText(originalText, characters, 0);
        element.textContent = initialScrambled;
        
        const scrambleIntervalId = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / scrambleDuration, 1);
            
            if (progress < 1) {
                // Still scrambling - replace random characters
                const scrambledText = this.scrambleText(originalText, characters, progress);
                element.textContent = scrambledText;
            } else {
                // Scrambling complete - reveal original text
                clearInterval(scrambleIntervalId);
                element.classList.remove('scrambling');
                element.textContent = originalText;
            }
        }, scrambleInterval);
    }

    scrambleText(originalText, characters, progress) {
        // Inverse-exponential taper: spend more time at low intensity
        // Starts at ~0.5, quickly drops to ~0.07, stays low most of the time
        const scrambleIntensity = Math.max(0.07, 0.07 + 0.43 * Math.pow(1 - progress, 3));
        const scrambledChars = originalText.split('').map(char => {
            // Skip spaces and punctuation for readability
            if (char === ' ' || char === '.' || char === ',' || char === '!' || char === '?' || char === ';' || char === ':') {
                return char;
            }
            
            // Randomly decide whether to scramble this character
            if (Math.random() < scrambleIntensity) {
                return characters[Math.floor(Math.random() * characters.length)];
            }
            
            return char;
        });
        
        return scrambledChars.join('');
    }
}

// Initialize the seminar renderer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const renderer = new SeminarRenderer();
    
    // Determine which data file to load based on the page
    const currentPath = window.location.pathname;
    let dataPath = './data/current.json'; // default for index.html
    
    if (currentPath.includes('semesters/')) {
        // Extract semester from URL path
        const semesterMatch = currentPath.match(/semesters\/([^\/]+)\.html/);
        if (semesterMatch) {
            dataPath = `../data/${semesterMatch[1]}.json`;
        }
    }
    
    renderer.loadSeminarData(dataPath);
});
