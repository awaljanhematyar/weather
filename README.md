# City Weather | JavaScript Portfolio Demo

Key-free city weather portfolio demo using Open-Meteo, with current temperature, humidity, wind, daily high/low and request error handling.

Part of my JavaScript practice work. Explore my complete projects on [GitHub](https://github.com/awaljanhematyar) or my [developer portfolio](https://hematyar-professional-portfolio.vercel.app/).

[Live demo](https://awaljanhematyar.github.io/weather/)

## Features

- Search a city name and show the first matching location.
- Display temperature, apparent temperature, humidity, wind and daily high/low.
- Use weather condition icons and explicit units.
- Handle missing cities, network errors and timed-out requests.
- Ignore stale responses when a newer search starts.
- Load Kabul as the default city.

## Run locally

```sh
git clone https://github.com/awaljanhematyar/weather.git
cd weather
```

Serve the folder using VS Code Live Server and open `index.html`. There is no npm installation or build step. Use a modern browser.

## Source map

| File | Purpose |
| --- | --- |
| `index.html` | Interface structure |
| `style.css` | Layout and visual styles |
| `script.js` | Interaction logic |
| `images/` | Weather icons |

## Verification and scope

Targeted mocked-fetch checks cover display fields, request URLs, units, icons, missing cities, network failure, blank searches and stale responses. A live browser smoke check displayed current Kabul weather. This is not a full browser audit.

Non-commercial portfolio demonstration using Open-Meteo forecast and geocoding services. No API key is stored in the current source. Provider limits and terms apply.

## Data sources

[Open-Meteo forecast documentation](https://open-meteo.com/en/docs) · [Geocoding documentation](https://open-meteo.com/en/docs/geocoding-api) · [GeoNames](https://www.geonames.org/)

The first matching city is selected. Use a country qualifier to disambiguate names. External services require internet access. Review provider terms before commercial deployment.

## Author

[Awal Jan Hematyar](https://github.com/awaljanhematyar), Front-End Developer | React Developer.
