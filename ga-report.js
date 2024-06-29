// Imports the Google Analytics Data API client library.
import {BetaAnalyticsDataClient} from '@google-analytics/data';
import dotenv from 'dotenv';
dotenv.config();

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

/**
 * TODO(developer): Uncomment this variable and replace with your
 *   Google Analytics 4 property ID before running the sample.
 */
const propertyId = '444299948';

// Runs a simple report.
async function runReport() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: '2024-06-01',
        endDate: 'today',
      },
    ],
    dimensions: [
      {
        name: 'unifiedPagePathScreen',
      },
      // {
      //   name: 'defaultChannelGroup',
      // },
    ],
    metrics: [
      {
          "name": "screenPageViews"
      },
      //{
      //    "name": "sessions"
      //},
    ],
  });

  console.log('Report result:');
  response.rows.forEach((row) => {
    console.log(row.dimensionValues[0], row.metricValues[0]);
  });
}

runReport();
