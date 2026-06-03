// Paste your newest deployment endpoint macro URL string below
const API_URL = "https://script.google.com/macros/s/AKfycbw5I6LxE2nVGvSN84u4Q8PaEytjGQhpJP9WyjkBSG4i33joXVuYUdk0adB_Sc7Fej4z/exec"; 
let isLoginMode = true;

const authForm = document.getElementById("auth-form");
const toggleLink = document.getElementById("toggle-link");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const submitBtn = document.getElementById("submit-btn");

toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    authForm.reset();
    if (isLoginMode) {
        authTitle.innerText = "Portal Access";
        authSubtitle.innerText = "Enter your institutional identification credentials.";
        submitBtn.innerText = "Sign In";
        toggleLink.innerText = "First time? Register your pre-authorized ID here";
    } else {
        authTitle.innerText = "Register Account";
        authSubtitle.innerText = "Claim your record workspace using your authorized Student ID.";
        submitBtn.innerText = "Complete Registration";
        toggleLink.innerText = "Already registered? Sign in here";
    }
});

authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("userId").value.trim();
    const password = document.getElementById("password").value.trim();

    const payload = isLoginMode 
        ? { action: "login", id, password }
        : { action: "register", id, password };

    submitBtn.innerText = "Connecting to Cloud...";
    submitBtn.disabled = true;

    try {
        const response = await fetch(API_URL, { 
            method: "POST", 
            mode: "cors", // Forces explicit Cross-Origin Request Handshake
            body: JSON.stringify(payload) 
        });
        const result = await response.json();

        if (result.success) {
            if (isLoginMode) {
                routeUserDashboard(result);
            } else {
                alert("Account created successfully! Proceeding to log in.");
                isLoginMode = true;
                toggleLink.click();
            }
        } else {
            alert(result.message);
        }
    } catch (err) {
        alert("Connection refused. Confirm your Apps Script endpoint deployment configurations.");
    } finally {
        submitBtn.innerText = isLoginMode ? "Sign In" : "Complete Registration";
        submitBtn.disabled = false;
    }
});

function routeUserDashboard(user) {
    document.getElementById("auth-card").style.display = "none";
    if (user.role === "admin") {
        document.getElementById("admin-dashboard").style.display = "block";
    } else {
        document.getElementById("student-display-name").innerText = user.name;
        document.getElementById("student-dashboard").style.display = "block";
        loadStudentMarks(user.id);
    }
}

async function loadStudentMarks(id) {
    const response = await fetch(API_URL, { method: "POST", mode: "cors", body: JSON.stringify({ action: "getMarks", id }) });
    const result = await response.json();
    const container = document.getElementById("student-marks-body");
    container.innerHTML = "";
    
    if (result.success && result.data.length > 0) {
        result.data.forEach(item => {
            container.innerHTML += `
                <tr>
                    <td><strong>${item.subject}</strong></td>
                    <td>${item.quiz} / 10</td>
                    <td>${item.mid} / 20</td>
                    <td>${item.assignment} / 20</td>
                    <td>${item.final} / 50</td>
                    <td><strong>${item.total} / 100</strong></td>
                    <td><span class="badge">${item.grade}</span></td>
                </tr>`;
        });
    } else {
        container.innerHTML = `<tr><td colspan="7" style="text-align:center;">No nominated course tab markings found under this student profile row.</td></tr>`;
    }
}

document.getElementById("mark-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
        action: "updateMark",
        id: document.getElementById("target-id").value.trim(),
        subject: document.getElementById("target-subject").value,
        quiz: parseFloat(document.getElementById("m-quiz").value) || 0,
        mid: parseFloat(document.getElementById("m-mid").value) || 0,
        assignment: parseFloat(document.getElementById("m-assign").value) || 0,
        final: parseFloat(document.getElementById("m-final").value) || 0
    };

    try {
        const res = await fetch(API_URL, { method: "POST", mode: "cors", body: JSON.stringify(payload) });
        const result = await res.json();
        if (result.success) {
            alert(result.message);
            document.getElementById("mark-form").reset();
        } else {
            alert(result.message);
        }
    } catch (err) {
        alert("Failed to publish marks to the cloud registry sheet.");
    }
});

function logout() { window.location.reload(); }
