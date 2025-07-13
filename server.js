import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import WeatherHolder from './weather-holder.js';

env.config();

const key = process.env.SECRET_API_KEY;
const PORT = process.env.PORT || 8080;
const app = express();
const weatherHolder = new WeatherHolder(key);

app.use(cors());
app.use(express.json());

app.post('', async (req, res) => {
	const body = req.body;

	if (!body) {
		res.status(400).send({
			reason: 'Body is empty. expected body: "{ coords: number,number }"'
		});

		return;
	}

	if (typeof body.coords != 'string') {
		res.status(400).send({
			reason: 'Invalid coords. expected coords: "{ coords: number,number }"'
		});

		return;
	}

	const [lat, long] = body.coords.split(',').map(v => Number(v));

	if (!lat || !long) {
		res.status(400).send({
			reason: 'Invalid coords. expected coords: "{ coords: number,number }"'
		});

		return;
	}

	try {
		res.send(await weatherHolder.get(lat, long));
	} catch (error) {
		res.status(500).send({ error });
	}
});

app.listen(PORT, (error) => {
	if (error) {
		console.error(error);
	} else {
		console.log('Server Listening on PORT: ' + PORT)
	}
});
