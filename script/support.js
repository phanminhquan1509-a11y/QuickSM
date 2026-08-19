document.getElementById("support-form").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Ticket Sent");
    this.reset();
});
