// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Replace with your MongoDB connection string
const uri = 'mongodb://localhost:27017/domainnamesset'; // Update with your MongoDB URI

const app = express();
const port = 5000;

app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the Bookmark schema and model
const bookmarkSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    domainName: { type: String, required: true },
    tagline: String,
    metaTitle: String,
    metaDesc: String,
}, { timestamps: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema, 'bookmarks');

// Define the Industry schema and model
const industrySchema = new mongoose.Schema({
    Industry: String
});
const Industry = mongoose.model('Industry', industrySchema, 'industry'); // Use 'industry' as collection name

// Define the Extension schema and model
const extensionSchema = new mongoose.Schema({
    Extension: String
});
const Extension = mongoose.model('Extension', extensionSchema, 'extension'); // Use 'extension' as collection name

// Endpoint to get industries
app.get('/api/industries', async (req, res) => {
    try {
        const industries = await Industry.find();
        res.json(industries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching industries' });
    }
});

// Endpoint to get extensions
app.get('/api/extensions', async (req, res) => {
    try {
        const extensions = await Extension.find();
        res.json(extensions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching extensions' });
    }
});

// Get random extensions endpoint
app.get('/api/random-extensions', async (req, res) => {
    try {
        const extensions = await Extension.aggregate([{ $sample: { size: 3 } }]); // Get 3 random extensions
        res.json(extensions);
    } catch (error) {
        console.error('Error fetching random extensions:', error);
        res.status(500).send('Error fetching data');
    }
});

// Endpoint to add a bookmark
app.post('/api/bookmarks', async (req, res) => {
    const { userId, domainName, tagline, metaTitle, metaDesc } = req.body;

    try {
        // Prevent duplicates
        const existing = await Bookmark.findOne({ userId, domainName });

        if (existing) {
            return res.status(400).json({ message: 'Domain already bookmarked' });
        }

        const newBookmark = new Bookmark({
            userId,
            domainName,
            tagline,
            metaTitle,
            metaDesc
        });

        await newBookmark.save();

        res.status(201).json({ message: 'Bookmark added successfully' });

    } catch (error) {
        console.error('Error adding bookmark:', error);
        res.status(500).json({ message: 'Error adding bookmark' });
    }
});

// Fetch all bookmarks of a user (latest first)
app.get('/api/bookmarks/:userId', async (req, res) => {
    try {
        const bookmarks = await Bookmark
            .find({ userId: req.params.userId })
            .sort({ createdAt: -1 });

        res.status(200).json(bookmarks);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ message: 'Error fetching bookmarks' });
    }
});


// Delete a single bookmark by ID
app.delete('/api/bookmarks/:id', async (req, res) => {
    try {
        const deleted = await Bookmark.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        res.status(200).json({ message: 'Bookmark deleted successfully' });

    } catch (error) {
        console.error('Error deleting bookmark:', error);
        res.status(500).json({ message: 'Error deleting bookmark' });
    }
});

// Delete bookmark by Mongo _id
app.delete('/api/bookmarks/:id', async (req, res) => {
    try {
        const deleted = await Bookmark.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        res.status(200).json({ message: 'Bookmark deleted successfully' });

    } catch (error) {
        console.error('Error deleting bookmark:', error);
        res.status(500).json({ message: 'Error deleting bookmark' });
    }
});

// Delete all bookmarks for a user
app.delete('/api/bookmarks/user/:userId', async (req, res) => {
    try {
        await Bookmark.deleteMany({ userId: req.params.userId });

        res.status(200).json({ message: 'All bookmarks deleted successfully' });

    } catch (error) {
        console.error('Error deleting all bookmarks:', error);
        res.status(500).json({ message: 'Error deleting bookmarks' });
    }
});

app.delete('/api/bookmarks/:id/:userId', async (req, res) => {
    try {
        const deleted = await Bookmark.findOneAndDelete({
            _id: req.params.id,
            userId: req.params.userId
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        res.status(200).json({ message: 'Deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error deleting bookmark' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
