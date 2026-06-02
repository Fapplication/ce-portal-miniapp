const API_URL = "https://script.google.com/macros/s/AKfycbyQH5jvZR9UqLdP12Fdn6Ai5kqzjm5xOMhx9gLInmjvVuga-v2amszTBvyCwDPzAp3z/exec"; 
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
    const id = document.getElementById("userId").value;
    const password = document.getElementById("password").value;

    const payload = isLoginMode 
        ? { action: "login", id, password }
        : { action: "register", id, password };

    submitBtn.innerText = "Connecting to Cloud...";
    submitBtn.disabled = true;

    try {
        const response = await fetch(API_URL, { method: "POST", body: JSON.stringify(payload) });
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
    const response = await fetch(API_URL, { method: "POST", body: JSON.stringify({ action: "getMarks", id }) });
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
        container.innerHTML = `<tr><td colspan="7" style="text-align:center;">No published marks found under this student ID.</td></tr>`;
    }
}

document.getElementById("mark-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
        action: "updateMark",
        id: document.getElementById("target-id").value,
        subject: document.getElementById("target-subject").value,
        quiz: parseFloat(document.getElementById("m-quiz").value),
        mid: parseFloat(document.getElementById("m-mid").value),
        assignment: parseFloat(document.getElementById("m-assign").value),
        final: parseFloat(document.getElementById("m-final").value)
    };

    const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(payload) });
    const result = await res.json();
    if (result.success) {
        alert(result.message);
        document.getElementById("mark-form").reset();
    }
});

function logout() { window.location.reload(); }
