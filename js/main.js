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

/* Barra de progresso de leitura */
const progress = document.querySelector(".scroll-progress");
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.setProperty("--progress", max > 0 ? (scrollY / max).toFixed(4) : 0);
};
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

/* Efeitos que dependem do mouse (somente em computador e sem "reduzir movimento") */
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (finePointer && !reduceMotion) {
  // Profundidade na abertura: retrato e ramos se movem em camadas
  const layers = hero.querySelectorAll("[data-depth]");
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    layers.forEach((el) => {
      const d = Number(el.dataset.depth);
      el.style.transform = `translate3d(${(x * d).toFixed(2)}px, ${(y * d).toFixed(2)}px, 0)`;
    });
  });
  hero.addEventListener("pointerleave", () => layers.forEach((el) => (el.style.transform = "")));

  // Inclinação e brilho nos cards de serviço
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--ry", `${((x - 0.5) * 6).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${((0.5 - y) * 6).toFixed(2)}deg`);
      card.style.setProperty("--px", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--py", `${(y * 100).toFixed(1)}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--rx");
      card.style.removeProperty("--ry");
    });
  });

  // Luz que acompanha o cursor na seção Filosofia
  const philosophy = document.querySelector(".philosophy");
  philosophy.addEventListener("pointermove", (e) => {
    const r = philosophy.getBoundingClientRect();
    philosophy.style.setProperty("--mx", `${e.clientX - r.left}px`);
    philosophy.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
}

/* Cursor com anel dourado e botões magnéticos (somente computador) */
if (finePointer && !reduceMotion) {
  const cursor = document.querySelector(".cursor");
  document.documentElement.classList.add("has-cursor");
  let tx = -100, ty = -100, cx = -100, cy = -100;
  window.addEventListener("pointermove", (e) => {
    tx = e.clientX; ty = e.clientY;
    cursor.classList.add("is-active");
    cursor.classList.toggle("is-hover", !!e.target.closest("a, button, summary, label, [role='tab']"));
  }, { passive: true });
  document.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
  (function follow() {
    cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
    cursor.style.setProperty("--cx", `${cx.toFixed(1)}px`);
    cursor.style.setProperty("--cy", `${cy.toFixed(1)}px`);
    requestAnimationFrame(follow);
  })();

  document.querySelectorAll(".btn-primary, .btn-gold").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
    btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
  });
}

/* Teste "Qual formato combina com você?" */
const quiz = document.querySelector(".quiz");
if (quiz) {
  const steps = [...quiz.querySelectorAll(".quiz-step")];
  const result = quiz.querySelector(".quiz-result");
  const back = quiz.querySelector(".quiz-back");
  const form = quiz.querySelector(".quiz-form");
  const RESULTS = [
    { title: "Consulta avulsa", text: "Um bom ponto de partida para quem busca orientação pontual e um plano alimentar individualizado." },
    { title: "Acompanhamento trimestral", text: "Três meses para iniciar a mudança de hábitos, com retornos e ajustes próximos ao longo do processo." },
    { title: "Acompanhamento semestral", text: "Seis meses para consolidar hábitos, sair do ciclo de restrição e ganhar autonomia nas escolhas." },
    { title: "Acompanhamento anual", text: "Doze meses de apoio contínuo para manter a constância nas diferentes fases da rotina." },
  ];
  let current = 0;

  const show = (i) => {
    current = i;
    steps.forEach((st, k) => (st.hidden = k !== i));
    result.hidden = i < steps.length;
    back.hidden = i === 0 || i >= steps.length;
    quiz.style.setProperty("--quiz", Math.min(i, steps.length) / steps.length);
  };

  const finish = () => {
    const score = steps.reduce((sum, st) => sum + Number(st.querySelector("input:checked")?.value || 0), 0);
    const r = RESULTS[score <= 1 ? 0 : score <= 3 ? 1 : score <= 5 ? 2 : 3];
    result.querySelector(".quiz-result-title").textContent = r.title;
    result.querySelector(".quiz-result-text").textContent = r.text;
    const msg = `Olá, Liana! Fiz o teste no site e a sugestão foi: ${r.title}. Gostaria de saber mais.`;
    result.querySelector(".quiz-cta").href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    show(steps.length);
    result.querySelector(".quiz-result-title").focus({ preventScroll: true });
  };

  // Avança ao clicar (mouse, toque, Espaço) ou com Enter; as setas só trocam a opção marcada
  let arrowAt = 0;
  const advance = () => setTimeout(() => (current < steps.length - 1 ? show(current + 1) : finish()), 320);
  form.addEventListener("keydown", (e) => {
    if (e.key.startsWith("Arrow")) arrowAt = Date.now();
    if (e.key === "Enter" && e.target.matches("input[type=radio]:checked")) {
      e.preventDefault();
      advance();
    }
  });
  form.addEventListener("click", (e) => {
    if (!e.target.matches("input[type=radio]") || Date.now() - arrowAt < 100) return;
    advance();
  });
  form.addEventListener("submit", (e) => e.preventDefault());
  back.addEventListener("click", () => show(Math.max(0, current - 1)));
  quiz.querySelector(".quiz-restart").addEventListener("click", () => {
    form.reset();
    show(0);
    steps[0].querySelector("input").focus({ preventScroll: true });
  });
}

/* Abas "Fome física ou fome emocional?" */
const hunger = document.querySelector(".hunger");
if (hunger) {
  const tabs = [...hunger.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    hunger.dataset.active = tab.id.replace("tab-", "");
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        select(tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length], true);
      }
    });
  });
}

/* Ano atual no rodapé */
const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
