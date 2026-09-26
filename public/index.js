const form = document.getElementById("proxy-form");
const address = document.getElementById("proxy-address");
const frameElement = document.getElementById("proxy-frame");
const status = document.getElementById("browser-status");
const directLink = document.getElementById("open-direct");
const proxiedLink = document.getElementById("open-proxied");
const clearSessionButton = document.getElementById("clear-session");
const errorPanel = document.getElementById("error-panel");
const errorTitle = document.getElementById("error-title");

let controller;
let frame;

function updateProxiedLink(url) {
  if (!frame || !controller) return;
  const proxiedPath = `${frame.prefix}${controller.config.codec.encode(url)}`;
  proxiedLink.href = new URL(proxiedPath, location.origin).href;
  proxiedLink.hidden = false;
}

async function initialize() {
  controller = await initBootstrap();
  const urlWatcher = new $scramjetUtils.UrlWatcherPlugin((url) => {
    address.value = url;
    directLink.href = url;
    updateProxiedLink(url);
    status.textContent = "Connected";
  });

  frame = controller.createFrame(frameElement, { plugins: [urlWatcher] });
}

function getTarget(value) {
  const input = value.trim();
  if (!input) return null;

  let target = input;
  if (!/^[a-z][a-z\d+.-]*:/i.test(target)) {
    target = /^(localhost(?::\d+)?|(?:[\w-]+\.)+[a-z]{2,}(?::\d+)?(?:\/.*)?)$/i.test(target)
      ? `https://${target}`
      : `https://www.google.com/search?q=${encodeURIComponent(target)}`;
  }

  try {
    const parsed = new URL(target);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : null;
  } catch {
    return null;
  }
}

async function navigate(value) {
  const target = getTarget(value);
  if (!target) {
    status.textContent = "Enter a valid HTTP or HTTPS address";
    return;
  }

  try {
    status.textContent = "Connecting…";
    errorPanel.hidden = true;
    if (!frame) await initialize();
    address.value = target;
    directLink.href = target;
    await frame.go(target);
    updateProxiedLink(target);
    status.textContent = "Connected";
  } catch (error) {
    status.textContent = "Could not connect";
    errorTitle.textContent = error instanceof Error ? error.message : "This page could not be opened.";
    errorPanel.hidden = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  navigate(address.value);
});

clearSessionButton.addEventListener("click", async () => {
  const confirmed = window.confirm(
    "Clear this proxy's saved sign-in data and local storage? This cannot erase browser-wide history or sign-in records kept by websites."
  );
  if (!confirmed) return;

  clearSessionButton.disabled = true;
  status.textContent = "Clearing saved session…";
  try {
    const response = await fetch("/api/reset", { method: "POST" });
    if (!response.ok) throw new Error("Reset request failed");
    window.location.replace("/");
  } catch {
    clearSessionButton.disabled = false;
    status.textContent = "Could not clear saved session";
  }
});

navigate("https://www.google.com/");