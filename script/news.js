function formatTimestamp(ts) {
    var d = new Date(ts);
    var month = d.toLocaleDateString("en-US", { month: "short" });
    var day = d.toLocaleDateString("en-US", { day: "numeric" });
    var hour = d.toLocaleTimeString("en-US", { hour: "numeric" });
    var minute = d.toLocaleTimeString("en-US", { minute: "2-digit" });
    var datePart = month + " " + day;
    var timePart = hour + ":" + minute;
    return datePart + ", " + timePart;
}

function sortNewsByDate(news) {
    var sorted = news.slice();
    for (var i = 0; i < sorted.length; i++) {
        for (var j = i + 1; j < sorted.length; j++) {
            var dateA = new Date(sorted[i].timestamp);
            var dateB = new Date(sorted[j].timestamp);
            if (dateB > dateA) {
                var temp = sorted[i];
                sorted[i] = sorted[j];
                sorted[j] = temp;
            }
        }
    }
    return sorted;
}

function getDateKey(timestamp) {
    var d = new Date(timestamp);
    var month = d.toLocaleDateString("en-US", { month: "long" });
    var day = d.toLocaleDateString("en-US", { day: "numeric" });
    var year = d.toLocaleDateString("en-US", { year: "numeric" });
    return month + " " + day + ", " + year;
}

function groupNewsByDate(news) {
    var grouped = {};
    for (var i = 0; i < news.length; i++) {
        var item = news[i];
        var key = getDateKey(item.timestamp);
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(item);
    }
    return grouped;
}

function buildNewsItemHTML(item) {
    var html = "";
    html += '<a href="newsx.html?id=' + item.id + '" class="news-card-link">';
    html += '<div class="feature-card news-card-vertical">';
    html += '<img src="' + item.image + '" alt="' + item.title + '" class="news-card-img">';
    html += '<div class="news-card-body">';
    html += '<small class="text-muted"><i class="fa-regular fa-clock me-1"></i>' + formatTimestamp(item.timestamp) + '</small>';
    html += '<h3 class="mt-2">' + item.title + '</h3>';
    html += '<span class="badge news-badge">' + item.category + '</span>';
    html += '</div></div></a>';
    return html;
}

function buildDateGroupHTML(date, items) {
    var html = "";
    html += '<div class="news-date-group">';
    html += '<h3 class="news-date-header">' + date + '</h3>';
    html += '<div class="news-items">';
    for (var i = 0; i < items.length; i++) {
        html += buildNewsItemHTML(items[i]);
    }
    html += '</div></div>';
    return html;
}

function renderNewsPage() {
    var container = document.getElementById("news-container");
    if (!container) {
        return;
    }
    loadNews().then(function() {
        if (!window.newsData || window.newsData.length === 0) {
            return;
        }
        var sorted = sortNewsByDate(window.newsData);
        var grouped = groupNewsByDate(sorted);
        var html = "";
        for (var date in grouped) {
            html += buildDateGroupHTML(date, grouped[date]);
        }
        container.innerHTML = html;
    });
}

function init() {
    renderNewsPage();
}

window.addEventListener("DOMContentLoaded", init);
