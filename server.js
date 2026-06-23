const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
app.use(cors()); // Frontend se connect karne ke liye
const upload = multer(); // Image file handle karne ke liye

// ROUTE: Background Remove Karne Ke Liye
app.post('/api/remove-bg', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file missing!' });

    const formData = new FormData();
    formData.append('image_file', req.file.buffer, { filename: req.file.originalname });

    // Clipdrop Real API Call
    const response = await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
      headers: {
        'x-api-key': 'TERI_REAL_CLIPDROP_API_KEY_YAHAN_AAYEGI', // Apni key yahan daal
        ...formData.getHeaders(),
      },
      responseType: 'arraybuffer' // Kyunki output me photo aayegi, text nahi
    });

    // Send edited image back to frontend
    res.set('Content-Type', 'image/png');
    res.send(response.data);

  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: 'AI processing failed!' });
  }
});

app.listen(5000, () => console.log('Backend running on port 5000 🚀'));
