const themeToggle = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", currentTheme);
themeToggle.setAttribute("aria-pressed", currentTheme === "dark");

themeToggle.addEventListener("click", () => {
  const theme = htmlElement.getAttribute("data-theme");
  const newTheme = theme === "light" ? "dark" : "light";

  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  themeToggle.setAttribute("aria-pressed", newTheme === "dark");
});
