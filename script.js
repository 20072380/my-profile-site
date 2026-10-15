// ==========================================
// 프로젝트 데이터 (여기만 수정하면 카드가 바뀝니다)
// ==========================================
const projects = [
  {
    icon: "🏪",
    title: "롯데잇츠 운영 관리",
    period: "2025 - 현재",
    description: "매장 운영 흐름을 정리하고 현장 업무를 효율화하는 업무를 맡고 있습니다.",
    tags: ["운영", "프로세스 개선"],
    link: "#contact",
  },
  {
    icon: "🍃",
    title: "Spring 웹 서비스",
    period: "예시",
    description: "Spring 기반 백엔드 API 서버를 설계하고 구현한 예시 프로젝트입니다.",
    tags: ["Spring", "REST API"],
    link: "#contact",
  },
  {
    icon: "🌐",
    title: "개인 프로필 사이트",
    period: "2026",
    description: "HTML, JavaScript, Tailwind CSS로 만든 이 프로필 웹사이트입니다.",
    tags: ["HTML", "JavaScript", "Tailwind"],
    link: "#top",
  },
];

// 태그 공통 스타일
const tagClass = "bg-brand-500/10 text-brand-600 dark:text-brand-400";

// ==========================================
// 유틸
// ==========================================
const $ = (selector) => document.querySelector(selector);

// HTML 주입 방지를 위해 텍스트는 이스케이프 후 사용
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ==========================================
// 프로젝트 카드 렌더링
// ==========================================
function renderProjects() {
  const grid = $("#project-grid");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (project) => `
      <article class="project-card reveal group rounded-3xl bg-white dark:bg-slate-800 p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-glow">
        <div class="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/10 text-xl">${escapeHtml(project.icon)}</div>
        <p class="mt-5 text-xs text-ink-500 dark:text-slate-400">${escapeHtml(project.period)}</p>
        <h3 class="mt-1 font-display text-xl font-bold transition group-hover:text-brand-500">${escapeHtml(project.title)}</h3>
        <p class="mt-3 flex-1 text-sm leading-relaxed text-ink-700 dark:text-slate-300">${escapeHtml(project.description)}</p>
        <div class="mt-5 flex flex-wrap gap-2">
          ${project.tags
            .map((tag) => `<span class="rounded-full px-2.5 py-1 text-xs font-semibold ${tagClass}">${escapeHtml(tag)}</span>`)
            .join("")}
        </div>
        <a href="${escapeHtml(project.link)}" class="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-500 hover:underline">
          자세히 보기 →
        </a>
      </article>`
    )
    .join("");
}

// ==========================================
// 토스트 메시지
// ==========================================
let toastTimer = null;

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("translate-y-16", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add("translate-y-16", "opacity-0");
    toast.classList.remove("translate-y-0", "opacity-100");
  }, 2000);
}

// ==========================================
// 모바일 메뉴
// ==========================================
function setupMobileMenu() {
  const toggle = $("#menu-toggle");
  const menu = $("#mobile-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("hidden") === false;
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
    toggle.textContent = isOpen ? "✕" : "☰";
  });

  // 메뉴 링크 클릭 시 닫기
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    });
  });
}

// ==========================================
// 다크모드 (localStorage 실패 시 무시)
// ==========================================
function applyTheme(isDark) {
  document.documentElement.classList.toggle("dark", isDark);
}

function setupThemeToggle() {
  const toggle = $("#theme-toggle");
  if (!toggle) return;

  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {
    // 저장소 접근이 막혀 있으면 시스템 설정을 따름
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved ? saved === "dark" : prefersDark);

  toggle.addEventListener("click", () => {
    const isDark = !document.documentElement.classList.contains("dark");
    applyTheme(isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (e) {
      // 저장 실패 시 무시
    }
  });
}

// ==========================================
// 이메일 복사 (히어로 아이콘 버튼 + 하단 버튼)
// ==========================================
function setupCopyEmail() {
  const email = "20072380@naver.com";
  const buttons = document.querySelectorAll("#copy-email, #copy-email-bottom");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        showToast("이메일 주소가 복사되었습니다");
      } catch (e) {
        showToast("복사에 실패했습니다. 직접 복사해 주세요");
      }
    });
  });
}

// ==========================================
// 스크롤 스파이: 현재 섹션의 메뉴에 활성 표시
// ==========================================
function setupScrollSpy() {
  const links = document.querySelectorAll("[data-nav]");
  const sections = [...links]
    .map((link) => document.getElementById(link.dataset.nav))
    .filter(Boolean);
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.dataset.nav === entry.target.id);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

// ==========================================
// 스크롤 reveal + 기술 바 애니메이션
// ==========================================
function setupReveal() {
  const targets = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");

        // 기술 바 채우기
        entry.target.querySelectorAll(".skill-bar > span").forEach((bar) => {
          bar.style.width = `${bar.dataset.level}%`;
        });

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

// ==========================================
// 초기화
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  setupThemeToggle();
  setupMobileMenu();
  setupCopyEmail();
  setupScrollSpy();
  setupReveal();
});
