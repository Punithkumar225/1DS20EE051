// backend.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = 8008;

app.use(cors());

const fetchNumbersFromURL = async (url) => {
    try {
        const response = await fetch(url, { timeout: 500 });
        const data = await response.json();
        return data.numbers;
    } catch (error) {
        console.error(`Error fetching numbers from URL: ${url}`, error);
        return [];
    }
};

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;

    if (!urls) {
        return res.status(400).json({ error: 'No URLs provided' });
    }

    const urlsArray = Array.isArray(urls) ? urls : [urls];
    const promises = urlsArray.map(fetchNumbersFromURL);

    try {
        const results = await Promise.allSettled(promises);

        const validResponses = results
            .filter((result) => result.status === 'fulfilled')
            .map((result) => result.value)
            .flat();

        const mergedNumbers = [...new Set(validResponses)].sort((a, b) => a - b);
        res.json({ numbers: mergedNumbers });
    } catch (error) {
        console.error('Error fetching numbers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Number Management Service is running on http://localhost:${port}`);
});
