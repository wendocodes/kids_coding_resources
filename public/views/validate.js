"use strict";

/**
 * Validates the login form
 * @param {Event} event - The form submission event
 */
function validateForm(event) {
    const username = document.querySelector('input[name="username"]');
    const password = document.querySelector('input[name="password"]');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');

    usernameError.textContent = '';
    passwordError.textContent = '';

    let isValid = true;

    if (username.value.trim() === "") {
        usernameError.textContent = 'Username is required.';
        isValid = false;
    }

    if (password.value.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters long.';
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    }

    return isValid;
}

// Clear session on browser unload
window.addEventListener("beforeunload", (event) => {
    fetch("/api/logout", { method: "POST" }).catch((err) => {
        console.error("Session cleanup failed:", err);
    });
});
