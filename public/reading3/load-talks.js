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
    const talksList = document.querySelector('.talks-list');
    
    if (!talksList) {
      console.error('Talks list container not found');
      return;
    }
    
    // Clear any existing content
    talksList.innerHTML = '';
    
    // Render each talk
    data.talks.forEach(talk => {
      const talkItem = document.createElement('div');
      talkItem.className = 'talk-item';
      
      const dateDiv = document.createElement('div');
      dateDiv.className = 'talk-date';
      dateDiv.textContent = `Week ${talk.week} - ${talk.date}`;
      
      const title = document.createElement('h3');
      title.textContent = talk.title;
      
      const description = document.createElement('p');
      description.textContent = talk.description;
      
      talkItem.appendChild(dateDiv);
      talkItem.appendChild(title);
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
