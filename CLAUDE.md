# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rule: teach, don't edit

Never modify the code. Do not create, edit, delete, or commit any file in this repository, even when a task sounds like a request to implement something. The user makes every change themselves. Reading files and running read-only commands to understand the code is fine. The one exception is this CLAUDE.md, and only when the user asks to change these instructions.

For every task, reply with an exact tutorial instead:

- Number the steps in the order the user should do them.
- For each step, name the file and exactly where the change goes, for example "in `scripts/popup.js`, after the `setGrayscale` function".
- Give the complete code to add or replace, ready to paste. Do not use `...` placeholders.
- Explain briefly why each change is needed, including any Chrome extension API it uses.
- End with how to check that it works: what to reload (see "Running the extension"), what to click, and what the user should see.

## Project

Halal Web is a Chrome extension (Manifest V3) meant to reduce browsing distractions. It is plain HTML/CSS/JS with no build step, package manager, linter or test suite.

## Running the extension

1. Open `chrome://extensions` and enable **Developer mode**.
2. Click **Load unpacked** and select the repository root (the folder containing `manifest.json`).
3. After editing files, click the extension's reload icon on `chrome://extensions`. A change to `popup.html` or `scripts/popup.js` shows up the next time the popup is opened. A change to `manifest.json` or `styles/grayscale.css` needs the extension reload, then a reload of the target tab.

Tabs that were open before the extension was loaded or reloaded only pick up the grayscale CSS after a page reload. In such a tab the popup switch can show "on" while the page is in color, because the switch reads the page's attribute, not the filter that is actually applied.

To debug the popup, right-click the extension icon and choose **Inspect popup**. Code injected into a page logs to that page's own DevTools console.

## Architecture

- `manifest.json`: entry point. Declares the popup (`action.default_popup` → `popup.html`), a content script that injects `styles/grayscale.css` into every `http`/`https` page at `document_start`, and the `activeTab` + `scripting` permissions.
- `styles/grayscale.css`: grays the page with `html:not([data-halal-web-color]) { filter: grayscale(100%) !important; }`. Pages are gray by default. The `data-halal-web-color` attribute on `<html>` is the only on/off state: when it is present the page is in color. Nothing is saved, so a page reload removes the attribute and the page is gray again.
- `popup.html` + `scripts/popup.js`: the popup. One row with the text "Grayscale" and a switch (a hidden checkbox `#grayscaleToggle` styled as a track and knob).
  - When the popup opens, `init()` gets the active tab and runs `isGrayscaleOn` in it with `chrome.scripting.executeScript`. The return value (`results[0].result`) sets the switch.
  - On the switch's `change` event, it runs `setGrayscale` in the tab with `args: [toggle.checked]`, which adds or removes `data-halal-web-color`.
  - If the page doesn't allow extension scripts (`chrome://` pages, the Chrome Web Store), `executeScript` throws. `showError` then disables the switch and shows a message in `#message`.
- `popup/` is an empty directory.
- `How_to_publish.md`: Chrome Web Store publishing steps. Its `zip` command lists every file and directory that ships, so a new file the extension needs must also be added there.

Because `executeScript` serializes the function passed as `func` and runs it in the page, that function cannot use variables or helpers from `popup.js`'s scope. Pass any data it needs through `args`.

## README vs. current implementation

The README describes behavior that is not built yet. Check it before assuming a feature exists:

- **Site blocking** is described but not implemented.
- **GrayScale mode** matches the README: on by default for every page, turned off per page from the popup, and back on after a page reload.
