import React, { useState } from "react";
import axios from "axios";

function App() {
    const [data, setData] = useState({});
    const [location, setLocation] = useState('');
    const [error, setError] = useState(''); // State for error handling
    const [loading, setLoading] = useState(false); // For showing a loading state

    const apiKey = '7777747ae3eb5cf8762ae3065669ce2c';

    // Function to search weather by city name (same as before)
    const searchLocation = (event) => {
        if (event.key === 'Enter') {
            fetchWeatherByCity(location);
        }
    };

    // Function to fetch weather using city name
    const fetchWeatherByCity = (city) => {
        setLoading(true);
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
        axios.get(url)
            .then((response) => {
                setData(response.data);
                setError(''); // Clear error if the response is successful
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    setError('Please enter a correct city name.'); // Custom message for 404
                } else {
                    setError('Error fetching weather data. Please try again.');
                }
                setData({}); // Clear previous data
            })
            .finally(() => {
                setLoading(false);
            });
        setLocation(''); // Clear input after search
    };

    // Function to fetch weather using latitude and longitude
    const fetchWeatherByCoords = (latitude, longitude) => {
        setLoading(true);
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
        axios.get(url)
            .then((response) => {
                setData(response.data);
                setError(''); // Clear error if the response is successful
            })
            .catch(() => {
                setError('Error fetching weather data. Please try again.');
                setData({}); // Clear previous data
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Function to get the user's current location using Geolocation API
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoords(latitude, longitude);
                },
                (error) => {
                    setError('Unable to retrieve your location.');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    return (
        <div className="app">
            <div className="container">
                <div className="search">
                    <input
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="Enter Location"
                        onKeyDown={searchLocation}
                        type="text"
                    />
                    <button onClick={getUserLocation}>
                        Use My Location
                    </button>
                </div>
                {/* Display the error message if it exists */}
                {error && <p className="locationError" style={{ color: 'white', fontWeight: 'bold' }}>{error}</p>}

                {/* Loading state */}
                {loading && <p style={{ color: 'white' }}>Loading...</p>}

                <div className="top">
                    <div className="location">
                        <p>{data.name}</p>
                    </div>
                    <div className="temp">
                        {data.main ? <h1>{data.main.temp} °F</h1> : null}
                    </div>
                    <div className="description">
                        {data.weather ? <p>{data.weather[0].main}</p> : null}
                    </div>
                </div>

                {data.name !== undefined && data.name !== '' &&
                    <div className="bottom">
                        <div className="feels">
                            <p>Feels Like</p>
                            {data.main ? <p>{data.main.feels_like} °F</p> : null}
                        </div>
                        <div className="humidity">
                            <p>Humidity</p>
                            {data.main ? <p className="bold">{data.main.humidity} %</p> : null}
                        </div>
                        <div className="wind">
                            <p>Wind Speed</p>
                            {data.wind ? <p className="bold">{data.wind.speed} mph</p> : null}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default App;
