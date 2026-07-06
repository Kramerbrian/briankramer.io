const navItems = [
  { href: "/", label: "Home", key: "home" },
  { href: "/about/", label: "About", key: "about" },
  { href: "/work/", label: "Work", key: "work" },
  { href: "/contact/", label: "Contact", key: "contact" },
];

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute("active") ?? "home";
    this.innerHTML = `
      <header class="topbar">
        <a class="brand" href="/">Brian Kramer</a>
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
      </header>
    `;
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <span>Built for briankramer.io</span>
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
