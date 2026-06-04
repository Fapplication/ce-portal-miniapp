// ═══════════════════════════════════════════════════════════
// CONFIG — paste your Apps Script /exec URL here
// ═══════════════════════════════════════════════════════════
const API_URL = "https://script.google.com/macros/s/AKfycbw_J_NyUB1YMtHdmZpOi1hTNAYPySJTGI5wr5ki2ym0yUSIG15OgU7WHYUvhH7lKBjG/exec";

// ═══════════════════════════════════════════════════════════
// CORE FETCH HELPER
// KEY FIX: Do NOT set Content-Type header at all.
// When Content-Type is omitted, the browser sends a "simple"
// request with no preflight OPTIONS check.
// Apps Script reads the body fine without the header.
// ═══════════════════════════════════════════════════════════
async function apiCall(payload) {
  try {
    const response = await fetch(API_URL, {
      method:   "POST",
      body:     JSON.stringify(payload)
      // ← NO headers object at all — this is intentional
      // Adding Content-Type: application/json triggers a
      // preflight that Apps Script cannot respond to,
      // causing "Failed to fetch"
    });

    if (!response.ok) {
      throw new Error("HTTP " + response.status + ": " + response.statusText);
    }

    const text = await response.text();
    console.log("Raw API response:", text);

    try {
      return JSON.parse(text);
    } catch (parseErr) {
      console.error("Could not parse JSON:", text);
      throw new Error("Server returned invalid response. Check Apps Script logs.");
    }

  } catch (err) {
    console.error("apiCall failed:", err);
    throw err;
  }
}

// ═══════════════════════════════════════════════════════════
// AUTH FORM STATE
// ═══════════════════════════════════════════════════════════
let isLoginMode = true;

const authForm     = document.getElementById("auth-form");
const toggleLink   = document.getElementById("toggle-link");
const authTitle    = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const submitBtn    = document.getElementById("submit-btn");

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

  if (!id || !password) {
    alert("Please enter both Student ID and Password.");
    return;
  }

  const payload = isLoginMode
    ? { action: "login",    id, password }
    : { action: "register", id, password };

  const originalText  = submitBtn.innerText;
  submitBtn.innerText = "Connecting...";
  submitBtn.disabled  = true;

  try {
    const result = await apiCall(payload);

    if (result.success) {
      if (isLoginMode) {
        routeUserDashboard(result);
      } else {
        alert("✅ Account created! Signing you in...");
        const loginResult = await apiCall({ action: "login", id, password });
        if (loginResult.success) {
          routeUserDashboard(loginResult);
        } else {
          isLoginMode = true;
          setFormToLogin();
          alert("Account created. Please sign in manually.");
        }
      }
    } else {
      alert("⚠️ " + (result.message || "Unknown error."));
    }

  } catch (err) {
    alert(
      "❌ Connection Error: " + err.message + "\n\n" +
      "Checklist:\n" +
      "1. Is the API_URL in app.js correct?\n" +
      "2. Is the deployment set to 'Anyone' access?\n" +
      "3. Open browser DevTools → Console for full error."
    );
  } finally {
    submitBtn.innerText = originalText;
    submitBtn.disabled  = false;
  }
});

function setFormToLogin() {
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
    document.getElementById("student-display-name").innerText = user.name || user.id;
    document.getElementById("student-dashboard").style.display = "block";
    loadStudentMarks(user.id);
  }
}

// ═══════════════════════════════════════════════════════════
// MARKS LOADER
// ═══════════════════════════════════════════════════════════
async function loadStudentMarks(id) {
  const container = document.getElementById("student-marks-body");
  container.innerHTML = `<tr><td colspan="7" style="text-align:center;">⏳ Loading marks...</td></tr>`;

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
      container.innerHTML = `<tr><td colspan="7" style="text-align:center;">No published marks found for this ID.</td></tr>`;
    }
  } catch (err) {
    container.innerHTML = `<tr><td colspan="7" style="text-align:center;color:red;">Error loading marks: ${err.message}</td></tr>`;
  }
}

// ═══════════════════════════════════════════════════════════
// ADMIN: UPDATE MARKS
// ═══════════════════════════════════════════════════════════
const markForm = document.getElementById("mark-form");
if (markForm) {
  markForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      action:     "updateMark",
      id:         document.getElementById("target-id").value.trim(),
      subject:    document.getElementById("target-subject").value,
      quiz:       parseFloat(document.getElementById("m-quiz").value)     || 0,
      mid:        parseFloat(document.getElementById("m-mid").value)      || 0,
      assignment: parseFloat(document.getElementById("m-assign").value)   || 0,
      final:      parseFloat(document.getElementById("m-final").value)    || 0
    };

    if (!payload.id || !payload.subject) {
      alert("Please fill in the Student ID and select a subject.");
      return;
    }

    try {
      const result = await apiCall(payload);
      alert(result.success ? "✅ " + result.message : "⚠️ " + result.message);
      if (result.success) markForm.reset();
    } catch (err) {
      alert("❌ Error saving marks: " + err.message);
    }
  });
}

// ═══════════════════════════════════════════════════════════
// LOGOUT
// ═══════════════════════════════════════════════════════════
function logout() {
  window.location.reload();
}
