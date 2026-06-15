# 📱 CE Portal — Telegram Mini App Setup Guide

## What You're Getting
A **Telegram Mini App** that:
- Opens **inside Telegram** (no installation needed)
- Looks and feels like a **native mobile app**
- Works on **Android, iOS, and Telegram Desktop**
- Students and instructors **log in and use the full portal** without leaving Telegram
- Syncs with your **Google Sheets** backend

---

## 📁 Files in This Folder

```
telegram-mini-app/
├── index.html        ← The entire Mini App (single file)
└── SETUP.md          ← This guide
```

---

## ✅ STEP 1 — Host the Mini App on GitHub Pages

The Mini App must be hosted on **HTTPS**. GitHub Pages is free and perfect.

### 1.1 Create a separate repo for the Mini App

1. Go to [github.com](https://github.com) → **New repository**
2. Name it: `ce-portal-miniapp`
3. Set to **Public**
4. Click **Create repository**

### 1.2 Upload the file

1. Click **uploading an existing file**
2. Upload `index.html` from this folder
3. Click **Commit changes**

### 1.3 Enable GitHub Pages

1. Go to **Settings → Pages**
2. Source: **main branch / root**
3. Click **Save**
4. Your Mini App is live at:
   ```
   https://YOUR_USERNAME.github.io/ce-portal-miniapp/
   ```

> ⚠️ Wait 1–2 minutes for GitHub Pages to activate.
> Open the URL in your browser to confirm it loads.

---

## ✅ STEP 2 — Connect Your Apps Script URL

Open `index.html` and find this line near the top of `<script>`:

```javascript
const SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
```

Replace it with your deployed Google Apps Script Web App URL:

```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_REAL_ID/exec';
```

Commit and push the change.

---

## ✅ STEP 3 — Create the Telegram Bot (if not done yet)

1. Open Telegram → search **@BotFather**
2. Send: `/newbot`
3. Name: `CE Department Portal`
4. Username: `ce_dept_portal_bot` (must end in `bot`)
5. Copy your **Bot Token**:
   ```
   7123456789:AAFxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## ✅ STEP 4 — Register the Mini App with BotFather

This is the key step that turns your web page into a Telegram Mini App.

### 4.1 Set the Menu Button (opens Mini App from chat)

Send to **@BotFather**:
```
/setmenubutton
```
- Select your bot
- Button Text: `Open Portal`
- URL: `https://YOUR_USERNAME.github.io/ce-portal-miniapp/`

### 4.2 Create a Web App entry

Send to **@BotFather**:
```
/newapp
```
- Select your bot
- Title: `CE Department Portal`
- Description: `Academic grades, GPA, complaints and more`
- Photo: Upload a 640×360px banner image (your department logo)
- URL: `https://YOUR_USERNAME.github.io/ce-portal-miniapp/`
- Short name: `ceportal`

After setup, your Mini App can be opened at:
```
https://t.me/ce_dept_portal_bot/ceportal
```

### 4.3 Set bot commands

Send to **@BotFather**:
```
/setcommands
```
Select your bot, then paste:
```
start - Open CE Department Portal
marks - View my grades
gpa - Check my GPA
courses - List my courses
notices - Recent announcements
help - Show all commands
```

---

## ✅ STEP 5 — Configure the Bot Webhook (Apps Script)

Your `Code.gs` already has the Telegram handler. You just need to:

1. Open your Google Apps Script project
2. Update `CONFIG.TELEGRAM_TOKEN` with your bot token
3. Deploy a **new version** of the Web App
4. In the Apps Script editor, run the function:
   ```
   setTelegramWebhook
   ```
   This tells Telegram to send all messages to your Apps Script.

---

## ✅ STEP 6 — Test the Mini App

### 6.1 Open via menu button
1. Open Telegram
2. Start a chat with your bot (`@ce_dept_portal_bot`)
3. Tap the **[ ]** menu button at the bottom left
4. Select **Open Portal**
5. The Mini App opens inside Telegram ✅

### 6.2 Open via direct link
Share this link with students and instructors:
```
https://t.me/ce_dept_portal_bot/ceportal
```

### 6.3 Test login
- Student: `UGR/82533/16` / `pass123`
- Instructor: `INS/001/24` / `pass123`

---

## 📱 How the Mini App Works

```
Student opens Telegram
        ↓
Taps bot menu button or link
        ↓
Mini App opens inside Telegram (full screen)
        ↓
Student sees splash screen → taps "Student Login"
        ↓
Enters Student ID + password
        ↓
Calls your Apps Script API to authenticate
        ↓
Dashboard loads with:
  - GPA ring animation
  - Course grade cards
  - Announcements
        ↓
Student navigates via bottom tab bar:
  🏠 Home | 📊 Marks | 🤖 AI | 📨 Complaints | ⚙️ Settings
```

---

## 🔔 Sending Notifications TO the Mini App

When instructor publishes grades (from `Code.gs`), the system:
1. Sends a **Telegram message** to the student's chat
2. The message includes a button to open the Mini App directly to their grades

The `publishResults()` function in `Code.gs` already handles this.

---

## 🎨 Mini App Features

### Student Side
| Feature | Status |
|---|---|
| Login with Student ID + Password | ✅ |
| GPA Ring animation | ✅ |
| Course grade cards with progress bars | ✅ |
| Full assessment breakdown per course | ✅ |
| Ethiopian grading system display | ✅ |
| Notifications list | ✅ |
| Submit grade complaints | ✅ |
| AI chat assistant | ✅ |
| Settings | ✅ |
| Dark/Light mode (follows Telegram) | ✅ |

### Instructor Side
| Feature | Status |
|---|---|
| Login with Instructor ID + Password | ✅ |
| Dashboard with stats | ✅ |
| Course list | ✅ |
| Grade entry per student per assessment | ✅ |
| Save and Publish grades | ✅ |
| Complaint management | ✅ |
| Analytics (pass/fail, top students) | ✅ |
| Send quick notices | ✅ (via Telegram popup) |

---

## 🛠 Customisation

### Change the app name and logo
In `index.html`, find:
```html
<div class="splash-logo">🏛️</div>
<div class="splash-title">CE Portal</div>
<div class="splash-sub">Department of Civil Engineering<br/>Academic Management System</div>
```
Replace the emoji, title and subtitle with your department's branding.

### Change colours
At the top of `index.html` in `:root`:
```css
--blue:   #2563EB;   /* primary colour */
--amber:  #F59E0B;   /* instructor accent */
--green:  #10B981;   /* success */
--red:    #EF4444;   /* danger */
```

### Auto-detect Telegram user
The Mini App already reads `TG.initDataUnsafe.user` to pre-fill
the username on the login form. To fully auto-login via Telegram:
1. Store a mapping of Telegram UserID → StudentID in your Google Sheet
2. In `Code.gs`, add a `telegramAutoLogin` action
3. Call it from the Mini App on startup with `TG.initData`

---

## 🔗 Share Links

After setup, share these links:

| Link | Purpose |
|---|---|
| `https://t.me/ce_dept_portal_bot` | Start the bot |
| `https://t.me/ce_dept_portal_bot/ceportal` | Open Mini App directly |
| `https://YOUR_USERNAME.github.io/ce-portal-miniapp/` | Web fallback |

---

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| Mini App shows blank page | Wait 2 min after GitHub Pages deploy |
| Login says "Connection error" | Update `SCRIPT_URL` in `index.html` |
| Telegram shows "Page not found" | Check GitHub Pages is enabled and URL is correct |
| BotFather says invalid URL | URL must start with `https://` |
| Bot not responding to commands | Run `setTelegramWebhook` in Apps Script |
| Mini App not full screen | `TG.expand()` is called automatically — check browser console |

---

*CE Department Academic Portal — Telegram Mini App · 2026*
