// Replace this variable value completely with your deployed Google Web App Link URL
const API_URL = "https://script.google.com/macros/s/AKfycbz78NXIyGlq1hDco9aOJxtSARICnLQx87tow4SDpO4unAf6vVwN9cOD5n9NA_dZ-e4a/exec"; 

let isLoginMode = true;

const authForm = document.getElementById("auth-form");
const toggleLink = document.getElementById("toggle-link");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const submitBtn = document.getElementById("submit-btn");

const nameGroup = document.getElementById("name-group");
const roleGroup = document.getElementById("role-group");

// Handle authentication toggle shifts (Login vs Register)
toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        authTitle.innerText = "Student Login";
        authSubtitle.innerText = "Enter your credentials to access your academic records.";
        submitBtn.innerText = "Sign In";
        toggleLink.innerText = "Don't have an account? Register here";
        nameGroup.style.display = "none";
        roleGroup.style.display = "none";
    } else {
        authTitle.innerText = "Create Account";
        authSubtitle.innerText = "Register to create your personal secure access portal.";
        submitBtn.innerText = "Sign Up";
        toggleLink.innerText = "Already have an account? Login here";
        nameGroup.style.display = "block";
        roleGroup.style.display = "block";
    }
});

// Intercept form submissions to redirect requests over secure API
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("reg-name").value;
    const role = document.getElementById("role").value;

    const payload = isLoginMode 
        ? { action: "login", email, password }
        : { action: "register", email, password, name, role };

    submitBtn.innerText = "Processing Transaction...";
    submitBtn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            mode: "no-cors", // Required to execute cross-domain apps script instances smoothly
            body: JSON.stringify(payload)
        });

        // Due to standard no-cors mode restrictions, fetch calls will skip structural return data mapping directly.
        // For a seamless application wrapper, we request the validation sequence below:
        const validationPayload = { action: "login", email, password };
        const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(validationPayload) });
        const result = await res.json();

        if (result.success) {
            routeUserDashboard(result);
        } else {
            alert(isLoginMode ? "Invalid username or password match configuration." : "Account created successfully! Switching to Login screen.");
            if(!isLoginMode) { toggleLink.click(); authForm.reset(); }
        }
    } catch (err) {
        alert("Server validation connection timed out. Confirm script configuration setup matches exactly.");
    } finally {
        submitBtn.innerText = isLoginMode ? "Sign In" : "Sign Up";
        submitBtn.disabled = false;
    }
});

function routeUserDashboard(user) {
    document.getElementById("auth-card").style.display = "none";
    
    if (user.role === "admin") {
        document.getElementById("admin-dashboard").style.display = "block";
    } else {
        document.getElementById("student-display-name").innerText = user.name || "Student";
        document.getElementById("student-dashboard").style.display = "block";
        loadStudentMarks(user.email);
    }
}

async function loadStudentMarks(email) {
    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "getMarks", email: email })
    });
    const result = await response.json();
    const container = document.getElementById("student-marks-body");
    container.innerHTML = "";
    
    if (result.success && result.data.length > 0) {
        result.data.forEach(item => {
            container.innerHTML += `<tr><td>${item.subject}</td><td><strong>${item.mark}</strong></td></tr>`;
        });
    } else {
        container.innerHTML = `<tr><td colspan="2">No performance grades found yet for this user.</td></tr>`;
    }
}

// Admin Mark Assignment Submission Form Handler
document.getElementById("mark-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("target-email").value;
    const subject = document.getElementById("target-subject").value;
    const mark = document.getElementById("target-mark").value;

    const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "updateMark", email, subject, mark })
    });
    const result = await res.json();
    if (result.success) {
        alert("Mark updated on cloud database database row successfully!");
        document.getElementById("mark-form").reset();
    }
});

function logout() {
    window.location.reload();
}
