# VirusTotal Link Checker (VTLC)

A Firefox extension that allows you to quickly check any link in **VirusTotal** directly from the browser context menu.  
It displays a small popup near the cursor with a spinner (during the check) and the result as a colored badge.

---

## ✨ Features
- Adds a **“Check with VirusTotal”** item to the context menu when right-clicking on a link.
- Uses the VirusTotal API to submit links for scanning.
- Shows a **spinner "Checking..."** while the request is in progress.
- Displays the result in a popup near the cursor:
  - 🟢 **Clean / Low Risk**
  - 🟡 **Suspicious**
  - 🔴 **Malicious**
- Popup automatically disappears after **3 seconds** or immediately when clicked.
- Comes with custom **VTLC icons** (16×16, 32×32, 48×48, 128×128).

---

## 📦 Installation

### Option 1. Temporary (for development)
1. Unpack the `vt-checker-popup-v4.zip` archive (or `vt-checker-popup-v4.xpi` for permanent installation after signing).  
2. Open Firefox → go to `about:debugging#/runtime/this-firefox`.  
3. Click **Load Temporary Add-on...**.  
4. Select the `manifest.json` file from the unpacked folder.  
5. The extension will load and work until the browser is restarted.

### Option 2. Permanent
To install the extension permanently, you need to **sign the `.xpi` file via Mozilla Add-ons (AMO)**:  
1. Create an account at [addons.mozilla.org](https://addons.mozilla.org).  
2. Upload your `.zip` or `.xpi` archive.  
3. Mozilla will automatically sign the extension and provide a valid `.xpi`.  
4. This file can then be installed via **Install Add-on From File...** in Firefox.

⚠ Trying to install an unsigned `.xpi` will result in the error **"appears to be corrupt"**.

---

## 🔑 API Key
The code uses a hardcoded VirusTotal API key:  
```
Limit: 4 checks per minute (~15,500 checks per month)
```

> If you need to change the key – replace the value of `VT_API_KEY` in `background.js`.

---

## 🗂 Project Structure
```
vt-checker/
├─ manifest.json        # Extension manifest
├─ background.js        # Background logic, VirusTotal API calls
├─ content.js           # Popup display logic near the cursor
└─ icons/               # VTLC icons in different sizes
```

---

## 📸 How it works
1. Right-click on any link.  
2. Select **“Check with VirusTotal”**.  
3. A popup will appear:
   - First with a spinner.  
   - Then with the result (green / yellow / red badge).  

---

## ⚠ Limitations
- The free VirusTotal API key has request limits.  
- Popup disappears after 3 seconds or when clicked.  
- Works only in Firefox (Manifest V2).  
