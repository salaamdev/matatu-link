// src/utils/routesPdfGenerator.js
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const generateRoutesPDF = async (routes) => {
  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            padding: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #007AFF;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .header {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
          }
          .date {
            text-align: right;
            color: #666;
            margin-bottom: 20px;
          }
          .stats {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
          }
          .stats-title {
            font-weight: bold;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Routes Database Report</h1>
          <p>Complete list of registered routes and their details</p>
        </div>
        <div class="date">
          Generated on: ${new Date().toLocaleString()}
        </div>
        
        <div class="stats">
          <div class="stats-title">Quick Statistics</div>
          <p>Total Routes: ${routes.length}</p>
          <p>Active Routes: ${routes.filter(route => route.is_active).length}</p>
          <p>Average Fare: KES ${calculateAverageFare(routes)}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Route ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Fare (KES)</th>
              <th>Status</th>
              <th>Connected Stops</th>
              <th>Operating Matatus</th>
            </tr>
          </thead>
          <tbody>
            ${routes.map(route => `
              <tr>
                <td>${route.route_id || 'N/A'}</td>
                <td>${route.route_name || 'N/A'}</td>
                <td>${route.description || 'No description'}</td>
                <td>${route.fare || 'N/A'}</td>
                <td>${route.is_active ? 'Active' : 'Inactive'}</td>
                <td>${getConnectedStops(route)}</td>
                <td>${getOperatingMatatus(route)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false
    });
    
    await shareAsync(uri, { 
      UTI: '.pdf', 
      mimeType: 'application/pdf',
      dialogTitle: 'Save Routes Database PDF'
    });

    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Helper functions
const calculateAverageFare = (routes) => {
  const activeFares = routes
    .filter(route => route.fare && route.is_active)
    .map(route => Number(route.fare));
  
  if (activeFares.length === 0) return '0.00';
  
  const average = activeFares.reduce((acc, curr) => acc + curr, 0) / activeFares.length;
  return average.toFixed(2);
};

const getConnectedStops = (route) => {
  if (!route.connectedStops || route.connectedStops.length === 0) {
    return 'No stops assigned';
  }
  return route.connectedStops
    .map(stop => stop.stop_name)
    .join(', ');
};

const getOperatingMatatus = (route) => {
  if (!route.routeMatatus || route.routeMatatus.length === 0) {
    return 'No matatus assigned';
  }
  return route.routeMatatus
    .map(matatu => matatu.registration_number)
    .join(', ');
};

export { generateRoutesPDF };