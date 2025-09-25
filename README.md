# AV SkyAware

AV SkyAware is a fast, minimal Deep Zoom image viewer for very large astronomical images using OpenSeadragon. TIFFs are converted to DZI pyramids via libvips for smooth pan/zoom at any scale.

## Features

- OpenSeadragon deep zoom viewer with navigator and smooth pan/zoom  
- TIFF → DZI conversion using libvips (dzsave)  
- Prebuilt DZI tiles served as static assets for production  
- Optional local upload/convert endpoints for development  

## Requirements

- Node.js 18+ (for local development server)  
- libvips installed (for DZI conversion)  
  - macOS (Homebrew): brew install vips  
  - Ubuntu/Debian: sudo apt-get install -y libvips  
  - Arch: sudo pacman -S vips  
  - Windows: libvips binaries or WSL (Ubuntu) with apt-get install libvips  
- Git LFS (if storing large TIFFs in Git): https://git-lfs.com  

## Project Structure

```
.
├── images/                # Source .tif/.tiff for local dev
├── public/
│   ├── index.html         # Landing page
│   ├── viewer.html        # Viewer + UI (upload in dev only)
│   ├── app.css            # Styles
│   └── dzi/               # Prebuilt DZI XML + *_files/ tiles for production
├── server.js              # Local dev server (Express) for upload/convert
├── package.json
└── README.md
```

## Quick Start (Local Development)

1) Install dependencies:
```
npm install
```

2) Ensure libvips is installed (see Requirements).

3) Start the development server:
```
npm start
```

4) Open the viewer:
- http://localhost:8080/viewer.html

5) Use the viewer (dev only):
- Upload a .tif/.tiff using the Upload button.  
- Click Refresh, select the TIFF, then click Open to convert and view.  
- The server generates DZI at public/dzi/<name>.dzi with a sibling <name>_files/ directory.

Note: In production (Vercel, GitHub Pages), do not rely on runtime uploads/convert. Prebuild tiles and serve them as static files.

## Prebuilding DZI Tiles (Recommended)

For each TIFF:
```
vips dzsave images/galaxy.tif public/dzi/galaxy --tile-size 256 --overlap 1 --suffix ".jpg[Q=80]"
```

This creates:
- public/dzi/galaxy.dzi  
- public/dzi/galaxy_files/ (tiles)

OpenSeadragon expects identical basenames:
- galaxy.dzi ↔ galaxy_files/

Update viewer.html:
```html
<script>
  const dziPath = "dzi/galaxy.dzi"; // relative path
  OpenSeadragon({
    id: "viewer",
    prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
    tileSources: dziPath,
    showNavigator: true
  });
</script>
```

## Git LFS for Large TIFFs

If committing TIFFs to the repository:
```
git lfs install
git lfs track "*.tif" "*.tiff"
git add .gitattributes
git add images
git commit -m "Track TIFFs via Git LFS"
git push
```

Tip: Consider keeping only representative TIFFs in Git; host large datasets externally (S3/R2) to avoid LFS quotas.

## Deployment

### GitHub Pages (Static Hosting)

- GitHub Pages serves static files only. Use prebuilt DZI tiles and relative paths.  
- Put all deployable files under docs/:
```
docs/
  index.html
  viewer.html
  app.css
  dzi/...
```
- Ensure tileSources uses a relative path like "dzi/galaxy.dzi" (not "/dzi/...").

Enable Pages:
- Repo → Settings → Pages  
- Source: Deploy from a branch  
- Branch: main, Folder: /docs

Validate:
- https://USERNAME.github.io/REPO/dzi/galaxy.dzi  
- https://USERNAME.github.io/REPO/dzi/galaxy_files/10/0_0.jpg

If 404, the file path/folder names are wrong or not included in docs/.

### Vercel (Static or Storage-backed)

Static approach:
- Prebuild DZI tiles into public/dzi and deploy as a static site.  
- Do not write tiles at runtime; avoid Express uploads in production.

Storage approach:
- Upload TIFFs/DZIs to object storage (S3/R2/Vercel Blob).  
- Set tileSources to the absolute DZI URL.  
- Ensure CORS GET is allowed for .dzi and tile files.

Notes:
- Vercel serverless has read-only persistent filesystem; /tmp is temporary only.  
- Avoid large uploads to functions; use browser → storage (signed) uploads or stream to storage and process off-Vercel.

## Troubleshooting

- Blank viewer or 404 tiles:
  - Basename mismatch: galaxy.dzi must pair with galaxy_files/  
  - DZI and tiles not present at the path you use  
  - On GitHub Pages, use relative "dzi/galaxy.dzi" paths (not "/dzi/...").

- Git push timeouts / HTTP 408:
  - Track TIFFs with Git LFS, split pushes into batches, or push via SSH.  
  - Avoid committing massive generated tile trees.

- Vercel images missing after deploy:
  - Likely generating tiles at runtime; prebuild tiles or host in storage.

## Scripts

Start local dev server:
```
npm start
```

Example VIPS command:
```
vips dzsave images/input.tif public/dzi/input --tile-size 256 --overlap 1 --suffix ".jpg[Q=80]"
```

## Credits

- OpenSeadragon (BSD-3-Clause) — deep zoom viewer  
- libvips (LGPL-2.1) — fast image processing  

## License

MIT (or your preferred license)

## Usage Flow

- Local dev: start server → upload TIFF → convert → view  
- Production: prebuild DZI → deploy static DZI + tiles → viewer points to dzi/<name>.dzi or storage URL  
- GitHub Pages: put the finished site under docs/ and use relative paths

Citations:
[1] selected_image_6797647271467286435.jpg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/40440866/a804b6f4-019c-4fef-b46a-fc969af577bc/selected_image_6797647271467286435.jpg
