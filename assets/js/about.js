const themeToggle = document.getElementById("theme-toggle");
const rootEl = document.documentElement;

function applyTheme(theme) {
  if (theme === "dark") {
    rootEl.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.setAttribute("aria-pressed", "true");
  } else {
    rootEl.removeAttribute("data-theme");
    if (themeToggle) themeToggle.setAttribute("aria-pressed", "false");
  }
}

try {
  const saved = localStorage.getItem("theme");
  if (saved) {
    applyTheme(saved);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }
} catch (e) {}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = rootEl.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });
}
