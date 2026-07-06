const navItems = [
  { href: "/", label: "Home", key: "home" },
  { href: "/about/", label: "About", key: "about" },
  { href: "/work/", label: "Work", key: "work" },
  { href: "/contact/", label: "Contact", key: "contact" },
];

const BRAND_MARK = `
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M4 22 Q10 24 16 20 Q22 16 28 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    <path d="M4 26 Q10 27.5 16 25 Q22 22.5 28 24" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.55" />
    <circle cx="9" cy="12" r="1.6" fill="currentColor" />
    <path d="M9 12 L23 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    <circle cx="23" cy="9" r="1.6" fill="currentColor" />
  </svg>
`;

const ICON_SUN = `
  <svg class="icon-sun" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.6" />
    <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
      <path d="M12 2.5v2.4" />
      <path d="M12 19.1v2.4" />
      <path d="M4.2 4.2l1.7 1.7" />
      <path d="M18.1 18.1l1.7 1.7" />
      <path d="M2.5 12h2.4" />
      <path d="M19.1 12h2.4" />
      <path d="M4.2 19.8l1.7-1.7" />
      <path d="M18.1 5.9l1.7-1.7" />
    </g>
  </svg>
`;

const ICON_MOON = `
  <svg class="icon-moon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M20 14.2A8.4 8.4 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linejoin="round"
    />
  </svg>
`;

function getStoredTheme() {
  try {
    return localStorage.getItem("bk-theme");
  } catch (err) {
    return null;
  }
}

function setStoredTheme(theme) {
  try {
    localStorage.setItem("bk-theme", theme);
  } catch (err) {
    /* ignore */
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function initTheme() {
  const stored = getStoredTheme();
  if (stored === "dark" || stored === "light") {
    applyTheme(stored);
    return;
  }
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

initTheme();

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute("active") ?? "home";
    this.innerHTML = `
      <header class="topbar">
        <a class="brand" href="/">
          <span class="brand-mark">${BRAND_MARK}</span>
          Brian Kramer
        </a>
        <div class="nav-group">
          <nav class="nav" aria-label="Primary">
            ${navItems
              .map(
                (item) => `
                  <a
                    href="${item.href}"
                    class="${item.key === active ? "is-active" : ""}"
                    ${item.key === active ? 'aria-current="page"' : ""}
                  >
                    ${item.label}
                  </a>
                `
              )
              .join("")}
          </nav>
          <button type="button" class="theme-toggle" aria-label="Toggle color theme">
            ${ICON_MOON}
            ${ICON_SUN}
          </button>
        </div>
      </header>
    `;

    const toggle = this.querySelector(".theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const next = currentTheme() === "dark" ? "light" : "dark";
        applyTheme(next);
        setStoredTheme(next);
      });
    }
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <span>Naples, FL — automotive retail &amp; dealership technology</span>
        <span>© <span class="current-year"></span> Brian Kramer</span>
      </footer>
    `;
    const yearEl = this.querySelector(".current-year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);

const reveals = Array.from(document.querySelectorAll(".reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.14 }
  );

  for (const node of reveals) {
    observer.observe(node);
  }
} else {
  for (const node of reveals) {
    node.classList.add("is-visible");
  }
}
