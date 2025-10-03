const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const PORT = 8000;
const imagesDir = path.join(__dirname, 'images');
const dziDir = path.join(__dirname, 'dzi');
const previewsDir = path.join(__dirname, 'public', 'previews');

// Create previews directory if it doesn't exist
if (!fs.existsSync(previewsDir)) {
  fs.mkdirSync(previewsDir, { recursive: true });
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Helper: get TIFF files from 'images' folder
function getTiffFiles() {
  return fs.readdirSync(imagesDir)
    .filter(file => file.toLowerCase().endsWith('.tif') || file.toLowerCase().endsWith('.tiff'))
    .map(file => path.parse(file).name);
}

// Helper: Generate JPG preview from TIFF
async function generatePreview(name) {
  const tiffPath = path.join(imagesDir, name + '.tif');
  const previewPath = path.join(previewsDir, name + '.jpg');
  
  // Skip if preview already exists
  if (fs.existsSync(previewPath)) {
    return previewPath;
  }
  
  return new Promise((resolve, reject) => {
    // Use vips to generate a thumbnail (resize to 800px width, maintain aspect ratio)
    exec(`vips thumbnail "${tiffPath}" "${previewPath}" 800`, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message));
      else resolve(previewPath);
    });
  });
}

// API: List TIFF image names (without extension) and generate previews
app.get('/api/images', async (req, res) => {
  try {
    const files = getTiffFiles();
    
    // Generate previews for all images (async, non-blocking)
    files.forEach(async (name) => {
      try {
        await generatePreview(name);
      } catch (err) {
        console.error(`Error generating preview for ${name}:`, err.message);
      }
    });
    
    res.json({ images: files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Convert specific image to DZI and return DZI URL
app.post('/api/convert', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Image name missing' });
  
  const tiffPath = path.join(imagesDir, name + '.tif');
  if (!fs.existsSync(tiffPath)) {
    return res.status(404).json({ error: 'TIFF image not found' });
  }
  
  const outputDir = path.join(dziDir, name);
  const dziPath = path.join(outputDir, name + '.dzi');
  
  try {
    if (!fs.existsSync(dziPath)) {
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      
      await new Promise((resolve, reject) => {
        // Use libvips dzsave to create DZI tiles (JPEG quality 80)
        exec(`vips dzsave "${tiffPath}" "${path.join(outputDir, name)}" --suffix .jpg[Q=80]`, (err, stdout, stderr) => {
          if (err) reject(new Error(stderr || err.message));
          else resolve(stdout);
        });
      });
    }
    
    // Return the URL to the DZI file for OpenSeadragon
    res.json({ dziUrl: `/dzi/${name}/${name}.dzi` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve DZI and tiles folders statically
app.use('/dzi', express.static(dziDir));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

