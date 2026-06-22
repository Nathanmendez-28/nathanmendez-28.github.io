const loader = document.querySelector("#loader");
const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const themeToggle = document.querySelector("#themeToggle");
const year = document.querySelector("#year");
const modal = document.querySelector("#imageModal");
const modalImage = document.querySelector("#modalImage");
const modalClose = document.querySelector("#modalClose");
const galleryItems = document.querySelectorAll(".gallery-item");
const filterButtons = document.querySelectorAll(".filter-button");
const blogSearch = document.querySelector("#blogSearch");
const blogCategory = document.querySelector("#blogCategory");
const blogCards = document.querySelectorAll(".blog-card");

window.addEventListener("load", () => {
  loader?.classList.add("is-hidden");
});

year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
});

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.dataset.image;
    if (!image) return;
    modalImage.src = image;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    modalClose.focus();
  });
});

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
}

modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    document.querySelectorAll("#gallery .gallery-item").forEach((item) => {
      const shouldShow = filter === "all" || item.dataset.category === filter;
      item.hidden = !shouldShow;
    });
  });
});

function filterBlogPosts() {
  const searchTerm = blogSearch.value.trim().toLowerCase();
  const category = blogCategory.value;

  blogCards.forEach((card) => {
    const matchesSearch = card.textContent.toLowerCase().includes(searchTerm);
    const matchesCategory = category === "all" || card.dataset.category === category;
    card.hidden = !(matchesSearch && matchesCategory);
  });
}

blogSearch?.addEventListener("input", filterBlogPosts);
blogCategory?.addEventListener("change", filterBlogPosts);

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  alert("This form is ready for future integration. For now, please use the email link.");
});
