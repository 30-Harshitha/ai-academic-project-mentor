/* ==========================================
   app.js
   AI Academic Project Mentor
========================================== */

"use strict";

/* ==========================================
   GLOBAL VARIABLES
========================================== */

// FIXED: Changed endpoint base prefix path string from /api/auth to /api/users
const API_BASE_URL = "https://ai-academic-project-mentor.onrender.com/api/users";

let currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

/* ==========================================
   APPLICATION START
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});

/* ==========================================
   INITIALIZE APPLICATION
========================================== */

function initializeApp() {

    checkLogin();

    loadCurrentUser();

    initializeSidebar();

    initializeLogout();

    setActiveNav();

    initializeTooltips();

    initializeFab();

}

/* ==========================================
   LOGIN CHECK
========================================== */

function checkLogin() {

    const publicPages = [
        "index.html",
        "login.html",
        "register.html"
    ];

    const currentPage =
        window.location.pathname
        .split("/")
        .pop();

    if (
        !currentUser &&
        !publicPages.includes(currentPage) &&
        currentPage !== ""
    ) {
        window.location.href = "login.html";
    }

}

/* ==========================================
   LOAD USER DETAILS
========================================== */

function loadCurrentUser() {

    currentUser = getCurrentUser();

    if (!currentUser) return;

    document
        .querySelectorAll(".currentUser-name")
        .forEach(element => {
            element.textContent = currentUser.fullName || "Student";
        });

    document
        .querySelectorAll(".currentUser-avatar")
        .forEach(img => {
            img.src =
                currentUser.avatarUrl ||
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(
                    currentUser.fullName || "Student"
                ) +
                "&background=0d6efd&color=fff";
        });

}

/* ==========================================
   REGISTER USER
========================================== */

async function registerUser(userData) {

    showLoader("Creating Account...");

    try {

        const response = await fetch(
            `${API_BASE_URL}/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            }
        );

        let data = {};
        try {
            data = await response.json();
        } catch {
            data = {};
        }

        hideLoader();

        if (!response.ok || !data.success) {
            showToast(data.message || "Registration Failed", "error");
            return false;
        }

        showToast(data.message || "Registration Successful", "success");
        return true;

    } catch (error) {
        hideLoader();
        console.error(error);
        showToast("Cannot connect to server", "error");
        return false;
    }

}

/* ==========================================
   LOGIN USER
========================================== */

async function loginUser(email, password) {

    showLoader("Logging In...");

    try {

        const response = await fetch(
            `${API_BASE_URL}/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            }
        );

        let data = {};
        try {
            data = await response.json();
        } catch {
            data = {};
        }

        hideLoader();

        if (!response.ok || !data.success) {
            showToast(data.message || "Invalid Email or Password", "error");
            return false;
        }

        currentUser = data.user;
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        showToast(data.message || "Login Successful", "success");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

        return true;

    } catch (error) {
        hideLoader();
        console.error(error);
        showToast("Cannot connect to server", "error");
        return false;
    }

}

/* ==========================================
   LOGOUT USER
========================================== */

function logoutUser() {
    localStorage.removeItem("currentUser");
    currentUser = null;
    showToast("Logged Out Successfully", "info");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 800);
}

/* ==========================================
   AUTHENTICATION HELPERS
========================================== */

function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
    }
    return user;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function updateCurrentUser(updatedUser) {
    currentUser = updatedUser;
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
}

/* ==========================================
   PART 2: UI COMPONENTS & HELPER FUNCTIONS
========================================== */

function showToast(message, type = "success") {
    const oldToast = document.getElementById("app-toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.id = "app-toast";

    let bgColor = "#198754";
    let icon = "fa-circle-check";

    switch (type) {
        case "error":
            bgColor = "#dc3545";
            icon = "fa-circle-xmark";
            break;
        case "warning":
            bgColor = "#ffc107";
            icon = "fa-triangle-exclamation";
            break;
        case "info":
            bgColor = "#0dcaf0";
            icon = "fa-circle-info";
            break;
    }

    toast.innerHTML = `
        <i class="fas ${icon}" style="margin-right:8px;"></i>
        <span>${message}</span>
    `;

    Object.assign(toast.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        background: bgColor,
        color: "#fff",
        padding: "15px 20px",
        borderRadius: "10px",
        boxShadow: "0 8px 20px rgba(0,0,0,.25)",
        zIndex: "99999",
        display: "flex",
        alignItems: "center",
        opacity: "0",
        transform: "translateX(120%)",
        transition: ".4s"
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(120%)";
        setTimeout(() => { toast.remove(); }, 400);
    }, 3000);
}

