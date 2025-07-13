# Weather API Cache Server

This server fetches weather data from [WeatherAPI.com](https://www.weatherapi.com/) based on coordinates and caches it to reduce API usage. It checks for nearby cached locations (within 1 km radius) before making a new API call. Cached weather data expires after a set duration.

---

## Features

- Accepts POST requests with `{ coords: "lat,long" }`
- Caches responses for a configurable duration (default: 10 mins)
- Skips API calls if location is already cached nearby
- Cleans up stale cache entries periodically

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/weather-api-cache.git
cd weather-api-cache
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variables

Create a `.env` file in the root directory:

```env
SECRET_API_KEY=your_weatherapi_key
PORT=8080
```

> Get your API key from [https://www.weatherapi.com/](https://www.weatherapi.com/)

---

## Start the server

```bash
npm start
```

The server will start on `http://localhost:8080` (or whatever port you define).

---

## Example Request

```bash
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{"coords": "6.9271,79.8612"}'
```

---

## File Structure

```
.
├── weather-holder.js   # Weather cache logic
├── server.js           # Express server setup
├── .env                # API key and port config
└── README.md           # You are here
```

---

## Clean Shutdown

The server automatically clears expired cached weather data every 5 seconds. You can call `.close()` on `WeatherHolder` manually if needed to clear intervals on shutdown.
