/* ==========================================
   login.js
   AI Academic Project Mentor
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("login-form");

    if (!loginForm) return;

    loginForm.addEventListener("submit", loginStudent);

});

/* ==========================================
   LOGIN FUNCTION
========================================== */

async function loginStudent(e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();
    const rememberMe = document.getElementById("rememberMe").checked;

    clearErrors();

    let valid = true;

    if (email === "") {
        showError("email-error", "Email is required");
        valid = false;
    }

    if (password === "") {
        showError("password-error", "Password is required");
        valid = false;
    }

    if (!valid) return;

    try {

        showLoader("Logging in...");

        const response = await fetch("https://ai-academic-project-mentor.onrender.com/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        hideLoader();

        if (!response.ok) {
            showToast(data.message || "Invalid Email or Password", "error");
            return;
        }

        // Save logged-in user context
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
        } else {
            localStorage.removeItem("rememberMe");
        }

        showToast("Login Successful!", "success");

        // 🟢 Takes them straight to dashboard on explicit response parameters
        if (response.ok && data.success) {
            alert("Welcome back!");
            window.location.href = "/dashboard.html"; 
        } else {
            // Fallback router redundancy if server responds ok but lacks data.success property
            window.location.href = "/dashboard.html";
        }

    } catch (error) {

        hideLoader();
        console.error(error);
        showToast("Unable to connect to server.", "error");

    }

}

/* ==========================================
   ERROR & HELPERS FUNCTIONS
========================================== */

function showError(id, message) {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = message;
    }
}

function clearErrors() {
    document.querySelectorAll(".validation-message").forEach(msg => {
        msg.innerText = "";
    });
}

// Global UI Component Fallbacks to avoid break scripts if not present in app.js
function showLoader(text) {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "flex";
    console.log(`[STUDENT/OS]: ${text}`);
}

function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
}

function showToast(msg, type) {
    console.log(`[STUDENT/OS TOAST - ${type.toUpperCase()}]: ${msg}`);
}