/* ==========================================================================
   Liana Dias Nutri — interações
   Para trocar o número do WhatsApp, altere apenas a linha abaixo
   (formato internacional, só números: 55 + DDD + número).
   ========================================================================== */
const WHATSAPP = "5521991571424";

document.documentElement.classList.add("js");

/* Links de WhatsApp com mensagem pronta (atributo data-wa) */
document.querySelectorAll("[data-wa]").forEach((link) => {
  const msg = encodeURIComponent(link.dataset.wa);
  link.href = `https://wa.me/${WHATSAPP}?text=${msg}`;
});

/* Menu do celular */
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  nav.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) {
    setMenu(false);
    toggle.focus();
  }
});
window.matchMedia("(min-width: 921px)").addEventListener("change", (e) => e.matches && setMenu(false));

/* Topo com sombra ao rolar + botão flutuante do WhatsApp */
const header = document.querySelector(".site-header");
const waFloat = document.querySelector(".wa-float");
const hero = document.querySelector(".hero");

new IntersectionObserver(([entry]) => {
  waFloat.classList.toggle("is-visible", !entry.isIntersecting);
}, { threshold: 0.05 }).observe(hero);

const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Destaque do item de menu da seção visível */
const navLinks = [...document.querySelectorAll('.site-nav ul a[href^="#"]')];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => {
      if (a.getAttribute("href") === `#${entry.target.id}`) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  });
}, { rootMargin: "-45% 0px -50% 0px" });
[hero, ...sections].forEach((s) => sectionObserver.observe(s));

/* Animações de entrada */
const reveals = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((el) => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  reveals.forEach((el) => io.observe(el));
}

/* Ano atual no rodapé */
const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
