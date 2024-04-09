import * as dotenv from 'dotenv';
dotenv.config();
const apikey = process.env.API_token;

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
		{
			headers: { Authorization: `Bearer ${apikey}` },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}

app.post('/dream', async (req, res) => {
    const prompt = req.body.prompt;

	const response = await query({"inputs": prompt});
   
    // Convert the Blob to a Buffer
    const buffer = await response.arrayBuffer();
    const data = Buffer.from(buffer);

    // Set the correct content-type
    res.setHeader('Content-Type', 'image/jpeg');

    // Send the image data
    res.send(data);
});
app.listen(8080, () => console.log('Server running on port 8080, http://localhost:8080/dream'));

