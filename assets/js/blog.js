const themeToggle = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const theme = savedTheme || (prefersDark ? "dark" : "light");
  setTheme(theme);
}

function setTheme(theme) {
  if (theme === "dark") {
    htmlElement.setAttribute("data-theme", "dark");
    themeToggle?.setAttribute("aria-pressed", "true");
  } else {
    htmlElement.removeAttribute("data-theme");
    themeToggle?.setAttribute("aria-pressed", "false");
  }

  localStorage.setItem("theme", theme);
}

themeToggle?.addEventListener("click", () => {
  const currentTheme = htmlElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
});

initTheme();
