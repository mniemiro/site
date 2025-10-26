// Past Seminars Page JavaScript Renderer

class PastSeminarsRenderer {
    constructor() {
        this.talksContainer = document.getElementById('talks-container');
        this.loadingElement = document.getElementById('loading');
        this.errorElement = document.getElementById('error');
    }

    async loadPastSeminars() {
        try {
            this.showLoading();
            
            // Load the semesters index
            const indexResponse = await fetch('./data/semesters-index.json');
            if (!indexResponse.ok) {
                throw new Error(`Failed to load semesters index: ${indexResponse.status}`);
            }
            
            const indexData = await indexResponse.json();
            
            // Load metadata for each semester
            const semesterPromises = indexData.semesters.map(semester => 
                this.loadSemesterMetadata(semester)
            );
            
            const semesters = await Promise.all(semesterPromises);
            
            this.renderPastSeminars(semesters);
            this.hideLoading();
        } catch (error) {
            console.error('Error loading past seminars:', error);
            this.showError(`Failed to load past seminars: ${error.message}`);
            this.hideLoading();
        }
    }

    async loadSemesterMetadata(semesterName) {
        try {
            const response = await fetch(`./data/${semesterName}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${semesterName}: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                name: semesterName,
                semester: data.semester,
                topic: data.topic,
                organizers: data.organizers || ['Unknown']
            };
        } catch (error) {
            console.error(`Error loading ${semesterName}:`, error);
            return {
                name: semesterName,
                semester: semesterName,
                topic: 'Unknown topic',
                organizers: ['Unknown']
            };
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

    renderPastSeminars(semesters) {
        if (!this.talksContainer) return;

        this.talksContainer.innerHTML = '';

        semesters.forEach(semester => {
            const semesterElement = this.createSemesterElement(semester);
            this.talksContainer.appendChild(semesterElement);
        });
    }

    createSemesterElement(semester) {
        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'talk';
        semesterDiv.style.cursor = 'pointer';
        semesterDiv.addEventListener('click', () => {
            window.location.href = `semesters/${semester.name}.html`;
        });

        const headerDiv = document.createElement('div');
        headerDiv.className = 'talk-header';

        // Create title element (semester name)
        const titleDiv = document.createElement('div');
        titleDiv.className = 'talk-title';
        titleDiv.textContent = semester.semester;

        // Create organizer element (replaces speaker)
        const organizerDiv = document.createElement('div');
        organizerDiv.className = 'talk-speaker';
        const organizersText = this.formatOrganizers(semester.organizers);
        organizerDiv.innerHTML = `Organized by ${organizersText}`;

        headerDiv.appendChild(titleDiv);
        headerDiv.appendChild(organizerDiv);

        // Create abstract element (always expanded, no collapse)
        const abstractDiv = document.createElement('div');
        abstractDiv.className = 'talk-abstract expanded';

        const abstractContent = document.createElement('div');
        abstractContent.className = 'talk-abstract-content';
        abstractContent.textContent = semester.topic;

        abstractDiv.appendChild(abstractContent);

        semesterDiv.appendChild(headerDiv);
        semesterDiv.appendChild(abstractDiv);

        return semesterDiv;
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
}

// Initialize the past seminars renderer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const renderer = new PastSeminarsRenderer();
    renderer.loadPastSeminars();
});
