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

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!emailPattern.test(username.value)) {
        usernameError.textContent = 'Please enter a valid email address.';
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