function showLoader(text = "Please wait...") {
    if (document.getElementById("app-loader")) return;

    const loader = document.createElement("div");
    loader.id = "app-loader";
    loader.innerHTML = `
        <div class="loader-box">
            <div class="loader-spinner"></div>
            <p>${text}</p>
        </div>
    `;

    document.body.appendChild(loader);

    Object.assign(loader.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        background: "rgba(255,255,255,.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "999999"
    });

    const box = loader.querySelector(".loader-box");
    Object.assign(box.style, {
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,.15)"
    });

    const spinner = loader.querySelector(".loader-spinner");
    Object.assign(spinner.style, {
        width: "50px",
        height: "50px",
        border: "5px solid #ddd",
        borderTop: "5px solid #0d6efd",
        borderRadius: "50%",
        margin: "0 auto 15px",
        animation: "spinLoader 1s linear infinite"
    });

    if (!document.getElementById("loader-style")) {
        const style = document.createElement("style");
        style.id = "loader-style";
        style.innerHTML = `@keyframes spinLoader { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`;
        document.head.appendChild(style);
    }
}

function hideLoader() {
    const loader = document.getElementById("app-loader");
    if (loader) loader.remove();
}

function initializeSidebar() {
    const button = document.querySelector(".sidebar-toggle-btn");
    const sidebar = document.querySelector(".sidebar-custom");
    if (!button || !sidebar) return;
    button.addEventListener("click", () => {
        sidebar.classList.toggle("show-sidebar");
    });
}

function initializeLogout() {
    document.querySelectorAll(".logout-action").forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            if (confirm("Do you want to logout?")) {
                logoutUser();
            }
        });
    });
}

function updateNavbarUser() {
    const user = getCurrentUser();
    if (!user) return;
    document.querySelectorAll(".currentUser-name").forEach(item => {
        item.textContent = user.fullName;
    });
    document.querySelectorAll(".currentUser-avatar").forEach(img => {
        img.src = user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=0d6efd&color=fff`;
    });
}

function setActiveNav() {
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-link").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("nav-link-active");
        } else {
            link.classList.remove("nav-link-active");
        }
    });
}

function initializeTooltips() {
    document.querySelectorAll("[title]").forEach(item => {
        item.addEventListener("mouseenter", function () {
            this.setAttribute("data-original-title", this.title);
        });
    });
}

function initializeFab() {
    const fab = document.querySelector(".fab-custom");
    if (!fab) return;
    fab.addEventListener("mouseenter", () => { fab.style.transform = "scale(1.1)"; });
    fab.addEventListener("mouseleave", () => { fab.style.transform = "scale(1)"; });
}

function scrollTopPage() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================
   PART 3: VALIDATIONS & COMMON UTILITIES
========================================== */

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ""));
}

function isStrongPassword(password) {
    return password.length >= 6;
}

function isEmpty(value) {
    return (value === null || value === undefined || value.toString().trim() === "");
}

function capitalize(text = "") {
    return text.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
}

function generateID(prefix = "ID") {
    return prefix + "-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor() {
    const colors = ["#0d6efd", "#198754", "#dc3545", "#ffc107", "#6610f2", "#20c997", "#fd7e14", "#0dcaf0"];
    return colors[randomNumber(0, colors.length - 1)];
}

function formatDate(date = new Date()) {
    return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getCurrentDateTime() { return new Date().toLocaleString("en-IN"); }
function currentTime() { return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); }

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
}

function saveData(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function getData(key) { return JSON.parse(localStorage.getItem(key)); }
function removeData(key) { localStorage.removeItem(key); }

function copyText(text) {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard", "success");
}

function smoothScroll(selector) {
    const element = document.querySelector(selector);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function debounce(callback, delay = 300) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => { callback.apply(this, args); }, delay);
    };
}

function throttle(callback, limit = 300) {
    let waiting = false;
    return function (...args) {
        if (!waiting) {
            callback.apply(this, args);
            waiting = true;
            setTimeout(() => { waiting = false; }, limit);
        }
    };
}

function isMobile() { return window.innerWidth < 768; }
function generateAvatar(name = "Student") { return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d6efd&color=fff`; }

window.addEventListener("online", () => { showToast("Internet Connected", "success"); });
window.addEventListener("offline", () => { showToast("No Internet Connection", "error"); });