// matatu-link-mobile/src/services/pdfGenerators/UserActivityPdfGenerator.js

import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import api from '../../api/config';
import * as Sharing from 'expo-sharing';

export class UserActivityPdfGenerator {
    constructor () {
        this.margin = 50;
    }

    calculateActivityStats (activities) {
        return {
            totalUsers: activities.totalUsers || 0,
            activeUsers: activities.activeUsers || 0,
            newRegistrations: activities.newRegistrations || 0,
            totalContributions: activities.totalContributions || 0,
            totalReports: activities.totalReports || 0,
            avgDailyActivity: activities.avgDailyActivity || 0,
        };
    }

    formatLabel (key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    async generateActivityReport () {
        try {
            // Get activities data directly from API
            const response = await api.get('/users/activities/stats');
            const activities = response.data;
            const stats = this.calculateActivityStats(activities);

            // Create HTML content
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                    <style>
                        body { 
                            font-family: -apple-system, system-ui;
                            padding: 40px 20px;
                            color: #333;
                        }
                        h1 { 
                            color: #007AFF;
                            font-size: 24px;
                        }
                        .date {
                            color: #666;
                            margin-bottom: 30px;
                        }
                        .stat-item {
                            margin: 15px 0;
                            padding: 10px;
                            background: #f5f5f5;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <h1>User Activity Report</h1>
                    <div class="date">Generated on: ${ new Date().toLocaleDateString() }</div>
                    ${ Object.entries(stats)
                    .map(([key, value]) => `
                            <div class="stat-item">
                                <strong>${ this.formatLabel(key) }:</strong> ${ value }
                            </div>
                        `)
                    .join('') }
                </body>
                </html>
            `;

            // Generate PDF file
            const {uri} = await Print.printToFileAsync({
                html: htmlContent,
                base64: false
            });

            // Move to permanent storage
            const timestamp = new Date().getTime();
            const destinationPath = `${ FileSystem.documentDirectory }report_${ timestamp }.pdf`;

            await FileSystem.moveAsync({
                from: uri,
                to: destinationPath
            });

            return destinationPath;

        } catch (error) {
            console.error('PDF Generation error:', error);
            throw new Error(`Failed to generate PDF: ${ error.message }`);
        }
    }
}