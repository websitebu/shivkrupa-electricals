const filterButtons = document.querySelectorAll(".filter-button");
const productCards = document.querySelectorAll(".product-card");
const searchInput = document.querySelector("#product-search");
const emptyState = document.querySelector("#empty-state");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
let activeFilter = "all";

productCards.forEach((card) => {
  const productName = card.querySelector("h3").textContent.trim();
  const message = `नमस्कार, मला ${productName} ची किंमत जाणून घ्यायची आहे. कृपया माहिती द्या.`;
  const whatsappUrl = `https://wa.me/919552659341?text=${encodeURIComponent(message)}`;

  card.querySelectorAll("a").forEach((link) => {
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `${productName} ची किंमत WhatsApp वर विचारा`);
  });
});

function updateProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  productCards.forEach((card) => {
    const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
    const matchesSearch = card.dataset.name.toLowerCase().includes(searchTerm);
    const isVisible = matchesCategory && matchesSearch;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      filterButton.classList.toggle("is-active", filterButton === button);
    });
    updateProducts();
  });
});

searchInput.addEventListener("input", updateProducts);

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  });
});

const carousel = document.querySelector(".hero-carousel");
const slides = [...carousel.querySelectorAll(".carousel-slide")];
const carouselDots = [...carousel.querySelectorAll(".carousel-dots button")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeSlide = 0;
let isPlaying = !prefersReducedMotion.matches;
let isHovered = false;
let isFocused = false;
let carouselTimer;

function renderSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.hidden = !isActive;
    slide.classList.toggle("is-active", isActive);
    carouselDots[slideIndex].setAttribute("aria-current", String(isActive));
  });
}

function updateCarouselTimer() {
  window.clearInterval(carouselTimer);
  if (isPlaying && !isHovered && !isFocused && !document.hidden) {
    carouselTimer = window.setInterval(() => renderSlide(activeSlide + 1), 5000);
  }
}

carouselDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    renderSlide(index);
    updateCarouselTimer();
  });
});

carousel.addEventListener("mouseenter", () => {
  isHovered = true;
  updateCarouselTimer();
});

carousel.addEventListener("mouseleave", () => {
  isHovered = false;
  updateCarouselTimer();
});

carousel.addEventListener("focusin", () => {
  isFocused = true;
  updateCarouselTimer();
});

carousel.addEventListener("focusout", (event) => {
  if (!carousel.contains(event.relatedTarget)) {
    isFocused = false;
    updateCarouselTimer();
  }
});

document.addEventListener("visibilitychange", updateCarouselTimer);
renderSlide(activeSlide);
updateCarouselTimer();

document.querySelector("#current-year").textContent = new Date().getFullYear();
