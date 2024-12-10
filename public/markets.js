document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "fe454288b95645258b6453b9e3adee55"; // Replace with your News API key
  
    const apiUrls = {
      news: `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`,
      highlights: `https://newsapi.org/v2/everything?q=stock&apiKey=${apiKey}`,
    };
  
    /**
     * Adds a timestamp to prevent caching issues by NewsAPI or browser cache
     * @param {string} url - API URL
     * @returns {string} - URL with timestamp to bust cache
     */
    function addTimestamp(url) {
      const timestamp = new Date().getTime();
      return `${url}&_=${timestamp}`;
    }
  
    /**
     * Fetch Market History dynamically over the past 7 days
     */
    async function fetchMarketHistory() {
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
  
      const dynamicHistoryUrl = `https://newsapi.org/v2/everything?q=market&from=${sevenDaysAgo.toISOString()}&to=${today.toISOString()}&apiKey=${apiKey}`;
      
      try {
        console.log("History URL: ", dynamicHistoryUrl);
        const response = await fetch(addTimestamp(dynamicHistoryUrl));
        const data = await response.json();
        console.log("Market History Response: ", data);
  
        if (data.status === "ok" && data.articles && data.articles.length) {
          const content = data.articles
            .slice(0, 5)
            .map(
              (article) => `
            <div class="article-item">
              <a href="${article.url}" target="_blank">
                <h4>${article.title}</h4>
                <p>${article.description || "No description available."}</p>
              </a>
            </div>`
            )
            .join("");
  
          document.getElementById("history-content").innerHTML = content;
        } else {
          document.getElementById("history-content").innerHTML = "<p>No market history data found.</p>";
        }
      } catch (error) {
        console.error("Error fetching market history: ", error.message);
        document.getElementById("history-content").innerHTML = "<p>Error loading history data.</p>";
      }
    }
  
    /**
     * Fetch Market News
     */
    async function fetchLatestMarketNews() {
      const dynamicMarketUrl = `https://newsapi.org/v2/top-headlines?q=market&apiKey=${apiKey}`;
      try {
        console.log("Market News URL: ", dynamicMarketUrl);
        const response = await fetch(addTimestamp(dynamicMarketUrl));
        const data = await response.json();
        console.log("Market News Response: ", data);
  
        if (data.status === "ok" && data.articles && data.articles.length) {
          const content = data.articles
            .slice(0, 5)
            .map(
              (article) => `
            <div class="article-item">
              <a href="${article.url}" target="_blank">
                <h4>${article.title}</h4>
                <p>${article.description || "No description available."}</p>
              </a>
            </div>`
            )
            .join("");
  
          document.getElementById("market-news-content").innerHTML = content;
        } else {
          document.getElementById("market-news-content").innerHTML = "<p>No news articles found.</p>";
        }
      } catch (error) {
        console.error("Error fetching market news: ", error.message);
        document.getElementById("market-news-content").innerHTML = "<p>Error loading market news data.</p>";
      }
    }
  
    /**
     * Fetch Highlights
     */
    async function fetchHighlights() {
      const dynamicHighlightsUrl = `https://newsapi.org/v2/everything?q=stock&apiKey=${apiKey}`;
      try {
        console.log("Highlights URL: ", dynamicHighlightsUrl);
        const response = await fetch(addTimestamp(dynamicHighlightsUrl));
        const data = await response.json();
        console.log("Highlights Response: ", data);
  
        if (data.status === "ok" && data.articles && data.articles.length) {
          const content = data.articles
            .slice(0, 5)
            .map(
              (article) => `
            <div class="article-item">
              <a href="${article.url}" target="_blank">
                <h4>${article.title}</h4>
                <p>${article.description || "No description available."}</p>
              </a>
            </div>`
            )
            .join("");
  
          document.getElementById("highlights-content").innerHTML = content;
        } else {
          document.getElementById("highlights-content").innerHTML = "<p>No highlights data found.</p>";
        }
      } catch (error) {
        console.error("Error fetching highlights: ", error.message);
        document.getElementById("highlights-content").innerHTML = "<p>Error loading highlights data.</p>";
      }
    }
  
    /**
     * Handles periodic updates for all sections
     */
    function init() {
      fetchMarketHistory();
      fetchLatestMarketNews();
      fetchHighlights();
  
      // Periodic intervals
      setInterval(fetchMarketHistory, 60000); // Refresh every 60 seconds
      setInterval(fetchLatestMarketNews, 60000);
      setInterval(fetchHighlights, 60000);
    }
  
    init();
  });
  