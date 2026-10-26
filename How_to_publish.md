## Publishing

### 1. Build the zip (in the repo folder)

```sh
zip -r ../halal-web-1.0.zip manifest.json popup.html scripts styles images/icon16.png images/icon32.png images/icon48.png images/icon128.png
```

This puts `manifest.json` at the top level of the zip, which the store requires. It leaves out `.git`, `.DS_Store`, `CLAUDE.md`, the README and the large `icon.png`.

### 2. Register as a developer

Open the Chrome Web Store Developer Dashboard, accept the developer agreement and pay the one-time registration fee. You can't change the email address later, so pick one you'll keep.

### 3. Upload the zip and fill in **Store listing**

- **Detailed description:** describe only grayscale. Leave out site blocking, because it isn't built yet and a listing that promises missing features can be rejected.
- **Category and language.**
- **Icon:** `images/icon128.png`.
- **Screenshot (required):** at least one, sized 1280×800 or 640×400. A gray page with the popup open works well.
- **Small promo tile, 440×280:** optional. Without it, your extension is listed below ones that have one.

### 4. Fill in **Privacy practices**

- **Single purpose:** "Shows websites in grayscale to reduce visual distraction."
- **`activeTab`:** "Lets the popup read and change the grayscale setting of the tab the user is viewing, only when the user opens the popup."
- **`scripting`:** "When the popup opens, runs a small function in the current tab to check whether grayscale is on. When the user flips the Grayscale switch, runs a function that turns grayscale on or off in that tab."
- **Host access** (the content script runs on all http/https sites): "The content script applies the grayscale filter to every page the user visits; this is the extension's core feature." Access to all sites may mean a longer review, which is normal for this kind of extension.
- **Remote code:** "No, I am not using remote code."
- **Data usage:** tick nothing and check the certification boxes. The extension doesn't collect user data, so it shouldn't need a privacy policy.

### 5. In **Distribution**, choose Public or Unlisted, then **Submit for review**

---

## How to check it before submitting

1. On `chrome://extensions`, click the reload icon on Halal Web.
2. Open a colorful site, such as a news site. It should be gray from the first moment, with no flash of color.
3. Click the extension icon. The popup shows **Grayscale** with the switch on. Click the switch: it slides off and the page turns to color. Close and reopen the popup: the switch is still off. Reload the page: it's gray again and the switch is back on.
4. Open a new tab and click the icon. The switch is faded and can't be clicked, and "Grayscale can't be changed on this page." appears under it.
5. Test the zip itself: unzip it into a new folder, remove the dev copy, and use **Load unpacked** on the unzipped folder. If steps 2–4 still work, the zip is complete.

Your [CLAUDE.md](CLAUDE.md) still says grayscale-by-default isn't built, which is no longer true. I can update it if you'd like.

## References

- [Chrome Web Store images](https://developer.chrome.com/docs/webstore/images)
- [Privacy practices tab](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [Register a developer account](https://developer.chrome.com/docs/webstore/register)
