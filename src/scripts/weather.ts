type Weather = {
	current: {
		temperature_2m: number;
		relative_humidity_2m: number;
		wind_speed_10m: number;
	};
};

type Coordinates = {
	latitude: number;
	longitude: number;
};

const coordinates: Coordinates = {
	latitude: 48.4647,
	longitude: 35.0462,
};

const monthNames = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

const pad = (value: number): string => value.toString().padStart(2, "0");

const formatDateTime = (date: Date): string => {
	const day = pad(date.getDate());
	const month = monthNames.at(date.getMonth()) ?? "Jan";
	const year = date.getFullYear();
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());

	return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
};

const start = (): void => {
	const element = document.getElementById("info");

	if (element === null) {
		return;
	}

	let weather: Weather | undefined;

	const render = (): void => {
		const parts = weather
			? [
					`${weather.current.temperature_2m.toFixed(1)} °C`,
					`${weather.current.wind_speed_10m.toFixed(1)} km/h`,
					`${weather.current.relative_humidity_2m.toFixed(0)} %`,
					formatDateTime(new Date()),
				]
			: [formatDateTime(new Date())];

		element.replaceChildren();

		for (const [index, text] of parts.entries()) {
			if (index > 0) {
				const separator = document.createElement("span");
				separator.className = "info-sep";
				separator.textContent = "·";
				element.append(separator);
			}

			const part = document.createElement("span");
			part.className = "info-part";
			part.textContent = text;
			element.append(part);
		}
	};

	const refreshWeather = async (coordinates: Coordinates): Promise<void> => {
		try {
			const { latitude, longitude } = coordinates;
			const response = await fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`,
			);

			if (!response.ok) {
				throw new Error(
					`Weather request failed with status ${response.status}`,
				);
			}

			weather = (await response.json()) as Weather;
			render();
		} catch {
			weather = undefined;
			render();
		}
	};

	const startWeather = (): void => {
		refreshWeather(coordinates).catch(() => {
			weather = undefined;
			render();
		});
		window.setInterval(() => {
			refreshWeather(coordinates).catch(() => {
				weather = undefined;
				render();
			});
		}, 600_000);
	};

	render();
	window.setInterval(render, 1000);
	startWeather();
};

start();
