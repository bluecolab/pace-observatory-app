export async function GET() {
    const latitude = 41.127494,
        longitude = -73.808235;
    const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY ?? '';

    const OPEN_WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}`;

    const response = await fetch(OPEN_WEATHER_API_URL);
    const data = await response.json();

    return Response.json(data);
}
