# AV SkyAware: Interactive NASA Image Viewer with AI Descriptions.
## Project Overview
AV SkyAware is a web-based interactive viewer for large NASA astronomy and planetary imag
---
## Features
- Deep zoom navigation for gigapixel NASA images (JWST, Hubble, Mars orbiters, Earth obse
- Collaborative annotation panel for region marking, comments, and export
- Local AI image region captioning with Moondream model hosted by Ollama
- Offline-capable, privacy-preserving AI processing on the user’s machine
- Open-source, modular, easy to deploy and extend
---
## Setup Instructions
### Prerequisites
- Node.js (v16+ recommended)
- Python 3 (for any image processing scripts)
- Ollama AI platform installed (https://ollama.com) with access to Moondream model
- Deep Zoom Image (DZI) tiles generated for your NASA images (using VIPS or compatible to
### Backend Setup
1. Clone this repository and install dependencies:
npm install
2. Prepare your NASA images as DZI tiles in a directory served via your backend API.
give me the updated readme.md so that it aslo help
with setting local ai moondream that is being used
with the help of ollama
3. Run the backend server to serve images and API endpoints:
node server.js
---
### Frontend Setup
1. Serve the public directory over HTTP (e.g., using the backend server).
2. Access the viewer in your browser at the expected URL (`http://localhost:3000/viewer.h
---
### AI Moondream with Ollama Setup
1. Install and configure Ollama on your machine:
- Download and install Ollama: https://ollama.com
2. Pull the Moondream AI model (lightweight vision-language model suitable for laptops wi
ollama pull moondream
3. Serve Ollama API locally:
ollama serve
If the default port 11434 is busy, stop conflicting processes or start on another port (
export OLLAMA_HOST=127.0.0.1:11500
Update the frontend fetch URL in `viewer.html` accordingly to the chosen port.
---
### Usage
- Open the viewer in your browser.
- Click any image in the gallery to open the deep zoom viewer.
- Use the "What is This?" button to let the local Moondream AI describe the selected regi
- Use the Annotation panel at the top center to enable annotating, add notes by clicking
---
### Notes
- Ensure your backend `/api/images` endpoint correctly returns the list of NASA image IDs
- Configure your thumbnails and DZI tiles to be accessible by the frontend.
- The AI integration requires the Ollama server running locally with the Moondream model
- Annotations are stored locally in browser localStorage.
---
## Acknowledgments
- NASA for providing open public datasets.
- Ollama for enabling local AI model serving.
- OpenSeadragon for the powerful deep zoom image viewer.
---
## License
MIT License
---
For further help or issues, please refer to the repository's issue tracker or contact the  development team.
