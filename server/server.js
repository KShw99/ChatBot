import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 5174;

app.use(cors());
app.use(express.json());

app.get('/predict/:keyword', async (req, res) => {
    try {
        const keyword = req.params.keyword;
        console.log('Received keyword:', keyword);

        const apiResponse = await fetch(`http://localhost:8000/predict/${keyword}`);
        console.log('API Response Status:', apiResponse.status);

        if (!apiResponse.ok) {
            throw new Error(`Request to API failed with status: ${apiResponse.status}`);
        }

        const responseData = await apiResponse.json();
        console.log('API Response Data:', responseData);

        res.json(responseData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
