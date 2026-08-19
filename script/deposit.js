var depositBtn = document.getElementById("depositBtn");
var withdrawBtn = document.getElementById("withdrawBtn");
var actionBtn = document.getElementById("actionBtn");
var form = document.getElementById("deposit-form");

function setMode(mode) {
    if (mode === "deposit") {
        depositBtn.classList.add("active");
        withdrawBtn.classList.remove("active");
        actionBtn.textContent = "Deposit Funds";
        actionBtn.classList.remove("btn-outline-secondary");
        actionBtn.classList.add("btn-primary");
    } else {
        withdrawBtn.classList.add("active");
        depositBtn.classList.remove("active");
        actionBtn.textContent = "Withdraw Funds";
        actionBtn.classList.remove("btn-primary");
        actionBtn.classList.add("btn-outline-secondary");
    }
}

function init() {
    depositBtn.addEventListener("click", function() {
        setMode("deposit");
    });
    withdrawBtn.addEventListener("click", function() {
        setMode("withdraw");
    });
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        var mode = "Deposit";
        if (withdrawBtn.classList.contains("active")) {
            mode = "Withdraw";
        }
        alert(mode + " successful!");
        form.reset();
    });
}

window.addEventListener("DOMContentLoaded", init);
