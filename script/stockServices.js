var apiURL = "https://6a8163c6400f94b23c6f5be5.mockapi.io/api/quicksm/";
window.stockData = [];
var stockLoadPromise = null;

function fetchStockData() {
    var url = apiURL + "stock";
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

function saveStockData(data) {
    window.stockData = data;
    return data;
}

function loadStocks() {
    if (stockLoadPromise) {
        return stockLoadPromise;
    }
    stockLoadPromise = fetchStockData().then(function(data) {
        return saveStockData(data);
    });
    return stockLoadPromise;
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

function getRandomStocks(count) {
    var shuffled = shuffleArray(window.stockData);
    var result = [];
    for (var i = 0; i < count && i < shuffled.length; i++) {
        result.push(shuffled[i]);
    }
    return result;
}

function getChangeClass(changeValue) {
    if (changeValue < 0) {
        return "text-down";
    }
    return "text-up";
}

function getChangeSign(changeValue) {
    if (changeValue < 0) {
        return "";
    }
    return "+";
}

function buildStockItemHTML(stock) {
    var changeClass = getChangeClass(stock.change);
    var sign = getChangeSign(stock.change);
    var html = '<div class="col-md-2 col-6 market-item">';
    html += '<div class="market-name">' + stock.symbol + '</div>';
    html += '<div class="market-price">$' + stock.price + '</div>';
    html += '<div class="market-change ' + changeClass + '">' + sign + stock.change + '%</div>';
    html += '</div>';
    return html;
}

function buildStocksHTML(stocks) {
    var html = "";
    for (var i = 0; i < stocks.length; i++) {
        html += buildStockItemHTML(stocks[i]);
    }
    return html;
}

function renderStocks(containerId, count) {
    var container = document.getElementById(containerId);
    if (!container) {
        return;
    }
    loadStocks().then(function() {
        if (!window.stockData || window.stockData.length === 0) {
            return;
        }
        var stocks = getRandomStocks(count || 6);
        var html = buildStocksHTML(stocks);
        container.innerHTML = html;
    });
}
