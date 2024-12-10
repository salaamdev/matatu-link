// src/utils/reportsPdfGenerator.js
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const generateReportsPDF = async (reports) => {
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
          .status {
            padding: 4px 8px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
          }
          .status-pending {
            background-color: #FF9500;
          }
          .status-reviewed {
            background-color: #007AFF;
          }
          .status-resolved {
            background-color: #34C759;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Reports Database</h1>
          <p>Complete list of reported issues and their status</p>
        </div>
        
        <div class="date">
          Generated on: ${new Date().toLocaleString()}
        </div>

        <div class="stats">
          <div class="stats-title">Reports Summary</div>
          <p>Total Reports: ${reports.length}</p>
          <p>Pending Reports: ${reports.filter(report => report.status === 'pending').length}</p>
          <p>Reviewed Reports: ${reports.filter(report => report.status === 'reviewed').length}</p>
          <p>Resolved Reports: ${reports.filter(report => report.status === 'resolved').length}</p>
          <p>Safety Reports: ${reports.filter(report => report.report_type === 'safety').length}</p>
          <p>Security Reports: ${reports.filter(report => report.report_type === 'security').length}</p>
          <p>Other Reports: ${reports.filter(report => report.report_type === 'other').length}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Description</th>
              <th>Status</th>
              <th>Reporter</th>
              <th>Related Matatu</th>
              <th>Related Route</th>
              <th>Date Reported</th>
            </tr>
          </thead>
          <tbody>
            ${reports.map(report => `
              <tr>
                <td>${report.report_id}</td>
                <td>${report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)}</td>
                <td>${report.description}</td>
                <td>
                  <span class="status status-${report.status}">
                    ${report.status.toUpperCase()}
                  </span>
                </td>
                <td>${report.reportUser ? report.reportUser.username : 'N/A'}</td>
                <td>${report.reportMatatu ? report.reportMatatu.registration_number : 'N/A'}</td>
                <td>${report.reportRoute ? report.reportRoute.route_name : 'N/A'}</td>
                <td>${new Date(report.date_reported).toLocaleString()}</td>
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
      dialogTitle: 'Save Reports Database PDF'
    });

    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export { generateReportsPDF };