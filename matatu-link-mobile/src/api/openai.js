// src/api/openai.js

import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = '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';

const systemPrompt = `You are a Kenyan matatu route expert. Generate realistic route information for traveling between two locations in Nairobi. 
Respond in the following JSON format only:
{
  "routeNumber": "number",
  "routeName": "origin to destination",
  "matatuNumber": "KXX-123X format",
  "fare": "number in KES",
  "duration": "time in minutes",
  "viaPoints": ["array of major stops"],
  "additionalInfo": "traffic/weather/event info"
}`;

export const getRouteInfo = async (origin, destination) => {
    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: 'gpt-4o-mini',
                messages: [
                    {role: 'system', content: systemPrompt},
                    {
                        role: 'user',
                        content: `Generate route information from ${ origin } to ${ destination }`
                    }
                ],
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${ OPENAI_API_KEY }`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
        console.error('OpenAI API error:', error);
        throw error;
    }
};