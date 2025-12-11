// Node.js test file — using built-in fetch (Node 18+)

const API_KEY = 'pub_cdd02904a12844d5bd43fb412539307c';

async function testNews(category = "") {
    try {
        let url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en`;
        if (category) url += `&category=${category}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log("=== TEST NEWS FETCH ===");
        console.log("Status:", data.status);
        console.log("Total Articles Loaded:", data.results?.length || 0);

        console.log("\nSample Article:");
        console.log(data.results?.[0]);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

testNews(); 
