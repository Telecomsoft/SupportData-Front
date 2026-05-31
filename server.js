import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Use the custom `PRO` environment variable or fallback to `NODE_ENV`
const isProd = process.env.PRO === 'true' || process.env.NODE_ENV === 'production';

const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

// These two lines are needed to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!isProd) {
    console.log('Running in development mode');
    // Add any development-specific logic here if needed
} else {
    console.log('Running in production mode');

    // Serve static files from the dist directory (production build)
    app.use(express.static(path.join(__dirname, 'dist')));

    // For all routes, send the index.html file
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
