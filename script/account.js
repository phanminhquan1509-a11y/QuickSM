var user = UserData.getCurrentUser();
var editName = document.getElementById("editName");
var editEmail = document.getElementById("editEmail");
var editPassword = document.getElementById("editPassword");
var profileName = document.getElementById("profileName");
var profileEmail = document.getElementById("profileEmail");
var displayName = user.name || user.fullName || "User";

if (user) {
    editName.value = displayName;
    editEmail.value = user.email || "";
    profileName.textContent = displayName;
    profileEmail.textContent = user.email || "";
}

document.getElementById("discardBtn").addEventListener("click", function() {
    if (user) {
        editName.value = displayName;
        editEmail.value = user.email || "";
        editPassword.value = "";
    }
});

document.getElementById("account-form").addEventListener("submit", function(e) {
    e.preventDefault();
    var fullName = editName.value.trim();
    var email = editEmail.value.trim();
    var password = editPassword.value;
    if (!fullName || !email) {
        alert("Please fill in all fields");
        return;
    }
    UserData.updateProfile(user.id, fullName, email, password).then(function(updatedUser) {
        if (updatedUser) {
            profileName.textContent = fullName;
            profileEmail.textContent = email;
            editPassword.value = "";
            alert("Changes saved successfully");
            user = updatedUser;
            displayName = user.name || user.fullName || "User";
        } else {
            alert("Update failed");
        }
    });
});
