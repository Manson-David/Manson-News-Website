const API_KEY = 'pub_cdd02904a12844d5bd43fb412539307c';

let currentCategory = '';
let allArticles = [];

async function loadNews(category = '') {
    const mainNews = document.getElementById('mainNews');
    const sidebar = document.getElementById('sidebar');
    const featured = document.getElementById('featuredSection');

    mainNews.innerHTML = '<div class="loading">Loading news <i class="fa-solid fa-spinner fa-spin-pulse fa-xl"></i></div>';
    sidebar.innerHTML = '';
    featured.innerHTML = '';

    try {
        let url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en`;
        if (category) {
            url += `&category=${category}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'success' && data.results) {
            allArticles = data.results;
            displayFeaturedNews(data.results.slice(0, 3));
            displayMainNews(data.results.slice(3, 8));
            displaySidebar(data.results.slice(8, 13));
        } else {
            mainNews.innerHTML = '<div class="error">Failed to load news. Please check your API key.</div>';
        }
    } catch (error) {
        mainNews.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
    }
}

// FEATURED
function displayFeaturedNews(articles) {
    const featured = document.getElementById('featuredSection');
    if (articles.length === 0) return;

    const mainArticle = articles[0];
    const sideArticles = articles.slice(1, 3);

    featured.innerHTML = `
        <div class="featured-main" onclick="openArticle('${mainArticle.link || '#'}')">
            <img src="${mainArticle.image_url || 'https://via.placeholder.com/800x400'}">
            <div class="featured-overlay">
                <span class="category-badge">${mainArticle.category?.[0] || 'News'}</span>
                <div class="featured-title">${mainArticle.title}</div>
            </div>
        </div>

        <div class="featured-side">
            ${sideArticles.map(article => `
                <div class="featured-card" onclick="openArticle('${article.link}')">
                    <img src="${article.image_url || 'https://via.placeholder.com/400x200'}">
                    <div class="featured-overlay">
                        <span class="category-badge">${article.category?.[0] || 'News'}</span>
                        <div class="featured-title" style="font-size: 16px;">
                            ${article.title.substring(0, 80)}...
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// MAIN NEWS
function displayMainNews(articles) {
    const mainNews = document.getElementById('mainNews');
    mainNews.innerHTML = articles.map(article => `
        <div class="news-card" onclick="openArticle('${article.link}')">
            <img src="${article.image_url || 'https://via.placeholder.com/200x150'}" class="news-image">

            <div class="news-content">
                <div class="news-meta">
                    <span class="category-badge">${article.category?.[0] || 'News'}</span>
                    ${article.pubDate ? new Date(article.pubDate).toLocaleDateString() : ''}
                </div>
                <h3>${article.title}</h3>
                <p class="news-description">${article.description?.substring(0, 150) || ''}...</p>
            </div>
        </div>
    `).join('');
}

// SIDEBAR
function displaySidebar(articles) {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = articles.map(article => `
        <div class="sidebar-card" onclick="openArticle('${article.link}')">
            <img src="${article.image_url || 'https://via.placeholder.com/80'}" class="sidebar-image">
            <div class="sidebar-content">
                <h4>${article.title.substring(0, 80)}...</h4>
                <div class="news-meta">
                    ${article.pubDate ? new Date(article.pubDate).toLocaleDateString() : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Open Article
function openArticle(url) {
    if (url && url !== '#') {
        window.location.href = url;
    }
}

// Navigation
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
        
        // Add active class to clicked link
        e.target.classList.add('active');
        
        const category = e.target.dataset.category;
        currentCategory = category;
        loadNews(category);
    });
});

// TABS
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
    });
});


// Update date automatically
    function updateDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString('en-US', options);
        document.getElementById('currentDate').textContent = ` ${today}`;
    }
    updateDate();

// Start website
window.addEventListener("load", () => loadNews());
