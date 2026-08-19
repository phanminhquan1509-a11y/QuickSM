function formatTimestamp(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " at " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function renderNewsDetail() {
    var container = document.getElementById("news-detail-container");
    if (!container) {
        return;
    }
    loadNews().then(function() {
        var params = new URLSearchParams(window.location.search);
        var id = params.get("id");
        var article = null;
        if (window.newsData && window.newsData.length > 0) {
            for (var i = 0; i < window.newsData.length; i++) {
                if (window.newsData[i].id === id) {
                    article = window.newsData[i];
                    break;
                }
            }
        }
        if (!article) {
            container.innerHTML = '<div class="news-detail-error">' +
                '<h2>Article Not Found</h2>' +
                '<p>The news article you are looking for does not exist.</p>' +
                '<a href="news.html" class="btn btn-primary mt-3">Back to News</a>' +
                '</div>';
            return;
        }
        var html = '<div class="news-detail-card">';
        html += '<img src="' + article.image + '" alt="' + article.title + '" class="news-detail-img">';
        html += '<div class="news-detail-body">';
        html += '<div class="news-detail-meta">';
        html += '<span class="badge news-detail-category">' + article.category + '</span>';
        html += '<small class="text-muted"><i class="fa-regular fa-clock me-1"></i>' + formatTimestamp(article.timestamp) + '</small>';
        html += '</div>';
        html += '<h1 class="news-detail-title">' + article.title + '</h1>';
        html += '<p class="news-detail-description">' + article.description + '</p>';
        html += '</div></div>';
        container.innerHTML = html;
    });
}

function init() {
    renderNewsDetail();
}

window.addEventListener("DOMContentLoaded", init);
