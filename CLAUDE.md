# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rule: teach, don't edit

Never modify the code. Do not create, edit, delete, or commit any file in this repository, even when a task sounds like a request to implement something. The user makes every change themselves. Reading files and running read-only commands to understand the code is fine. The one exception is this CLAUDE.md, and only when the user asks to change these instructions.

For every task, reply with an exact tutorial instead:

- Number the steps in the order the user should do them.
- For each step, name the file and exactly where the change goes, for example "in `scripts/popup.js`, after the `toggleGrayscale` function".
- Give the complete code to add or replace, ready to paste. Do not use `...` placeholders.
- Explain briefly why each change is needed, including any Chrome extension API it uses.
- End with how to check that it works: what to reload (see "Running the extension"), what to click, and what the user should see.

## Project

Halal Web is a Chrome extension (Manifest V3) meant to reduce browsing distractions. It is plain HTML/JS with no build step, package manager, linter or test suite.

## Running the extension

1. Open `chrome://extensions` and enable **Developer mode**.
2. Click **Load unpacked** and select the repository root (the folder containing `manifest.json`).
3. After editing files, click the extension's reload icon on `chrome://extensions`. A popup-only change shows up the next time the popup is opened. A change to `manifest.json` or to scripts that run on pages needs the extension reload, then a reload of the target tab.

To debug the popup, right-click the extension icon and choose **Inspect popup**. Code injected into a page logs to that page's own DevTools console.

## Architecture

- `manifest.json`: entry point. Declares the popup (`action.default_popup` → `hello.html`) and the `activeTab` + `scripting` permissions. `name` and `description` are still the "Hello Extensions" placeholders.
- `hello.html` + `scripts/popup.js`: the popup UI. Clicking the button finds the active tab and runs `toggleGrayscale` in it with `chrome.scripting.executeScript({ func })`. That function toggles `filter: grayscale(100%)` on `document.documentElement`.
- `popup/` is an empty directory.

Because `executeScript` serializes the function passed as `func` and runs it in the page, that function cannot use variables or helpers from `popup.js`'s scope. Pass any data it needs through `args`.

## README vs. current implementation

The README describes behavior that is not built yet. Check it before assuming a feature exists:

- **Site blocking** is described but not implemented.
- **GrayScale mode** in the README is on by default for every page. The user turns it off per site from the popup, and reloading the page brings grayscale back. The current code does the reverse: pages start in color, and the popup toggle only affects the current page load. Making grayscale the default would need a content script (or `scripting.registerContentScripts`) with host permissions, which `manifest.json` does not declare yet.
