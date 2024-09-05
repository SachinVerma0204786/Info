const express = require('express');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON data from requests
app.use(express.json());

// Create a CSV writer
const csvWriter = createCsvWriter({
    path: 'device_data.csv',  // CSV file path
    header: [
        {id: 'userAgent', title: 'User Agent'},
        {id: 'platform', title: 'Platform'},
        {id: 'language', title: 'Language'},
        {id: 'screenResolution', title: 'Screen Resolution'},
        {id: 'batteryLevel', title: 'Battery Level'},
        {id: 'ipAddress', title: 'IP Address'},
        {id: 'connectionType', title: 'Connection Type'},
        {id: 'downlink', title: 'Downlink Speed (Mbps)'},
        {id: 'rtt', title: 'RTT (ms)'},
        {id: 'browserName', title: 'Browser Name'}
    ],
    append: true  // Append data to the CSV file if it exists
});

// POST endpoint to collect data from the frontend
app.post('/collect', (req, res) => {
    const deviceInfo = req.body;
    console.log('Collected Data:', deviceInfo);

    // Format data to match CSV headers
    const dataToWrite = [{
        userAgent: deviceInfo.userAgent,
        platform: deviceInfo.platform,
        language: deviceInfo.language,
        screenResolution: deviceInfo.screenResolution,
        batteryLevel: deviceInfo.batteryLevel,
        ipAddress: deviceInfo.ipAddress,
        connectionType: deviceInfo.connection?.type || 'Unavailable',
        downlink: deviceInfo.connection?.downlink || 'Unavailable',
        rtt: deviceInfo.connection?.rtt || 'Unavailable',
        browserName: deviceInfo.browserName
    }];

    // Write the data to the CSV file
    csvWriter.writeRecords(dataToWrite)
    .then(() => {
        console.log('Data saved to CSV file');
        res.send('Data received and saved to CSV');
    })
    .catch((error) => {
        console.error('Error writing to CSV file:', error);
        res.status(500).send('Error saving data');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
