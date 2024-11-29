// src/api/nominatim.js

import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

export const fetchLocationSuggestions = async (query) => {
    try {
        const response = await axios.get(NOMINATIM_BASE_URL, {
            params: {
                q: query,
                format: 'json',
                addressdetails: 1,
                limit: 5,
                countrycodes: 'ke', // Restrict to Kenya; remove or modify as needed
            },
            headers: {
                'User-Agent': 'Matatu-Link-App/1.0', // Replace with your app name/version
                'Accept-Language': 'en', // Optional: Specify language
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching location suggestions:', error.message);
        return [];
    }
};
