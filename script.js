document.addEventListener('DOMContentLoaded', function() {
  const elements = {
    loadingScreen: document.getElementById('loadingScreen'),
    quoteScreen: document.getElementById('quoteScreen'),
    quoteText: document.getElementById('quoteText'),
    quoteAuthor: document.getElementById('quoteAuthor'),
    refreshBtn: document.getElementById('refreshBtn')
  };

  // Initial state
  elements.loadingScreen.style.display = 'flex';
  elements.quoteScreen.style.display = 'none';

  // Quote APIs configuration
  const quoteAPIs = [
    {
      url: "https://zenquotes.io/api/random",
      parser: data => ({ text: data[0].q, author: data[0].a })
    },
    {
      url: "https://api.quotable.io/random",
      parser: data => ({ text: data.content, author: data.author })
    }
  ];

  // Offline fallback quotes
  const fallbackQuotes = [
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Sometimes later becomes never. Do it now.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Hard work beats talent when talent doesn’t work hard.", author: "Tim Notke" }
];


  // Event listeners
  elements.refreshBtn.addEventListener('click', fetchQuoteWithLoading);

  // Initial fetch
  fetchQuoteWithLoading();

  async function fetchQuoteWithLoading() {
    elements.loadingScreen.style.display = 'flex';
    elements.quoteScreen.style.display = 'none';
    
    await Promise.all([
      fetchQuote(),
      new Promise(resolve => setTimeout(resolve, 1500)) // Minimum loading time
    ]);
    
    elements.loadingScreen.style.display = 'none';
    elements.quoteScreen.style.display = 'flex';
  }

  async function fetchQuote() {
    try {
      // Try all APIs in random order
      const shuffledAPIs = [...quoteAPIs].sort(() => Math.random() - 0.5);
      
      for (const api of shuffledAPIs) {
        try {
          const response = await fetch(api.url);
          if (response.ok) {
            const data = await response.json();
            const quote = api.parser(data);
            displayQuote(quote);
            return;
          }
        } catch (error) {
          console.warn(`API ${api.url} failed:`, error);
        }
      }
      
      // Fallback to offline quotes
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      displayQuote(randomQuote);
      
    } catch (error) {
      console.error("Quote fetch error:", error);
      elements.quoteText.textContent = "Stay motivated! Error loading quote.";
      elements.quoteAuthor.textContent = "";
    }
  }

  function displayQuote(quote) {
    elements.quoteText.textContent = `"${quote.text}"`;
    elements.quoteAuthor.textContent = `— ${quote.author || "Unknown"}`;
  }
});