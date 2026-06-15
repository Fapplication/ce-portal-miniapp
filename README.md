# 🏛️ CE Department Academic Portal
### Complete Deployment Guide — GitHub Pages + Google Apps Script + Telegram Bot

---

## 📁 Project File Structure

```
civil-portal/
├── index.html                  ← Landing page (login modals)
├── student-dashboard.html      ← Full student portal
├── instructor-dashboard.html   ← Full instructor portal
├── Code.gs                     ← Google Apps Script backend
└── README.md                   ← This file
```

---

## ✅ STEP 1 — Create the Google Sheet (Database)

### 1.1 Create a new Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank spreadsheet**
3. Name it: `CE Department Portal — Database`
4. Copy the URL — it looks like:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
5. Copy only the long ID between `/d/` and `/edit`

> **Example:**
> URL: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit`
> ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms`

---

## ✅ STEP 2 — Set Up Google Apps Script

### 2.1 Open Apps Script

1. Inside your Google Sheet, click the menu:
   **Extensions → Apps Script**
2. A new tab opens with the script editor

### 2.2 Paste the backend code

1. Delete everything in the default `Code.gs` file
2. Copy the **entire contents** of `Code.gs` from this project
3. Paste it into the editor

### 2.3 Configure your credentials

At the top of `Code.gs`, update the `CONFIG` block:

```javascript
const CONFIG = {
  SPREADSHEET_ID:  'PASTE_YOUR_SPREADSHEET_ID_HERE',
  TELEGRAM_TOKEN:  'PASTE_YOUR_TELEGRAM_BOT_TOKEN_HERE',  // optional
  ANTHROPIC_KEY:   'PASTE_YOUR_ANTHROPIC_API_KEY_HERE',   // optional
  SESSION_HOURS:   8,
  DEPT_NAME:       'Civil Engineering',
  ACADEMIC_YEAR:   2026,
};
```

> **Which keys are required?**
> - `SPREADSHEET_ID` — **Required.** Without it nothing works.
> - `TELEGRAM_TOKEN` — Optional. Skip if you don't want Telegram notifications.
> - `ANTHROPIC_KEY`  — Optional. Skip to use the built-in rule-based AI instead.

### 2.4 Save the project

- Press **Ctrl + S** (Windows) or **Cmd + S** (Mac)
- Name the project: `CE Portal Backend`

### 2.5 Run the setup function ONCE

1. In the toolbar dropdown, select the function: `SETUP_RUN_ONCE`
2. Click the ▶ **Run** button
3. **First time only:** Google will ask for permissions
   - Click **Review permissions**
   - Choose your Google account
   - Click **Advanced → Go to CE Portal Backend (unsafe)**
   - Click **Allow**
4. Wait for it to finish — check the **Execution log** at the bottom
5. You should see:
   ```
   === CE Portal Setup ===
   Step 1: Initializing master sheets…
   Step 2: Creating triggers…
   Step 3: Setting Telegram webhook…
   === Setup complete! ===
   Web App URL: https://script.google.com/macros/s/YOUR_ID/exec
   ```

> This automatically creates all 11 sheet tabs with correct headers
> and seeds demo student/instructor data.

### 2.6 Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the ⚙️ gear icon next to "Type" → select **Web app**
3. Fill in:
   | Field | Value |
   |---|---|
   | Description | CE Portal v1 |
   | Execute as | **Me** |
   | Who has access | **Anyone** |
4. Click **Deploy**
5. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
6. Keep this URL — you need it in Step 4

> ⚠️ **Every time you edit Code.gs**, you must create a **New Deployment**
> (not update existing) to push changes live.

---

## ✅ STEP 3 — Add Demo Users (or Add Real Users)

After running `SETUP_RUN_ONCE`, open your Google Sheet.
You will see these tabs created automatically:

```
Users | Students | Instructors | Courses | Assessments |
Enrollments | Results | Notifications | Complaints | Notices | Sessions
```

### 3.1 Add an Instructor

Open the **Instructors** sheet and fill in a row:

| InstructorID | FullName | Email | Department | Specialization | TelegramID | TelegramUsername | PasswordHash | Status |
|---|---|---|---|---|---|---|---|---|
| INS/001/24 | Dr. Tesfaye Alemu | tesfaye@aait.edu.et | Civil Engineering | Highway Engineering | | | pass123 | active |

> For `PasswordHash`: type the plain password in that column for now.
> The system accepts plain text or SHA-256 hash.

### 3.2 Add Students

Open the **Students** sheet:

