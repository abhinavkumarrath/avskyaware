const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = 8000;

const imagesDir = path.join(__dirname, 'images');
const dziDir = path.join(__dirname, 'dzi');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Helper: get TIFF files from 'images' folder
function getTiffFiles() {
  return fs.readdirSync(imagesDir)
    .filter(file => file.toLowerCase().endsWith('.tif') || file.toLowerCase().endsWith('.tiff'))
    .map(file => path.parse(file).name);
}

// API: List TIFF image names (without extension)
app.get('/api/images', (req, res) => {
  try {
    const files = getTiffFiles();
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

