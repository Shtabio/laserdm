import { PRICES } from "./prices.js";

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");
const serviceGrid = document.querySelector("[data-service-grid]");
const priceTabs = document.querySelector("[data-price-tabs]");
const priceLists = document.querySelector("[data-price-lists]");
const searchInput = document.querySelector("[data-price-search]");

const formatPrice = (value) => {
  const number = Number(String(value).replace(/\s/g, ""));
  if (!Number.isFinite(number)) return String(value || "");
  return `${new Intl.NumberFormat("ru-RU").format(number)} ₽`;
};

const slugify = (value) => value
  .toLowerCase()
  .replace(/ё/g, "е")
  .replace(/[^a-zа-я0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const categoryAlias = (category) => {
  if (category.includes("женщин")) return "Лазер для женщин";
  if (category.includes("мужчин")) return "Лазер для мужчин";
  if (category.includes("массаж")) return "Массаж тела";
  if (category.includes("Брови")) return "Брови и ресницы";
  if (category.includes("Перманент")) return "Перманент";
  return category;
};

const categoryDescription = (category) => {
  if (category.includes("женщин")) return "Диодная лазерная эпиляция для женщин с прозрачной стоимостью по зонам.";
  if (category.includes("мужчин")) return "Отдельный прайс для мужской лазерной эпиляции.";
  if (category.includes("массаж")) return "Аппаратные процедуры для тонуса кожи и ощущения легкости.";
  if (category.includes("Брови")) return "Уход за бровями и ресницами: ламинирование, окрашивание и коррекция.";
  if (category.includes("Перманент")) return "Естественный перманентный макияж и коррекция результата.";
  return "Услуги студии DM Лазер.";
};

const groupedPrices = PRICES.reduce((groups, item) => {
  if (!groups.has(item.category)) groups.set(item.category, []);
  groups.get(item.category).push(item);
  return groups;
}, new Map());

const renderServices = () => {
  const popular = PRICES.filter((item) => item.popular || item.photo).slice(0, 3);

  serviceGrid.innerHTML = popular.map((item) => `
    <article class="service-card reveal">
      <div class="service-card__image">
        <img src="${item.photo}" alt="${item.name}" loading="lazy">
      </div>
      <div class="service-card__content">
        <p class="service-card__category">${categoryAlias(item.category)}</p>
        <h3>${item.name}</h3>
        <p>${categoryDescription(item.category)}</p>
        <dl>
          <div><dt>Категория</dt><dd>${categoryAlias(item.category)}</dd></div>
          <div><dt>Цена</dt><dd>${formatPrice(item.price)}</dd></div>
        </dl>
        <a class="text-link" href="#pricing">Смотреть цены</a>
      </div>
    </article>
  `).join("");
};

const renderPrices = () => {
  const categories = [...groupedPrices.keys()];

  priceTabs.innerHTML = categories.map((category, index) => {
    const slug = slugify(category);
    return `
      <button class="tabs__button ${index === 0 ? "is-active" : ""}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="tab-${slug}" id="tab-button-${slug}" data-tab="${slug}">
        ${categoryAlias(category)}
      </button>
    `;
  }).join("");

  priceLists.innerHTML = categories.map((category, index) => {
    const slug = slugify(category);
    const rows = groupedPrices.get(category).map((item) => `
      <div class="price-row" data-price-row>
        <span>
          ${item.name}
          ${item.popular ? '<em>Популярное</em>' : ""}
        </span>
        <strong>${formatPrice(item.price)}</strong>
      </div>
    `).join("");

    return `
      <div class="price-list ${index === 0 ? "is-active" : ""}" id="tab-${slug}" role="tabpanel" aria-labelledby="tab-button-${slug}" data-price-list="${slug}" ${index === 0 ? "" : "hidden"}>
        ${rows}
      </div>
    `;
  }).join("");
};

renderServices();
renderPrices();

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
  header.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("is-menu-open", !isOpen);
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton?.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    document.body.classList.remove("is-menu-open");
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const filterRows = () => {
  const query = searchInput.value.trim().toLowerCase();
  document.querySelectorAll(".price-list.is-active [data-price-row]").forEach((row) => {
    row.hidden = query.length > 0 && !row.textContent.toLowerCase().includes(query);
  });
};

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    document.querySelectorAll("[data-tab]").forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    document.querySelectorAll("[data-price-list]").forEach((list) => {
      const isActive = list.dataset.priceList === tab;
      list.classList.toggle("is-active", isActive);
      list.hidden = !isActive;
      list.querySelectorAll("[data-price-row]").forEach((row) => {
        row.hidden = false;
      });
    });

    filterRows();
  });
});

searchInput?.addEventListener("input", filterRows);

document.querySelectorAll(".accordion__item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".accordion__item");
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const lightbox = document.querySelector("[data-lightbox]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const closeLightbox = document.querySelector("[data-lightbox-close]");

document.querySelectorAll("[data-gallery-item]").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxTitle.textContent = item.dataset.galleryItem;
    lightbox.hidden = false;
    closeLightbox.focus();
  });
});

const hideLightbox = () => {
  lightbox.hidden = true;
};

closeLightbox?.addEventListener("click", hideLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) hideLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) hideLightbox();
});