| StudentID | FullName | Email | Department | Year | TelegramID | TelegramUsername | PasswordHash | Status |
|---|---|---|---|---|---|---|---|---|
| UGR/82533/16 | Abomsa Dida Wake | abomsa@student.aait.edu.et | Civil Engineering | 4th Year | | | pass123 | active |
| UGR/82534/16 | Birtukan Haile | birtukan@student.aait.edu.et | Civil Engineering | 4th Year | | | pass123 | active |

> You can add as many students as needed.
> Leave `TelegramID` blank until students link their accounts.

---

## ✅ STEP 4 — Connect Frontend to Backend

### 4.1 Update the Script URL in all HTML files

Open **each HTML file** and find this line near the top of the `<script>` section:

```javascript
const SCRIPT_URL = localStorage.getItem('script_url') || 'YOUR_APPS_SCRIPT_URL_HERE';
```

Replace `YOUR_APPS_SCRIPT_URL_HERE` with your deployed Web App URL:

```javascript
const SCRIPT_URL = localStorage.getItem('script_url') || 'https://script.google.com/macros/s/YOUR_REAL_ID/exec';
```

Do this in **all three files**:
- `index.html`
- `student-dashboard.html`
- `instructor-dashboard.html`

> 💡 **Tip:** Users can also set their own Script URL by opening browser console and typing:
> ```javascript
> localStorage.setItem('script_url', 'https://script.google.com/macros/s/YOUR_ID/exec')
> ```

---

## ✅ STEP 5 — Deploy to GitHub Pages

### 5.1 Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in
2. Click **+ New repository**
3. Name it: `ce-department-portal`
4. Set visibility: **Public** (required for free GitHub Pages)
5. Click **Create repository**

### 5.2 Upload your files

**Option A — GitHub Web Interface (easiest):**
1. Click **uploading an existing file**
2. Drag and drop all 4 files:
   - `index.html`
   - `student-dashboard.html`
   - `instructor-dashboard.html`
   - `README.md`
3. Click **Commit changes**

**Option B — Git CLI:**
```bash
git clone https://github.com/YOUR_USERNAME/ce-department-portal.git
cd ce-department-portal

# Copy your files here
cp /path/to/index.html .
cp /path/to/student-dashboard.html .
cp /path/to/instructor-dashboard.html .

git add .
git commit -m "Initial portal deployment"
git push origin main
```

### 5.3 Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 1–2 minutes
7. Your portal is live at:
   ```
   https://YOUR_USERNAME.github.io/ce-department-portal/
   ```

### 5.4 Test your deployment

| URL | Should Open |
|---|---|
| `https://YOUR_USERNAME.github.io/ce-department-portal/` | Landing page |
| `https://YOUR_USERNAME.github.io/ce-department-portal/student-dashboard.html` | Student portal |
| `https://YOUR_USERNAME.github.io/ce-department-portal/instructor-dashboard.html` | Instructor portal |

---

## ✅ STEP 6 — Set Up Telegram Bot (Optional)

### 6.1 Create the bot

1. Open Telegram and search for **@BotFather**
2. Send: `/newbot`
3. Choose a name: `CE Department Portal`
4. Choose a username: `ce_dept_portal_bot` (must end in `bot`)
5. BotFather will reply with your token:
   ```
   Token: 7123456789:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 6.2 Add the token to Apps Script

1. Go back to your Apps Script editor
2. Update `CONFIG.TELEGRAM_TOKEN` with your token
3. Create a new deployment (Deploy → New deployment)
4. Run the function `setTelegramWebhook` once from the editor

### 6.3 Test the bot

1. Search for your bot on Telegram
2. Click **Start** or send `/start`
3. You should receive the welcome message

### 6.4 Link student accounts

Students need to:
1. Find their Telegram Chat ID by messaging [@userinfobot](https://t.me/userinfobot)
2. Share that ID with the instructor/admin
3. Admin adds it to the `TelegramID` column in the Students sheet

> Or: Add a self-service link flow by having students message the bot with
> their Student ID, and the bot auto-links their account.

---

## ✅ STEP 7 — Set Up AI Assistant (Optional)

### 7.1 Get Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account or log in
3. Go to **API Keys** → **Create Key**
4. Copy the key: `sk-ant-api03-...`

### 7.2 Add to Apps Script

```javascript
const CONFIG = {
  ...
  ANTHROPIC_KEY: 'sk-ant-api03-YOUR_KEY_HERE',
};
```

Create a new deployment after saving.

> If no Anthropic key is provided, the portal automatically falls back
> to the built-in rule-based AI assistant (works for common questions).

---

## 📋 WORKFLOW — How to Use the Portal

### Instructor Workflow (in order)

```
1. Log in as Instructor
      ↓
2. Create Course (e.g. CE401 — Highway Engineering)
      → Google Sheet tab auto-created
      ↓
3. Build Assessments (Assessments modal)
      → Set names and weights (must total 100%)
      → Sheet columns auto-generated
      ↓
