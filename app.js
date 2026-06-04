// ═══════════════════════════════════════════════════════════
// CONFIG — must match your Apps Script deployment URL exactly
// ═══════════════════════════════════════════════════════════
const API_URL = "https://script.google.com/macros/s/AKfycbwIBwmdPOdtaISQVR1zxTlmWH7-cG0g1_56Gj4LIhvVfpY5ZTOgWMP6-Hpx268uFciR/exec"; // <-- same URL in both files

// ═══════════════════════════════════════════════════════════
// CORE FETCH HELPER
// Uses "no-cors" is WRONG — we need the response.
// The fix is: Apps Script returns HtmlService output which
// allows cross-origin reads. We read it as text then parse.
// ═══════════════════════════════════════════════════════════
async function apiCall(payload) {
  const response = await fetch(API_URL, {
    method:  "POST",
    headers: { "Content-Type": "text/plain" }, // text/plain avoids preflight CORS check
    body:    JSON.stringify(payload)
  });
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse response:", text);
    throw new Error("Invalid server response");
  }
}

// ═══════════════════════════════════════════════════════════
// AUTH FORM STATE
// ═══════════════════════════════════════════════════════════
let isLoginMode = true;

const authForm    = document.getElementById("auth-form");
const toggleLink  = document.getElementById("toggle-link");
const authTitle   = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const submitBtn   = document.getElementById("submit-btn");

toggleLink.addEventListener("click", (e) => {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  authForm.reset();
  if (isLoginMode) {
    authTitle.innerText    = "Portal Access";
    authSubtitle.innerText = "Enter your institutional identification credentials.";
    submitBtn.innerText    = "Sign In";
    toggleLink.innerText   = "First time? Register your pre-authorized ID here";
  } else {
    authTitle.innerText    = "Register Account";
    authSubtitle.innerText = "Claim your record workspace using your authorized Student ID.";
    submitBtn.innerText    = "Complete Registration";
    toggleLink.innerText   = "Already registered? Sign in here";
  }
});

// ═══════════════════════════════════════════════════════════
// SUBMIT HANDLER
// ═══════════════════════════════════════════════════════════
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id       = document.getElementById("userId").value.trim();
  const password = document.getElementById("password").value.trim();
  const payload  = isLoginMode
    ? { action: "login",    id, password }
    : { action: "register", id, password };

  submitBtn.innerText = "Connecting...";
  submitBtn.disabled  = true;

  try {
    const result = await apiCall(payload);

    if (result.success) {
      if (isLoginMode) {
        routeUserDashboard(result);
      } else {
        alert("✅ Account created successfully! Signing you in...");
        // Auto sign-in after registration
        const loginResult = await apiCall({ action: "login", id, password });
        if (loginResult.success) {
          routeUserDashboard(loginResult);
        } else {
          isLoginMode = true;
          updateFormForLogin();
          alert("Account created. Please sign in.");
        }
      }
    } else {
      alert("⚠️ " + result.message);
    }
  } catch (err) {
    console.error("API error:", err);
    alert("❌ Connection error: " + err.message + "\n\nCheck the browser console for details.");
  } finally {
    submitBtn.innerText = isLoginMode ? "Sign In" : "Complete Registration";
    submitBtn.disabled  = false;
  }
});

function updateFormForLogin() {
  authTitle.innerText    = "Portal Access";
  authSubtitle.innerText = "Enter your institutional identification credentials.";
  submitBtn.innerText    = "Sign In";
  toggleLink.innerText   = "First time? Register your pre-authorized ID here";
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD ROUTING
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
// MARKS LOADER
// ═══════════════════════════════════════════════════════════
async function loadStudentMarks(id) {
  const container = document.getElementById("student-marks-body");
  container.innerHTML = `<tr><td colspan="7" style="text-align:center;">Loading marks...</td></tr>`;

  try {
    const result = await apiCall({ action: "getMarks", id });
    container.innerHTML = "";

    if (result.success && result.data && result.data.length > 0) {
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
      container.innerHTML = `<tr><td colspan="7" style="text-align:center;">No published marks found.</td></tr>`;
    }
  } catch (err) {
    container.innerHTML = `<tr><td colspan="7" style="text-align:center;color:red;">Error loading marks: ${err.message}</td></tr>`;
  }
}

// ═══════════════════════════════════════════════════════════
// ADMIN: UPDATE MARKS
// ═══════════════════════════════════════════════════════════
document.getElementById("mark-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    action:     "updateMark",
    id:         document.getElementById("target-id").value.trim(),
    subject:    document.getElementById("target-subject").value,
    quiz:       parseFloat(document.getElementById("m-quiz").value),
    mid:        parseFloat(document.getElementById("m-mid").value),
    assignment: parseFloat(document.getElementById("m-assign").value),
    final:      parseFloat(document.getElementById("m-final").value)
  };

  try {
    const result = await apiCall(payload);
    alert(result.success ? "✅ " + result.message : "⚠️ " + result.message);
    if (result.success) document.getElementById("mark-form").reset();
  } catch (err) {
    alert("❌ Error: " + err.message);
  }
});

// ═══════════════════════════════════════════════════════════
// LOGOUT
// ═══════════════════════════════════════════════════════════
function logout() {
  window.location.reload();
}
