# Babytop Seminar Website

A static website for the Babytop Seminar, built with plain HTML, CSS, and JavaScript. This site displays seminar talks with collapsible abstracts and supports multiple semester iterations.

## Site Structure

```
/
├── index.html                    # Current semester page
├── past-seminars.html           # Past semesters archive (dynamic)
├── semesters/                   # Individual past semester pages
│   └── spring2025.html
├── data/                        # JSON data files
│   ├── current.json            # Current semester data
│   ├── spring2025.json         # Past semester data
│   └── semesters-index.json    # List of past semesters
├── js/
│   ├── seminar.js              # Main seminar renderer
│   └── past-seminars.js        # Past seminars renderer
├── css/
│   └── styles.css              # Site styling
├── SEMESTER_MANAGEMENT.md       # Detailed management guide
└── .github/workflows/
    └── static.yml              # GitHub Pages deployment
```

## Quick Start

1. **Clone this repository**
2. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"
3. **Push to main branch** - the site will auto-deploy

## Managing Seminar Data

**📖 For detailed instructions on managing semesters, see [SEMESTER_MANAGEMENT.md](SEMESTER_MANAGEMENT.md)**

### Quick Reference

- **Adding talks**: Edit `/data/current.json` and add talk objects to the `talks` array
- **New semester**: Create JSON file, HTML page, and update `data/semesters-index.json`
- **Change current semester**: Update `/data/current.json` with new semester data
- **Multiple organizers**: Use `organizers` array format

### JSON Structure

```json
{
  "semester": "Fall 2025",
  "topic": "your seminar topic",
  "meeting": "4:15pm on Tuesdays in Harvard SC 309",
  "calendarLink": "https://calendar.google.com/calendar",
  "organizers": ["Organizer 1", "Organizer 2"],
  "talks": [
    {
      "date": "Sep 10",
      "year": "2025",
      "title": "Talk Title",
      "speaker": "Speaker Name", 
      "affiliation": "MIT",
      "abstract": "Abstract text..."
    }
  ]
}
```

## File Descriptions

### HTML Files
- **`index.html`**: Main page showing current semester talks
- **`past-seminars.html`**: Lists all previous semester iterations
- **`semesters/*.html`**: Individual archived semester pages

### Data Files (`/data/`)
- **`current.json`**: Active semester data (always used by index.html)
- **`{semester}.json`**: Archived semester data files

### JavaScript (`/js/seminar.js`)
- Fetches JSON data and renders talks dynamically
- Handles collapsible abstract functionality
- Works across current and archived semester pages

### CSS (`/css/styles.css`)
- Clean, academic styling matching MIT site design
- Responsive design for mobile devices
- Smooth animations for abstract expansion

## Customization

### Styling
Edit `/css/styles.css` to modify:
- Colors and fonts
- Layout and spacing
- Responsive breakpoints
- Animation effects

### Functionality
Edit `/js/seminar.js` to modify:
- Data loading behavior
- Talk rendering format
- Interactive features

## Deployment

The site uses GitHub Actions for automatic deployment:

1. **Push to main branch** triggers deployment
2. **GitHub Pages** serves the static files
3. **No build step required** - pure HTML/CSS/JS

## Troubleshooting

### Talks Not Loading
- Check browser console for JavaScript errors
- Verify JSON syntax in data files
- Ensure file paths are correct

### Styling Issues
- Clear browser cache
- Check CSS file path in HTML
- Verify responsive design on mobile

### GitHub Pages Not Updating
- Check Actions tab for deployment status
- Verify Pages settings use "GitHub Actions" source
- Wait 5-10 minutes for changes to propagate

## For Future Organizers

This site is designed to be easily maintainable by non-technical users:

1. **Adding talks**: Just edit the JSON file
2. **New semesters**: Follow the archive process above
3. **No coding required**: Everything is data-driven
4. **Version controlled**: All changes are tracked in Git

The site will continue working as long as GitHub Pages is available and the repository is maintained.

## Support

For technical issues or questions about the site structure, refer to this README or check the GitHub repository issues.

---

**Current Organizer**: Matthew Niemiro  
**Site Design**: Based on [MIT Babytop Seminar](https://math.mit.edu/topology/babytop/)
