/**
 * Loads talk data from current.json and renders it to the page
 */
async function loadTalks() {
  try {
    const response = await fetch('data/current.json');
    if (!response.ok) {
      throw new Error(`Failed to load talks data: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Render seminar description if it exists
    if (data.description) {
      const seminarHeader = document.querySelector('.seminar-header');
      if (seminarHeader) {
        // Remove existing description container if any
        const existingContainer = seminarHeader.querySelector('.seminar-description-container');
        if (existingContainer) {
          existingContainer.remove();
        }
        
        // Create container for description
        const container = document.createElement('div');
        container.className = 'seminar-description-container';
        
        // Create and add description
        const description = document.createElement('p');
        description.className = 'seminar-description';
        description.innerHTML = data.description.replace(
          'semiadditivity',
          '<span style="color: rgb(255, 160, 0);">semiadditivity</span>'
        );
        
        container.appendChild(description);
        seminarHeader.appendChild(container);
      }
    }
    
    const talksList = document.querySelector('.talks-list');
    
    if (!talksList) {
      console.error('Talks list container not found');
      return;
    }
    
    // Clear any existing content
    talksList.innerHTML = '';
    
    // Helper function to convert date string to M/D format
    function formatDate(dateString) {
      // If date is blank or empty, return "TBD"
      if (!dateString || dateString.trim() === '') {
        return 'TBD';
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If parsing fails, return original string
        return dateString;
      }
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}/${day}`;
    }
    
    // Render each talk
    data.talks.forEach(talk => {
      const talkItem = document.createElement('div');
      talkItem.className = 'talk-item';
      
      // Date and title combined on first line
      const dateTitle = document.createElement('div');
      dateTitle.className = 'talk-date-title';
      const formattedDate = formatDate(talk.date);
      dateTitle.textContent = `(${formattedDate}) ${talk.title}`;
      
      talkItem.appendChild(dateTitle);
      
      // Speaker on second line (if provided)
      if (talk.speaker && talk.speaker.trim() !== '') {
        const speaker = document.createElement('div');
        speaker.className = 'talk-speaker';
        speaker.textContent = talk.speaker;
        talkItem.appendChild(speaker);
      }
      
      // Description on third line
      const description = document.createElement('div');
      description.className = 'talk-description';
      description.textContent = talk.description;
      
      talkItem.appendChild(description);
      
      talksList.appendChild(talkItem);
    });
  } catch (error) {
    console.error('Error loading talks:', error);
    // Optionally show an error message to the user
    const talksList = document.querySelector('.talks-list');
    if (talksList) {
      talksList.innerHTML = '<div class="error">Failed to load talks. Please refresh the page.</div>';
    }
  }
}

// Load talks when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadTalks);
} else {
  // DOM is already ready
  loadTalks();
}
