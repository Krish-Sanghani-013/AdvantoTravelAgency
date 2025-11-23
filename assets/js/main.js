const themeToggle = document.getElementById("theme-toggle");
const rootEl = document.documentElement;

function initPreloader() {
  const preloader = document.getElementById("preloader");
  const preloaderBar = document.getElementById("preloaderBar");
  const preloaderPercentage = document.getElementById("preloaderPercentage");

  if (!preloader) return;

  let progress = 0;
  let hasCompleted = false;

  const progressInterval = setInterval(() => {
    if (progress < 85) {
      const increment = Math.random() * 10 + 2;
      progress = Math.min(progress + increment, 85);
      preloaderBar.style.width = progress + "%";
      preloaderPercentage.textContent = Math.floor(progress) + "%";
    }
  }, 350);

  function completePreloader() {
    if (hasCompleted) return;
    hasCompleted = true;

    clearInterval(progressInterval);

    preloaderBar.style.width = "100%";
    preloaderPercentage.textContent = "100%";

    setTimeout(() => {
      const tl = gsap.timeline();

      tl.to(
        preloader,
        {
          opacity: 0,
          duration: 1.1,
          ease: "power2.inOut",
        },
        0
      );

      tl.to(
        "body",
        {
          onStart: () => {
            document.body.classList.remove("preloader-active");
          },
        },
        0
      );

      tl.to(
        "nav, header, section, footer",
        {
          opacity: 1,
          visibility: "visible",
          duration: 0.6,
          stagger: 0.02,
          ease: "power1.inOut",
        },
        0
      );

      tl.to(
        preloader,
        {
          onComplete: () => {
            preloader.style.display = "none";
            preloader.style.pointerEvents = "none";
          },
        },
        0.8
      );
    }, 800);
  }

  if (document.readyState === "complete") {
    completePreloader();
  } else {
    window.addEventListener("load", completePreloader, { once: true });
  }

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      if (progress < 80) {
        progress = 80;
        preloaderBar.style.width = progress + "%";
        preloaderPercentage.textContent = Math.floor(progress) + "%";
      }

      setTimeout(() => {
        if (!hasCompleted) {
          completePreloader();
        }
      }, 3200);
    },
    { once: true }
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPreloader, { once: true });
} else {
  initPreloader();
}

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

