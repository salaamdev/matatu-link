// src/utils/userPdfGenerator.js
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const generateUsersPDF = async (users) => {
  // Calculate user statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.is_active).length;
  const usersByRole = users.reduce((acc, user) => {
    acc[user.role_id] = (acc[user.role_id] || 0) + 1;
    return acc;
  }, {});

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
            margin-bottom: 20px;
          }
          .stats-title {
            font-weight: bold;
            margin-bottom: 10px;
          }
          .role-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            color: white;
            background-color: #34C759;
          }
          .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          }
          .status-active {
            background-color: #34C759;
            color: white;
          }
          .status-inactive {
            background-color: #FF3B30;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Users Database Report</h1>
          <p>Complete list of registered users (excluding sensitive information)</p>
        </div>
        
        <div class="date">
          Generated on: ${new Date().toLocaleString()}
        </div>

        <div class="stats">
          <div class="stats-title">User Statistics</div>
          <p>Total Users: ${totalUsers}</p>
          <p>Active Users: ${activeUsers}</p>
          <p>Inactive Users: ${totalUsers - activeUsers}</p>
          <p>Users by Role:</p>
          <ul>
            ${Object.entries(usersByRole).map(([roleId, count]) => `
              <li>${getRoleName(roleId)}: ${count} users</li>
            `).join('')}
          </ul>
        </div>

        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Contributions</th>
              <th>Reports</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(user => `
              <tr>
                <td>${user.username || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td><span class="role-badge">${getRoleName(user.role_id)}</span></td>
                <td>${formatDate(user.date_joined)}</td>
                <td>
                  <span class="status-badge ${user.is_active ? 'status-active' : 'status-inactive'}">
                    ${user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>${user.contributions?.length || 0}</td>
                <td>${user.reports?.length || 0}</td>
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
      dialogTitle: 'Save Users Database PDF'
    });

    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Helper functions
const getRoleName = (roleId) => {
  const roles = {
    1: 'Admin',
    2: 'Operator',
    3: 'User'
  };
  return roles[roleId] || 'Unknown';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export { generateUsersPDF };