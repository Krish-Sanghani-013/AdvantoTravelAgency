document.addEventListener("DOMContentLoaded", function () {
  const waveText = document.getElementById("wave-text");

  if (waveText) {
    function wrapTextNodes(element) {
      let charIndex = 0;

      function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const fragment = document.createDocumentFragment();

          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === " ") {
              fragment.appendChild(document.createTextNode(" "));
            } else {
              const span = document.createElement("span");
              span.className = "wave-char";
              span.style.animationDelay = `${(charIndex * 0.05).toFixed(2)}s`;
              span.textContent = char;
              fragment.appendChild(span);
              charIndex++;
            }
          }

          node.parentNode.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const children = Array.from(node.childNodes);
          children.forEach((child) => processNode(child));
        }
      }

      processNode(element);
    }

    wrapTextNodes(waveText);
  }
});

const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggle.setAttribute("aria-pressed", savedTheme === "dark");

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.setAttribute("aria-pressed", newTheme === "dark");
  });
}