(function () {
  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.querySelector(".header__container");
  const plane = document.querySelector(".header__content img");

  function handleParallax(e) {
    if (!header || reduce) return;
    const rect = header.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = (e.clientX || (e.touches && e.touches[0].clientX) || cx) - cx;
    const y = (e.clientY || (e.touches && e.touches[0].clientY) || cy) - cy;
    const rx = (y / rect.height) * 6;
    const ry = (x / rect.width) * -8;
    header.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    if (plane) {
      const px = (x / rect.width) * 18;
      const py = (y / rect.height) * -10;
      plane.style.transform = `translate3d(${px}px, ${py}px, 40px) rotate(-10deg)`;
    }
  }

  function resetParallax() {
    if (!header) return;
    header.style.transform = "";
    if (plane) plane.style.transform = "";
  }
  if (header) {
    header.addEventListener("mousemove", handleParallax);
    header.addEventListener("touchmove", handleParallax, { passive: true });
    header.addEventListener("mouseleave", resetParallax);
    header.addEventListener("touchend", resetParallax);
  }

  const ioOptions = {
    root: null,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.12,
  };
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add("in-view");
        if (el.classList.contains("stagger")) {
          Array.from(el.children).forEach((child, i) => {
            child.style.animationDelay = `${i * 80}ms`;
          });
        }
        obs.unobserve(el);
      }
    });
  }, ioOptions);

  document.querySelectorAll(".stagger").forEach((el) => io.observe(el));

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelectorAll(".nav__links a");
  if (menuToggle) {
    menuToggle.addEventListener("change", () => {
      if (menuToggle.checked) {
        navLinks.forEach((a, i) => {
          a.style.transition = `transform 300ms cubic-bezier(.2,.9,.2,1) ${
            i * 60
          }ms, opacity 250ms ${i * 60}ms`;
          a.style.transform = "translateY(0)";
          a.style.opacity = "1";
        });
      } else {
        navLinks.forEach((a) => {
          a.style.transform = "";
          a.style.opacity = "";
          a.style.transition = "";
        });
      }
    });
  }

  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrolled + "%";
  });

  const scrollAnimConfig = {
    threshold: [0, 0.15, 0.3],
    rootMargin: "0px 0px -15% 0px",
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add("active");

        if (el.classList.contains("scroll-animate")) {
          let animClass = "scroll-animate--slide-up";
          if (el.classList.contains("scroll-animate--left"))
            animClass = "scroll-animate--left";
          else if (el.classList.contains("scroll-animate--right"))
            animClass = "scroll-animate--right";
          else if (el.classList.contains("scroll-animate--scale"))
            animClass = "scroll-animate--scale";
          else if (el.classList.contains("scroll-animate--rotate"))
            animClass = "scroll-animate--rotate";
          else if (el.classList.contains("scroll-animate--bounce"))
            animClass = "scroll-animate--bounce";
          else if (el.classList.contains("scroll-animate--zoom"))
            animClass = "scroll-animate--zoom";

          el.style.animation = window.getComputedStyle(
            document.querySelector("." + animClass)
          ).animation;
        }

        if (el.classList.contains("parallax-element")) {
          const startParallax = () => {
            const scrollPos = window.scrollY;
            const elementPos = el.getBoundingClientRect().top + scrollPos;
            const distance = scrollPos - elementPos;
            const parallaxOffset = Math.max(-50, Math.min(50, distance * 0.3));
            el.style.transform = `translateY(${parallaxOffset}px)`;
          };
          window.addEventListener("scroll", startParallax, { passive: true });
          startParallax();
        }

        if (el.classList.contains("count-up")) {
          const finalValue =
            parseInt(el.textContent.replace(/[^0-9]/g, "")) || 0;
          let currentValue = 0;
          const increment = Math.ceil(finalValue / 60);
          const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
              currentValue = finalValue;
              clearInterval(timer);
            }
            el.textContent = currentValue.toLocaleString("en-IN");
          }, 16);
        }

        if (el.classList.contains("card-group")) {
          el.classList.add("active");
          const cards = el.querySelectorAll("> div, > .tour__card");
          cards.forEach((card, idx) => {
            card.style.animation =
              "slideInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            card.style.animationDelay = `${idx * 0.1}s`;
            card.style.animationFillMode = "both";
          });
        }

        scrollObserver.unobserve(el);
      }
    });
  }, scrollAnimConfig);

  document
    .querySelectorAll(
      '[class*="scroll-animate"], .card-group, .count-up, .parallax-element'
    )
    .forEach((el) => {
      scrollObserver.observe(el);
    });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  if (!reduce) {
    document.addEventListener("mousemove", (e) => {
      const parallaxElements = document.querySelectorAll(".about__image img");
      parallaxElements.forEach((el) => {
        const speed = el.dataset.speed || 5;
        const x = (window.innerWidth - e.clientX * speed) / 100;
        const y = (window.innerHeight - e.clientY * speed) / 100;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  const initializeStaggerAnimations = () => {
    document
      .querySelectorAll(
        ".destination__grid, .blog__grid, .tour__container .swiper-wrapper"
      )
      .forEach((container) => {
        const children = container.querySelectorAll("> div, > .tour__card");
        children.forEach((child, index) => {
          if (!child.classList.contains("scroll-animate")) {
            child.classList.add("scroll-animate", "scroll-animate--slide-up");
            child.classList.add(`stagger-${Math.min(index + 1, 5)}`);
            scrollObserver.observe(child);
          }
        });
      });
  };

  initializeStaggerAnimations();

  let lastScrollTop = 0;
  let scrollVelocity = 0;
  window.addEventListener(
    "scroll",
    () => {
      const st = window.scrollY;
      scrollVelocity = st - lastScrollTop;
      lastScrollTop = st;
    },
    { passive: true }
  );

  document
    .querySelectorAll(".destination__card, .blog__card, .tour__card")
    .forEach((card) => {
      card.addEventListener("mouseenter", function () {
        if (!reduce) {
          const shimmerEl = document.createElement("div");
          shimmerEl.style.cssText = `
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 0.8s;
          pointer-events: none;
        `;
          this.style.position = "relative";
          this.style.overflow = "hidden";
          this.appendChild(shimmerEl);
          setTimeout(() => shimmerEl.remove(), 800);
        }
      });
    });

  document
    .querySelectorAll('input[type="search"], input[type="date"]')
    .forEach((input, idx) => {
      input.style.animationDelay = `${0.1 + idx * 0.1}s`;
      input.addEventListener("focus", function () {
        this.style.boxShadow = `0 0 20px rgba(1, 187, 191, 0.4)`;
      });
      input.addEventListener("blur", function () {
        this.style.boxShadow = "";
      });
    });

  document.querySelectorAll(".btn").forEach((btn, idx) => {
    btn.style.animationDelay = `${0.2 + idx * 0.1}s`;
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        width: 20px;
        height: 20px;
        animation: ripple-spread 0.6s ease-out;
        pointer-events: none;
      `;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  const footer = document.querySelector("footer");
  if (footer) {
    const footerLinks = footer.querySelectorAll("a");
    footerLinks.forEach((link, idx) => {
      link.style.animationDelay = `${0.4 + idx * 0.1}s`;
      link.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-3px)";
        this.style.color = "var(--primary-color)";
      });
      link.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
      });
    });
  }

  document.querySelectorAll(".section__description").forEach((desc, idx) => {
    desc.style.animation = "slideInUp 0.8s ease-out";
    desc.style.animationDelay = `${0.2 + idx * 0.15}s`;
    desc.style.animationFillMode = "both";
  });

  document.querySelectorAll(".section__header").forEach((header, idx) => {
    header.style.animation = "slideInUp 0.8s ease-out";
    header.style.animationDelay = `${0.1 + idx * 0.15}s`;
    header.style.animationFillMode = "both";
  });

  document.querySelectorAll("img").forEach((img, idx) => {
    img.style.animation = "fadeInUp 0.8s ease-out";
    img.style.animationDelay = `${0.1 + (idx % 3) * 0.1}s`;
    img.style.animationFillMode = "both";
  });

  const planeImg = document.querySelector(".header__content img");
  if (planeImg) {
    planeImg.classList.add("float-element");
  }

  const navLogo = document.querySelector(".nav__logo img");
  if (navLogo) {
    navLogo.style.animation = "slideInDown 0.6s ease-out";
  }

  document.querySelectorAll("h1, h2, h3, h4").forEach((heading, idx) => {
    if (heading.textContent.length > 0) {
      const text = heading.textContent;
      heading.innerHTML = text
        .split("")
        .map(
          (char, i) =>
            `<span style="animation: fadeInUp 0.6s ease-out ${
              0.02 * i
            }s both;">${char}</span>`
        )
        .join("");
      heading.style.animation = "none";
      heading.style.animationDelay = `${idx * 0.1}s`;
    }
  });

  document
    .querySelectorAll(".primary-color, .count-up, .section__subheader")
    .forEach((el) => {
      el.classList.add("glow-element");
    });

  const formContainer = document.querySelector(".header__content form");
  if (formContainer) {
    formContainer.style.animation = "slideInUp 0.8s ease-out 1s both";
  }

  document
    .querySelectorAll("a:not(.btn), button:not(.btn), input")
    .forEach((el) => {
      el.style.transition = "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    });

  const aboutContent = document.querySelector(".about__content");
  if (aboutContent) {
    aboutContent.style.animation = "slideInRight 0.8s ease-out";
  }

  const aboutImage = document.querySelector(".about__image");
  if (aboutImage) {
    aboutImage.style.animation = "slideInLeft 0.8s ease-out";
  }

  document.querySelectorAll(".btn-small").forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.animation = "pulse 0.6s ease-in-out";
    });
    btn.addEventListener("mouseleave", function () {
      this.style.animation = "";
    });
  });

  const datalist = document.getElementById("location-list");
  if (datalist) {
    const options = datalist.querySelectorAll("option");
    options.forEach((opt, idx) => {
      opt.style.animation = `slideInLeft 0.4s ease-out ${idx * 0.05}s both`;
    });
  }

  const cards = document.querySelectorAll(
    ".tour__card, .destination__card, .blog__card"
  );
  cards.forEach((card, idx) => {
    card.style.transition = "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-15px) scale(1.05) rotateZ(-1deg)";
      this.style.boxShadow = "0 20px 40px rgba(1, 187, 191, 0.3)";
    });
    card.addEventListener("mouseleave", function () {
      this.style.transform = "";
      this.style.boxShadow = "";
    });
  });

  console.info("🎬 Full Page Animation Suite Activated!");
})();
