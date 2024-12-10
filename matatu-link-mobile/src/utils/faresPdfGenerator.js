// src/utils/faresPdfGenerator.js
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const generateFaresPDF = async (fares) => {
  // Calculate statistics
  const totalFares = fares.length;
  const totalAmount = fares.reduce((acc, fare) => acc + Number(fare.amount), 0);
  const averageAmount = totalAmount / totalFares || 0;
  
  const paymentMethods = fares.reduce((acc, fare) => {
    acc[fare.payment_method] = (acc[fare.payment_method] || 0) + 1;
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
          .payment-badge {
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
          .status-completed {
            background-color: #34C759;
          }
          .status-pending {
            background-color: #FF9500;
          }
          .status-failed {
            background-color: #FF3B30;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Fares Database Report</h1>
          <p>Complete list of fare transactions and payment records</p>
        </div>
        
        <div class="date">
          Generated on: ${new Date().toLocaleString()}
        </div>

        <div class="stats">
          <div class="stats-title">Transaction Summary</div>
          <p>Total Transactions: ${totalFares}</p>
          <p>Total Amount: KES ${totalAmount.toFixed(2)}</p>
          <p>Average Fare: KES ${averageAmount.toFixed(2)}</p>
          <p>Payment Methods:</p>
          <ul>
            ${Object.entries(paymentMethods).map(([method, count]) => `
              <li>${method.toUpperCase()}: ${count} transactions</li>
            `).join('')}
          </ul>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Amount (KES)</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Matatu</th>
              <th>Route</th>
              <th>Date</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            ${fares.map(fare => `
              <tr>
                <td>${fare.fare_id}</td>
                <td>${fare.fareUser?.username || 'N/A'}</td>
                <td>${fare.amount}</td>
                <td>
                  <span class="payment-badge">
                    ${fare.payment_method.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span class="status-badge status-${fare.payments?.[0]?.payment_status || 'pending'}">
                    ${(fare.payments?.[0]?.payment_status || 'pending').toUpperCase()}
                  </span>
                </td>
                <td>${fare.fareMatatu?.registration_number || 'N/A'}</td>
                <td>${fare.fareRoute?.route_name || 'N/A'}</td>
                <td>${formatDate(fare.date_paid)}</td>
                <td>${fare.transaction_reference || 'N/A'}</td>
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
      dialogTitle: 'Save Fares Database PDF'
    });

    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Helper function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export { generateFaresPDF };