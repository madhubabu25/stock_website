document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "JZFskDck2YrzNZVRzwVOVDjKfF__zse5";
    const symbols = ["AAPL", "GOOGL", "AMZN", "TSLA", "MSFT", "NFLX", "NVDA", "SPY", "TSM", "BA", "V", "MSFT", "IBM"];
    let previousStockData = []; // Cache for fallback

    // Function to fetch stock data from the API
    async function fetchStockData(symbol) {
        const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Check if API returns valid data
            if (data["Global Quote"]) {
                return {
                    symbol: data["Global Quote"]["01. symbol"],
                    price: data["Global Quote"]["05. price"],
                    change: data["Global Quote"]["09. change"],
                    changePercent: data["Global Quote"]["10. change percent"],
                };
            } else {
                throw new Error("No data returned");
            }
        } catch (error) {
            console.error("Error fetching stock data:", error);
            return null; // Return null if there is an error
        }
    }

    // Function to display stock data on the page
    async function displayStockData() {
        const tableBody = document.querySelector("#stock-table tbody");
        tableBody.innerHTML = ""; // Clear old content

        let allStockDataAvailable = true; // Flag to track if data is available for all stocks

        for (const symbol of symbols) {
            let stockData = await fetchStockData(symbol);

            if (stockData) {
                // Cache the successfully fetched data
                previousStockData = previousStockData.filter((data) => data.symbol !== symbol);
                previousStockData.push(stockData);
            } else {
                // If fetching fails, use cached data if available
                stockData = previousStockData.find((data) => data.symbol === symbol);
            }

            // If no stock data exists, show "loading..." only if no cached data is available
            if (!stockData) {
                if (previousStockData.length === 0) {
                    tableBody.innerHTML += `<tr><td colspan="4">Loading...</td></tr>`;
                } else {
                    // Use the last available data if no new data is fetched
                    stockData = previousStockData.find((data) => data.symbol === symbol);
                }
                allStockDataAvailable = false;
                continue;
            }

            const changeClass = parseFloat(stockData.change) >= 0 ? "positive" : "negative";
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${stockData.symbol}</td>
                <td>₹${stockData.price}</td>
                <td class="${changeClass}">₹${stockData.change}</td>
                <td class="${changeClass}">${stockData.changePercent}</td>
            `;
            tableBody.appendChild(row);
        }

        // Retry after a delay if some stock data was missing
        if (!allStockDataAvailable) {
            setTimeout(displayStockData, 5000); // Retry after 5 seconds
        }
    }

    displayStockData(); // Load data initially
    setInterval(displayStockData, 120000); // Refresh data every 120 seconds
});