4. Enroll Students
      → Add individually or bulk CSV import
      → Student rows auto-added to sheet
      ↓
5. Enter Grades (Grade Entry page)
      → Fill scores per student per assessment
      → Total, Grade, GP calculated live
      → Save to Google Sheets
      ↓
6. Publish Results
      → Students notified via portal + Telegram
      → Results visible on student dashboard
```

### Student Workflow

```
1. Log in with Student ID and Password
      ↓
2. Dashboard shows GPA ring, recent grades, announcements
      ↓
3. My Marks → click any course → full assessment breakdown
      ↓
4. Complaints → raise a grade dispute if needed
      ↓
5. Notifications → see new grades, notices, test announcements
```

---

## 🔑 Default Demo Credentials

| Role | ID | Password |
|---|---|---|
| Instructor | INS/001/24 | pass123 |
| Student | UGR/82533/16 | pass123 |
| Student | UGR/82534/16 | pass123 |
| Student | UGR/82535/16 | pass123 |

> ⚠️ Change all passwords before going live.
> Update the `PasswordHash` column in the respective sheets.

---

## 🗂️ Google Sheet Tab Structure

After setup, your spreadsheet will have these tabs:

| Tab Name | Purpose |
|---|---|
| `Users` | Combined user index |
| `Students` | Student accounts and profiles |
| `Instructors` | Instructor accounts |
| `Courses` | All course records |
| `Assessments` | Assessment definitions per course |
| `Enrollments` | Student-course enrollment records |
| `Results` | Individual assessment scores |
| `Notifications` | Portal notification queue |
| `Complaints` | Grade complaints and responses |
| `Notices` | Broadcast notices sent by instructors |
| `Sessions` | Active login sessions (auth tokens) |
| `CE401_Highway_Engineering` | Auto-created per course |
| `CE402_Structural_Analysis` | Auto-created per course |
| `CE403_...` | etc. |

---

## ⚙️ Re-deploying After Changes

Every time you edit `Code.gs`:

1. Apps Script editor → **Deploy → New deployment**
2. Select type: **Web app**
3. Set **Execute as: Me**, **Who has access: Anyone**
4. Click **Deploy**
5. Copy the **new URL** and update `SCRIPT_URL` in your HTML files
6. Push updated HTML files to GitHub

> ⚠️ "Manage deployments" → "Edit" does NOT push code changes.
> Always create a **New deployment** for code updates.

---

## 🛡️ Security Recommendations

Before going live with real student data:

- [ ] Replace plain-text passwords with hashed versions
  - Run `hashPassword('yourpassword')` in Apps Script and store the result
- [ ] Restrict Apps Script access to specific domains if possible
- [ ] Enable Google Sheet sharing only with your Google account
- [ ] Set up a custom domain for GitHub Pages (Settings → Pages → Custom domain)
- [ ] Add HTTPS enforcement in GitHub Pages settings
- [ ] Rotate Telegram bot token if shared accidentally
- [ ] Remove demo seed data from `seedDemoData()` function after real users are added

---

## 🐛 Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Login returns "Connection error" | SCRIPT_URL not set | Update `SCRIPT_URL` in HTML files |
| Login returns "User not found" | Student/instructor not in sheet | Add user to Students or Instructors sheet |
| Google Sheet tab not created | `SETUP_RUN_ONCE` not run | Run it once from Apps Script editor |
| Telegram bot not responding | Webhook not set | Run `setTelegramWebhook()` from editor |
| Grades not saving | Sheet tab name mismatch | Check `SheetTabName` column in Courses sheet |
| CORS error in browser | Apps Script not deployed as Web App | Redeploy with "Anyone" access |
| 401 Unauthorized from Apps Script | Token expired | Log out and log back in |
| AI chat not working | Anthropic key missing | Add key to CONFIG or use rule-based fallback |
| GitHub Pages 404 | Files not committed | Check repository file list on GitHub |

---

## 🚀 Performance Tips

- The portal loads from static GitHub Pages CDN — typically **< 1 second**
- Google Apps Script cold starts take **2–4 seconds** on first call
- Subsequent calls within the same session are faster (**< 1 second**)
- For faster grade loading, pre-load data on dashboard render
- Use `localStorage` to cache the Script URL and theme preference

---

## 📞 Support

For issues with this portal:

1. Check the **Execution log** in Apps Script (View → Logs)
2. Open browser **DevTools → Console** to see frontend errors
3. Verify the Google Sheet has all required columns by checking
   against the schema in `initializeMasterSheets()`

---

## 📄 License

Built for the Department of Civil Engineering.
Free to use, modify, and deploy for educational purposes.

---

*Portal generated for CE Department · Addis Ababa Institute of Technology · 2026*
