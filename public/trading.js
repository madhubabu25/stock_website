const apiKey = 'JZFskDck2YrzNZVRzwVOVDjKfF__zse5'; // Replace with your API key
const baseUrl = 'https://www.alphavantage.co/query';
let lastFetchedTime = null;
let cachedData = null;

const stockSymbols = [
    'INFY.NS', 'TCS.NS', 'RELIANCE.NS', 'HDFCBANK.NS', "AAPL", "GOOGL", "AMZN", 
    "TSLA", "MSFT", "NFLX", "FB", "NVDA", "SPY", "TSM", "BA", "V", "MSFT", "IBM",
    'GOOG', 'MSI', 'CSCO', 'TSM', 'BABA', 'NVDA', 'INTC', 'SAP', 'ADBE', 'META'
]; // Add stock symbols here

// Function to fetch stock data for multiple companies
async function fetchStockData() {
    const currentTime = new Date().getTime();

    if (cachedData && lastFetchedTime && (currentTime - lastFetchedTime) < 30 * 60 * 1000) {
        // Use cached data if it's still valid
        console.log('Using cached data');
        displayStockData(cachedData);
        return;
    }

    // Show loading message
    document.getElementById('stock-info').innerHTML = '<p>Loading data...</p>';

    const stockDataPromises = stockSymbols.map(symbol => fetchStockInfo(symbol));
    
    try {
        const stockData = await Promise.all(stockDataPromises);
        const mostProfitable = stockData.reduce((max, stock) => stock.change > max.change ? stock : max, stockData[0]);
        const leastLoss = stockData.reduce((min, stock) => stock.change < min.change ? stock : min, stockData[0]);
        
        // Store cached data and update last fetch time
        cachedData = { mostProfitable, leastLoss };
        lastFetchedTime = currentTime;

        displayStockData(cachedData);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        
        // If rate limit exceeded, show the last updated info
        const lastUpdatedInfo = cachedData ? `
            <p><strong>Last Updated:</strong> ${cachedData.mostProfitable.time}</p>
            <p>Data may be outdated due to API rate limit exceedance.</p>
        ` : '<p>Error fetching stock data. Please try again later.</p>';
        
        document.getElementById('stock-info').innerHTML = lastUpdatedInfo;
    }
}

// Fetch stock info for a given symbol
async function fetchStockInfo(symbol) {
    const response = await fetch(`${baseUrl}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=15min&apikey=${apiKey}`);
    const data = await response.json();
    
    if (data['Time Series (15min)']) {
        const stockInfo = data['Time Series (15min)'];
        const latestTime = Object.keys(stockInfo)[0];
        const latestData = stockInfo[latestTime];

        const previousCloseValue = 470; // Example value, should be dynamic or a previous day's close
        const change = ((parseFloat(latestData['4. close']) - previousCloseValue) / previousCloseValue) * 100;

        return {
            name: symbol,
            value: latestData['4. close'],
            time: latestTime,
            change: change
        };
    } else {
        throw new Error(`Error fetching data for ${symbol}: ${data['Note'] || 'No data available'}`);
    }
}

// Function to display the most profitable and least loss companies
function displayStockData(data) {
    const mostProfitable = data.mostProfitable;
    const leastLoss = data.leastLoss;

    const stockDetails = `
        <p><strong>Most Profitable Company:</strong> ${mostProfitable.name}</p>
        <p><strong>Value:</strong> ₹${mostProfitable.value}</p>
        <p><strong>Change:</strong> ${mostProfitable.change.toFixed(2)}%</p>
        <p><strong>Last Updated:</strong> ${mostProfitable.time}</p>

        <p><strong>Least Loss Company:</strong> ${leastLoss.name}</p>
        <p><strong>Value:</strong> ₹${leastLoss.value}</p>
        <p><strong>Change:</strong> ${leastLoss.change.toFixed(2)}%</p>
        <p><strong>Last Updated:</strong> ${leastLoss.time}</p>
    `;

    document.getElementById('stock-info').innerHTML = stockDetails;
}

// Call fetchStockData initially and then set an interval to update every 30 minutes
fetchStockData(); // First call
setInterval(fetchStockData, 30 * 60 * 1000);  // Update every 30 minutes
