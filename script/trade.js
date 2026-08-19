var watchlist = ["AAPL", "AVGO", "COST"];

function findStock(symbol) {
    if (!window.stockData) {
        return null;
    }
    for (var i = 0; i < window.stockData.length; i++) {
        if (window.stockData[i].symbol === symbol) {
            return window.stockData[i];
        }
    }
    return null;
}

function getStockChangeClass(stock) {
    if (stock.change < 0) {
        return "text-down";
    }
    return "text-up";
}

function getStockChangeSign(stock) {
    if (stock.change < 0) {
        return "";
    }
    return "+";
}

function buildTableRow(stock) {
    var changeClass = getStockChangeClass(stock);
    var sign = getStockChangeSign(stock);
    var html = "<tr>";
    html += '<td class="fw-bold">' + stock.symbol + "</td>";
    html += "<td>" + stock.name + "</td>";
    html += "<td>$" + stock.price + "</td>";
    html += '<td class="' + changeClass + '">' + sign + stock.change + "%</td>";
    html += "<td>" + stock.volume + "</td>";
    html += "<td>" + stock.marketCap + "</td>";
    html += "<td>" + stock.pe + "</td>";
    html += '<td><button class="btn btn-sm btn-outline-danger remove-stock" data-symbol="' + stock.symbol + '"><i class="fa-solid fa-trash"></i></button></td>';
    html += "</tr>";
    return html;
}

function renderWatchlist() {
    var tbody = document.getElementById("stockTableBody");
    if (!tbody) {
        return;
    }
    var html = "";
    for (var i = 0; i < watchlist.length; i++) {
        var stock = findStock(watchlist[i]);
        if (!stock) {
            continue;
        }
        html += buildTableRow(stock);
    }
    tbody.innerHTML = html;
    updateDockOptions();
}

function buildDockOption(symbol) {
    var stock = findStock(symbol);
    var name = stock ? stock.name : symbol;
    return '<option value="' + symbol + '">' + symbol + " - " + name + "</option>";
}

function updateDockOptions() {
    var dock = document.getElementById("dockStock");
    if (!dock) {
        return;
    }
    var html = "";
    for (var i = 0; i < watchlist.length; i++) {
        html += buildDockOption(watchlist[i]);
    }
    dock.innerHTML = html;
    updateDockPrice();
}

function updateDockPrice() {
    var symbol = document.getElementById("dockStock").value;
    var stock = findStock(symbol);
    var qty = parseInt(document.getElementById("dockQty").value) || 0;
    var priceField = document.getElementById("dockPrice");
    var totalField = document.getElementById("dockTotal");
    if (stock) {
        priceField.value = "$" + stock.price;
        totalField.value = "$" + (stock.price * qty);
    } else {
        priceField.value = "$0.00";
        totalField.value = "$0.00";
    }
}

function toggleAddForm() {
    var form = document.getElementById("addStockForm");
    if (form.style.display === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}

function addStockToWatchlist() {
    var input = document.getElementById("stockSearchInput");
    var sym = input.value.trim().toUpperCase();
    var stock = findStock(sym);
    if (!stock) {
        alert("Stock not found");
        return;
    }
    if (watchlist.indexOf(sym) === -1) {
        watchlist.push(sym);
        renderWatchlist();
    }
    input.value = "";
    document.getElementById("addStockForm").style.display = "none";
}

function removeStockFromWatchlist(symbol) {
    var newList = [];
    for (var i = 0; i < watchlist.length; i++) {
        if (watchlist[i] !== symbol) {
            newList.push(watchlist[i]);
        }
    }
    watchlist = newList;
    renderWatchlist();
}

function findUserByEmailAndPassword(email, password) {
    var usersJSON = localStorage.getItem("quickSM_users");
    if (!usersJSON) {
        return null;
    }
    var users = JSON.parse(usersJSON);
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            return users[i];
        }
    }
    return null;
}

function submitOrder() {
    var qty = parseInt(document.getElementById("dockQty").value);
    if (!qty || qty <= 0) {
        alert("Please enter a valid quantity");
        return;
    }
    var password = prompt("Enter your password to confirm the order:");
    if (password === null) {
        return;
    }
    var userJSON = localStorage.getItem("currentUser");
    if (!userJSON) {
        alert("Please sign in first");
        return;
    }
    var user = JSON.parse(userJSON);
    var foundUser = findUserByEmailAndPassword(user.email, password);
    if (foundUser) {
        alert("Success");
        document.getElementById("dockQty").value = "1";
        updateDockPrice();
    } else {
        alert("Incorrect password");
    }
}

function handleTableClick(e) {
    var btn = e.target.closest(".remove-stock");
    if (!btn) {
        return;
    }
    var sym = btn.getAttribute("data-symbol");
    removeStockFromWatchlist(sym);
}

function init() {
    loadStocks().then(function() {
        renderWatchlist();
        updateDockPrice();
    });
    document.getElementById("dockStock").addEventListener("change", updateDockPrice);
    document.getElementById("dockQty").addEventListener("input", updateDockPrice);
    document.getElementById("addStockBtn").addEventListener("click", toggleAddForm);
    document.getElementById("addStockConfirm").addEventListener("click", addStockToWatchlist);
    document.getElementById("stockTableBody").addEventListener("click", handleTableClick);
    document.getElementById("submitOrder").addEventListener("click", submitOrder);
}

window.addEventListener("DOMContentLoaded", init);
