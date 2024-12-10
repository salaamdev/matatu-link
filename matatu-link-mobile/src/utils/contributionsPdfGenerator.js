// src/utils/contributionsPdfGenerator.js
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const generateContributionsPDF = async (contributions) => {
  // Calculate statistics
  const totalContributions = contributions.length;
  const pendingContributions = contributions.filter(c => c.status === 'pending').length;
  const approvedContributions = contributions.filter(c => c.status === 'approved').length;
  const rejectedContributions = contributions.filter(c => c.status === 'rejected').length;

  const contributionsByType = contributions.reduce((acc, c) => {
    acc[c.contribution_type] = (acc[c.contribution_type] || 0) + 1;
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
          }
          .stats-title {
            font-weight: bold;
            margin-bottom: 10px;
          }
          .type-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            color: white;
            background-color: #5856D6;
          }
          .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            color: white;
          }
          .status-pending {
            background-color: #FF9500;
          }
          .status-approved {
            background-color: #34C759;
          }
          .status-rejected {
            background-color: #FF3B30;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Contributions Database Report</h1>
          <p>Complete list of user contributions and their status</p>
        </div>
        
        <div class="date">
          Generated on: ${new Date().toLocaleString()}
        </div>

        <div class="stats">
          <div class="stats-title">Contributions Summary</div>
          <p>Total Contributions: ${totalContributions}</p>
          <p>Pending: ${pendingContributions}</p>
          <p>Approved: ${approvedContributions}</p>
          <p>Rejected: ${rejectedContributions}</p>
          <p>Contributions by Type:</p>
          <ul>
            ${Object.entries(contributionsByType).map(([type, count]) => `
              <li>${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}</li>
            `).join('')}
          </ul>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Content</th>
              <th>Status</th>
              <th>Contributor</th>
              <th>Date Submitted</th>
              <th>Votes</th>
              <th>Related ID</th>
            </tr>
          </thead>
          <tbody>
            ${contributions.map(contribution => `
              <tr>
                <td>${contribution.contribution_id}</td>
                <td>
                  <span class="type-badge">
                    ${contribution.contribution_type.toUpperCase()}
                  </span>
                </td>
                <td>${contribution.content}</td>
                <td>
                  <span class="status-badge status-${contribution.status}">
                    ${contribution.status.toUpperCase()}
                  </span>
                </td>
                <td>${contribution.contributorUser?.username || 'N/A'}</td>
                <td>${formatDate(contribution.date_submitted)}</td>
                <td>${getVoteCounts(contribution)}</td>
                <td>${getRelatedId(contribution)}</td>
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
      dialogTitle: 'Save Contributions Database PDF'
    });

    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getVoteCounts = (contribution) => {
  const upvotes = contribution.contributionVotes?.filter(v => v.vote_type === 'upvote').length || 0;
  const downvotes = contribution.contributionVotes?.filter(v => v.vote_type === 'downvote').length || 0;
  return `👍 ${upvotes} | 👎 ${downvotes}`;
};

const getRelatedId = (contribution) => {
  switch (contribution.contribution_type) {
    case 'route':
      return contribution.route_id ? `Route: ${contribution.route_id}` : 'N/A';
    case 'stop':
      return contribution.stop_id ? `Stop: ${contribution.stop_id}` : 'N/A';
    case 'matatu':
      return contribution.matatu_id ? `Matatu: ${contribution.matatu_id}` : 'N/A';
    default:
      return 'N/A';
  }
};

export { generateContributionsPDF };