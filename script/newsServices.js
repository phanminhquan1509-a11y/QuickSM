var apiURL = "https://6a8163c6400f94b23c6f5be5.mockapi.io/api/quicksm/";
window.newsData = [];
var newsLoadPromise = null;

function fetchNewsData() {
    var url = apiURL + "news";
    return fetch(url).then(function(res) {
        return res.text().then(function(text) {
            if (text.indexOf("Invalid request") !== -1) {
                throw new Error("MockAPI rejected the request.");
            }
            var data = JSON.parse(text);
            return data;
        });
    });
}

function saveNewsData(data) {
    window.newsData = data;
    return data;
}

function loadNews() {
    if (newsLoadPromise) {
        return newsLoadPromise;
    }
    newsLoadPromise = fetchNewsData().then(function(data) {
        return saveNewsData(data);
    });
    return newsLoadPromise;
}

function shuffleArray(arr) {
    var result = arr.slice();
    for (var i = 0; i < result.length; i++) {
        for (var j = i + 1; j < result.length; j++) {
            if (Math.random() - 0.5 > 0) {
                var temp = result[i];
                result[i] = result[j];
                result[j] = temp;
            }
        }
    }
    return result;
}

function getRandomNews(count) {
    var shuffled = shuffleArray(window.newsData);
    var result = [];
    for (var i = 0; i < count && i < shuffled.length; i++) {
        result.push(shuffled[i]);
    }
    return result;
}

function buildNewsItemHTML(news) {
    var html = '<div class="feature-card">';
    html += '<small class="text-muted"><i class="fa-regular fa-clock me-1"></i>' + news.timestamp + '</small>';
    html += '<h3 class="mt-2">' + news.title + '</h3>';
    html += '<p>' + news.description + '</p>';
    html += '<a href="#" class="text-decoration-none">Read more &rarr;</a>';
    html += '</div>';
    return html;
}

function buildNewsHTML(newsList) {
    var html = "";
    for (var i = 0; i < newsList.length; i++) {
        html += buildNewsItemHTML(newsList[i]);
    }
    return html;
}

function renderNews(containerId, count) {
    var container = document.getElementById(containerId);
    if (!container) {
        return;
    }
    loadNews().then(function() {
        if (!window.newsData || window.newsData.length === 0) {
            return;
        }
        var news = getRandomNews(count || 6);
        var html = buildNewsHTML(news);
        container.innerHTML = html;
    });
}
