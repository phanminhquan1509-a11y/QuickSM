var UserData = {};
var USERS_KEY = "quickSM_users";
var CURRENT_USER_KEY = "currentUser";

function getAllUsers() {
    var data = localStorage.getItem(USERS_KEY);
    if (!data) {
        return [];
    }
    return JSON.parse(data);
}

function findUser(email) {
    var users = getAllUsers();
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            return users[i];
        }
    }
    return null;
}

UserData.updateNavbar = function() {
    var userJSON = localStorage.getItem(CURRENT_USER_KEY);
    var authSection = document.getElementById("authSection");
    if (!authSection) {
        return;
    }
    if (userJSON) {
        var user = JSON.parse(userJSON);
        if (!user.name && user.fullName) {
            user.name = user.fullName;
        }
        authSection.innerHTML = '<div class="dropdown">' +
            '<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">' +
            '<i class="fa-solid fa-circle-user me-1"></i> ' + (user.name || user.email) + '</button>' +
            '<ul class="dropdown-menu dropdown-menu-end">' +
            '<li><a class="dropdown-item" href="account.html"><i class="fa-solid fa-user me-2"></i>Account</a></li>' +
            '<li><a class="dropdown-item" href="settings.html"><i class="fa-solid fa-gear me-2"></i>Settings</a></li>' +
            '<li><hr class="dropdown-divider"></li>' +
            '<li><a class="dropdown-item text-danger" href="#" id="logoutBtn"><i class="fa-solid fa-right-from-bracket me-2"></i>Log out</a></li>' +
            '</ul></div>';
        var logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function(e) {
                e.preventDefault();
                localStorage.removeItem(CURRENT_USER_KEY);
                UserData.updateNavbar();
                window.location.href = "auth.html";
            });
        }
    } else {
        authSection.innerHTML = '<a href="auth.html" class="btn btn-outline-secondary"><i class="fa-solid fa-right-to-bracket me-1"></i> Sign In</a>' +
            '<a href="auth-register.html" class="btn btn-primary"><i class="fa-solid fa-user-plus me-1"></i> Register</a>';
    }
};

UserData.doLogin = function(email, password) {
    var user = findUser(email);
    if (!user || user.password !== password) {
        alert("Invalid email or password");
        return;
    }
    if (!user.name && user.fullName) {
        user.name = user.fullName;
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    UserData.updateNavbar();
    window.location.href = "main.html";
};

UserData.doRegister = function(name, email, password) {
    if (findUser(email)) {
        alert("Email already registered");
        return;
    }
    var users = getAllUsers();
    var newUser = {
        id: Date.now().toString(),
        name: name,
        fullName: name,
        email: email,
        password: password
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    UserData.updateNavbar();
    alert("Account created successfully!");
    window.location.href = "main.html";
};

UserData.updateProfile = function(id, name, email, password) {
    var users = getAllUsers();
    var user = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            user = users[i];
            break;
        }
    }
    if (!user) {
        return null;
    }
    user.name = name;
    user.fullName = name;
    user.email = email;
    if (password) {
        user.password = password;
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    if (!user.name && user.fullName) {
        user.name = user.fullName;
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    UserData.updateNavbar();
    return user;
};

UserData.getCurrentUser = function() {
    var data = localStorage.getItem(CURRENT_USER_KEY);
    if (!data) {
        return null;
    }
    var user = JSON.parse(data);
    if (!user.name && user.fullName) {
        user.name = user.fullName;
    }
    return user;
};

UserData.getUsers = function() {
    return getAllUsers();
};

function initAuth() {
    var signinForm = document.getElementById("signin-form");
    if (signinForm) {
        signinForm.addEventListener("submit", function(e) {
            e.preventDefault();
            var email = document.querySelector('input[type="email"]').value;
            var password = document.querySelector('input[type="password"]').value;
            UserData.doLogin(email, password);
        });
    }
    var registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            var name = document.querySelector('input[placeholder="John Doe"]').value;
            var email = document.querySelector('input[type="email"]').value;
            var password = document.querySelector('input[placeholder="Create a password"]').value;
            var confirm = document.querySelector('input[placeholder="Confirm your password"]').value;
            if (password !== confirm) {
                alert("Passwords do not match");
                return;
            }
            UserData.doRegister(name, email, password);
        });
    }
}

window.addEventListener("DOMContentLoaded", function() {
    UserData.updateNavbar();
    initAuth();
});
