AV SkyAwareAV SkyAware is a fast, minimal Deep Zoom image viewer that lets users explore very large astronomical TIFF images using OpenSeadragon. TIFFs are converted to DZI pyramids via libvips for smooth pan/zoom at any scale.FeaturesOpenSeadragon-based deep zoom viewer with navigator and smooth zoom/pan.TIFF to DZI conversion using libvips (dzsave).Prebuilt DZI tiles can be served as static assets (recommended for production).Optional local upload/convert endpoints for development.RequirementsNode.js 18+ (for local development server)libvips installed (for DZI conversion)macOS (Homebrew): brew install vipsUbuntu/Debian: sudo apt-get install -y libvipsArch: sudo pacman -S vipsWindows: use libvips binaries or WSL with Ubuntu and apt-get install libvipsGit LFS (for large TIFFs stored in the repo): https://git-lfs.comProject Structure.
├── images/                # Place source .tif/.tiff here (local dev)
├── public/
│   ├── index.html         # Landing page
│   ├── viewer.html        # Viewer + UI (upload in dev only)
│   ├── app.css            # Styles
│   └── dzi/               # Prebuilt DZI XML + *_files/ tiles for production
├── server.js              # Local dev server (Express) for upload/convert
├── package.json
└── README.mdQuick Start (Local Development)Install dependencies:npm installEnsure libvips is installed (see Requirements).Start the development server:npm startOpen the viewer:http://localhost:8080/viewer.htmlUse the viewer:Upload a .tif/.tiff using the Upload button (dev only).Click Refresh, select the TIFF, and click Open to convert and view.The server will generate a DZI at public/dzi/.dzi with a sibling _files/ directory.Notes:In production hosting (Vercel, GitHub Pages), do not rely on runtime uploads/convert. Prebuild tiles and serve as static files.Prebuilding DZI Tiles (Recommended)For each TIFF:vips dzsave images/galaxy.tif public/dzi/galaxy --tile-size 256 --overlap 1 --suffix ".jpg[Q=80]"This creates:public/dzi/galaxy.dzipublic/dzi/galaxy_files/ (tiles)OpenSeadragon expects the DZI XML and the tiles folder with identical basename (galaxy.dzi ↔ galaxy_files/). Update viewer.html to use:const dziPath = "dzi/galaxy.dzi";
OpenSeadragon({
  id: "viewer",
  prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
  tileSources: dziPath,
  showNavigator: true
});Git LFS for Large TIFFsIf committing TIFFs to the repository:git lfs install
git lfs track "*.tif" "*.tiff"
git add .gitattributes
git add images
git commit -m "Track TIFFs via Git LFS"
git pushTip: Consider keeping only representative samples in Git and host large datasets elsewhere (S3/R2) to avoid LFS quota issues.Deployment OptionsGitHub Pages (Static Hosting)GitHub Pages serves only static files. Use prebuilt DZI tiles and relative paths.Create a docs/ folder with the deployable site:docs/
  index.html
  viewer.html
  app.css
  dzi/...Make sure tileSources uses a relative path like "dzi/galaxy.dzi" (not “/dzi/…”).Enable Pages:Repo → Settings → PagesSource: Deploy from a branchBranch: main, Folder: /docsSite URL: https://USERNAME.github.io/REPO/Validate:Open https://USERNAME.github.io/REPO/dzi/galaxy.dziOpen a tile: https://USERNAME.github.io/REPO/dzi/galaxy_files/10/0_0.jpgIf either is 404, the path/folder names are wrong or not included in docs/.Vercel (Static or Storage-backed)Static approach: Prebuild DZI tiles into public/dzi and deploy as a static site. Do not write tiles at runtime; do not depend on Express uploads in production.Storage approach: Upload TIFFs and tiles to object storage (S3/R2/Vercel Blob) and set tileSources to the absolute DZI URL. Ensure CORS GET is allowed for .dzi and tile files.Notes for Vercel:Serverless functions have a read-only persistent FS; /tmp is temporary only.Avoid large uploads to functions; use browser → storage signed uploads or stream to storage and process off-Vercel.TroubleshootingViewer blank or 404 on tiles:Ensure basename match: galaxy.dzi and galaxy_files/.Check that DZI and _files/ are actually deployed and reachable at the path you use.Use relative paths for GitHub Pages: "dzi/galaxy.dzi" rather than "/dzi/galaxy.dzi".Git push timeouts / HTTP 408:Use Git LFS for TIFFs, split pushes into batches, or push via SSH.Avoid committing huge generated tile trees if possible.Vercel fails to show images after deploy:You’re likely generating tiles at runtime; switch to prebuilt tiles or object storage.ScriptsStart local dev server:npm startExample VIPS command:vips dzsave images/input.tif public/dzi/input --tile-size 256 --overlap 1 --suffix ".jpg[Q=80]"CreditsOpenSeadragon (BSD-3-Clause) — deep zoom viewerlibvips (LGPL-2.1) — fast image processingLicenseInsert your preferred license here (e.g., MIT).Usage flow summary:Local dev: start server → upload TIFF → convert → view.Production: prebuild DZI → deploy static DZI + tiles → viewer points to /dzi/.dzi or storage URL.For GitHub Pages: put the finished site under docs/ and use relative paths.
