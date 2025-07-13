async function getWeather(key, lat, long) {
	try {
		if (!key) throw new Error('Unknown error with error code: 223434'); // third party api key not found

		const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${key}&q=${lat},${long}`);

		if (!response.ok) throw new Error('Unknown error with error code: 223435'); // response failed

		return await response.json();
	} catch (error) {
		throw error;
	}
}

export default class WeatherHolder {
	constructor(key) {
		this.key = key;
		this.savedLocations = new Map();

		const locationExpiryTime = 1800000; // 30 * 60 * 1000 - 30 min

		this.locationCleanInterval = setInterval(() => {
			const locationKeys = this.savedLocations.keys();

			while (true) {
				const nextKey = locationKeys.next().value;

				if (!nextKey) return;

				const timeStamp = this.savedLocations.get(nextKey).timeStamp;

				if (performance.now() - timeStamp > locationExpiryTime) this.savedLocations.delete(timeStamp);
			}
		}, 5000);
	}

	close() {
		clearInterval(this.locationCleanInterval);
	}

	#getNearbyLocationIfAvailable(lat, long) {
		const locationKeys = this.savedLocations.keys();

		while (true) {
			const nextKey = locationKeys.next().value;

			if (!nextKey) return null;

			const [curLat, curLong] = nextKey.split(',').map(v => Number(v));
			const distance = (curLat - lat) ** 2 + (curLong - long) ** 2;

			if (distance < 1) return nextKey;
		}
	}

	get(lat, long) {
		return new Promise(async (res, rej) => {
			const nearbyAvailableLocationKey = this.#getNearbyLocationIfAvailable(lat, long);

			if (nearbyAvailableLocationKey) {
				res(this.savedLocations.get(nearbyAvailableLocationKey).weather);
				return;
			}

			try {
				const weather = await getWeather(this.key, lat, long);

				this.savedLocations.set(`${lat},${long}`, {
					timestamp: performance.now(),
					weather
				});

				res(weather);
			} catch (error) {
				console.log(error);
				rej({ error });
			}
		});
	}
}
