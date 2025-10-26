# Deploying Babytop Site to freeloop.space/babytop

## Summary of Changes

I've updated all HTML files to include a `<base>` tag that sets the base URL to `/babytop/`. This ensures all relative paths (CSS, JS, images, and data files) will work correctly when deployed to a subdirectory.

### Files Modified:
- `index.html` - Added `<base href="/babytop/">`
- `past-seminars.html` - Added `<base href="/babytop/">`
- `semesters/*.html` - Added `<base href="/babytop/semesters/">`

## Deployment Methods

### Option 1: Direct File Upload

If you have FTP/SFTP access to your server:

1. **Upload all files** to `freeloop.space/babytop/` directory
2. **Maintain the directory structure:**
   ```
   /babytop/
   ├── index.html
   ├── past-seminars.html
   ├── css/
   ├── js/
   ├── images/
   ├── data/
   └── semesters/
   ```
3. **Set permissions** (if needed):
   - HTML/CSS/JS files: 644
   - Directories: 755

### Option 2: GitHub Pages (Recommended)

If you want automated deployments:

1. **Push changes** to your repository:
   ```bash
   git add .
   git commit -m "Configure for subdirectory deployment"
   git push
   ```

2. **Configure GitHub Pages** to publish to a subdirectory:
   - Go to repository Settings → Pages
   - Set source to your branch
   - Configure a custom domain or use the Pages URL

3. **If using custom domain**, you'll need to:
   - Set up a reverse proxy or
   - Configure your web server to point to the subdirectory

### Option 3: Using a Reverse Proxy (Advanced)

If you already have www.freeloop.space and want babytop to live at freeloop.space/babytop:

You'll need to configure your web server (nginx/Apache) to:
- Serve the babytop site from a subdirectory
- Or use a symbolic link/copy of the files to the babytop directory

## Testing After Deployment

After deployment, test these URLs:

1. **Main page**: `http://freeloop.space/babytop/` or `http://freeloop.space/babytop/index.html`
2. **Past seminars**: `http://freeloop.space/babytop/past-seminars.html`
3. **Individual semester**: `http://freeloop.space/babytop/semesters/spring2025.html`

## Troubleshooting

### Images/Styles Not Loading
- Check that all files were uploaded
- Verify the `<base>` tag is present in HTML files
- Clear browser cache

### JSON Data Not Loading
- Check browser console for 404 errors
- Verify data files exist in `/babytop/data/`
- Ensure JSON files are accessible (not blocked by server config)

### Navigation Links Not Working
- Verify the `<base>` tag path matches your deployment path
- Check that all HTML files have the correct base URL

## Reverting Changes

If you need to deploy to the root of the domain instead of a subdirectory:

1. **Remove or update the `<base>` tags** in all HTML files
2. **Or change them to `<base href="/">`** for root deployment

## Need Help?

- Check browser console (F12) for JavaScript errors
- Verify file permissions on the server
- Test with direct file URLs to isolate path issues

