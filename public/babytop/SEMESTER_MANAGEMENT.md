# Semester Management Guide

This guide explains how to manage semesters for the Babytop Seminar website.

## Overview

The website uses a template-based system where:
- Each semester has its own JSON data file in the `data/` directory
- Each semester has its own HTML page in the `semesters/` directory
- The main page (`index.html`) displays the current semester by loading `data/current.json`
- The past seminars page (`past-seminars.html`) automatically discovers and displays all past semesters

## Adding a New Semester

### 1. Create the JSON Data File

Create a new JSON file in the `data/` directory with the following structure:

```json
{
  "semester": "Fall 2024",
  "topic": "your seminar topic",
  "meeting": "4:15pm on Tuesdays in Harvard SC 309 (unless otherwise noted)",
  "calendarLink": "https://calendar.google.com/calendar",
  "organizers": ["Organizer Name 1", "Organizer Name 2"],
  "talks": [
    {
      "date": "Sep 10",
      "year": "2024",
      "title": "Talk Title",
      "speaker": "Speaker Name",
      "affiliation": "Speaker Institution",
      "abstract": "Talk abstract text here..."
    }
  ]
}
```

**Required Fields:**
- `semester`: Display name for the semester (e.g., "Fall 2024")
- `topic`: The seminar topic/theme
- `meeting`: Meeting time and location
- `organizers`: Array of organizer names (can be single name)
- `talks`: Array of talk objects

**Optional Fields:**
- `calendarLink`: Google Calendar link for the seminar

**Talk Object Required Fields:**
- `date`: Date of the talk (e.g., "Sep 10")
- `year`: Year of the talk
- `title`: Talk title
- `speaker`: Speaker name
- `affiliation`: Speaker's institution
- `abstract`: Talk abstract

### 2. Create the HTML Page

Create a new HTML file in the `semesters/` directory (e.g., `semesters/fall2024.html`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fall 2024 - Babytop Seminar</title>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
    <div class="container">
        <div class="mit-header">
            <div><strong>MIT</strong></div>
            <div>Massachusetts Institute of Technology</div>
            <div>Department of Mathematics</div>
            <div><em>Seminars and Colloquia</em></div>
        </div>
        
        <h1 class="title">Babytop Seminar</h1>
        
        <nav class="nav">
            <a href="../index.html">Current Semester</a>
            <a href="../past-seminars.html">Past Semesters</a>
        </nav>
        
        <div class="content">
            <div id="semester-info" class="semester-info">
                <h2 id="semester-title" class="semester-title">Loading...</h2>
                <p id="semester-description" class="semester-description">Loading...</p>
                <p id="meeting-info" class="meeting-info">Loading...</p>
                <p><a id="calendar-link" class="calendar-link" href="#">Loading...</a></p>
            </div>

            <div id="loading" class="loading">
                Loading seminar data...
            </div>

            <div id="error" class="error" style="display: none;">
                Error loading seminar data.
            </div>

            <div id="talks-container" class="talks-container" style="display: none;">
                <!-- Talks will be dynamically loaded here -->
            </div>
        </div>
        
        <div class="footer">
            <p>This seminar was organized by <span id="organizer">Loading...</span>.</p>
        </div>
    </div>

    <script src="../js/seminar.js"></script>
</body>
</html>
```

**Important:** Replace "Fall 2024" in the title with your semester name, and ensure the file name matches your JSON file name (e.g., `fall2024.html` for `fall2024.json`).

### 3. Update the Semesters Index

Add your new semester to `data/semesters-index.json`:

```json
{
  "semesters": [
    "spring2025",
    "fall2024"
  ]
}
```

The semesters will be displayed in the order they appear in this array.

## Changing the Current Semester

To change which semester is displayed on the main page (`index.html`):

1. **Update `data/current.json`** with the data from your new current semester's JSON file
2. **Or rename files:** Rename your new semester's JSON file to `current.json` and update `data/semesters-index.json` to remove it from the past semesters list

## JSON Schema Details

### Organizers Field

The `organizers` field supports multiple organizers with proper grammar formatting:

- Single organizer: `["Alice"]` → displays as "Alice"
- Two organizers: `["Alice", "Bob"]` → displays as "Alice and Bob"  
- Multiple organizers: `["Alice", "Bob", "Carol"]` → displays as "Alice, Bob, and Carol"

### Backwards Compatibility

The system uses the `organizers` array format. All JSON files should use this format.

## File Structure

```
babytopsite/
├── data/
│   ├── current.json              # Current semester data
│   ├── spring2025.json           # Past semester data
│   ├── fall2024.json             # Past semester data
│   └── semesters-index.json      # List of past semesters
├── semesters/
│   ├── spring2025.html           # Past semester page
│   └── fall2024.html             # Past semester page
├── js/
│   ├── seminar.js                # Main seminar renderer
│   └── past-seminars.js          # Past seminars renderer
├── css/
│   └── styles.css                 # Site styles
├── index.html                     # Main page (current semester)
└── past-seminars.html             # Past semesters archive
```

## Troubleshooting

**Past seminars not showing up:**
- Check that the semester is listed in `data/semesters-index.json`
- Verify the JSON file exists in the `data/` directory
- Check browser console for JavaScript errors

**Organizers not displaying correctly:**
- Ensure `organizers` is an array of strings
- Check that organizer names are not empty strings

**Semester page not loading:**
- Verify the HTML file exists in the `semesters/` directory
- Check that the file name matches the JSON file name
- Ensure the JavaScript path is correct (`../js/seminar.js`)
