// src/utils/pdfGenerator.js
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const generateMatatuPDF = async (matatus) => {
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
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Matatu Database Report</h1>
          <p>Complete list of registered matatus</p>
        </div>
        <div class="date">
          Generated on: ${new Date().toLocaleString()}
        </div>
        <table>
          <thead>
            <tr>
              <th>Registration</th>
              <th>Model</th>
              <th>Make</th>
              <th>Year</th>
              <th>Capacity</th>
              <th>Route</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${matatus.map(matatu => `
              <tr>
                <td>${matatu.registration_number || 'N/A'}</td>
                <td>${matatu.model || 'N/A'}</td>
                <td>${matatu.make || 'N/A'}</td>
                <td>${matatu.year || 'N/A'}</td>
                <td>${matatu.capacity || 'N/A'}</td>
                <td>${matatu.matatuRoute?.route_name || 'Not Assigned'}</td>
                <td>${matatu.current_status || 'Unknown'}</td>
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
      dialogTitle: 'Save Matatu Database PDF'
    });

    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export { generateMatatuPDF };