import { PRICES } from "./prices.js";

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");
const logo = document.getElementById("logo");
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
  // Выбираем 3 популярные услуги с привязанными фотографиями
  const popular = PRICES.filter((item) => item.photo && item.popular).slice(0, 3);

  serviceGrid.innerHTML = popular.map((item) => {
    const priceVal = item.prices 
      ? (item.prices[1] || Object.values(item.prices)[0]) 
      : item.price;

    return `
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
            <div><dt>Цена</dt><dd>${formatPrice(priceVal)}</dd></div>
          </dl>
          <a class="text-link" href="#pricing">Смотреть цены</a>
        </div>
      </article>
    `;
  }).join("");
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
    const items = [...groupedPrices.get(category)].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));

    const rows = items.map((item) => {
      if (item.type === "sessions") {
        const keys = Object.keys(item.prices).map(Number).sort((a, b) => a - b);
        const defaultKey = keys[0];
        const defaultPrice = item.prices[defaultKey];

        const sessionButtons = keys.map((k) => `
          <button type="button" class="session-btn ${k === defaultKey ? 'is-active' : ''}" data-sessions="${k}" data-price="${item.prices[k]}">${k}</button>
        `).join("");

        return `
          <div class="price-card-item" data-price-row data-name="${item.name.toLowerCase()}">
            <div class="price-card-top">
              <span class="price-card__title">
                ${item.name}
                ${item.popular ? '<em>Популярное</em>' : ""}
              </span>
            </div>
            
            <div class="price-sessions" aria-label="Количество сеансов">
              <span class="sessions-label">Сеансы:</span>
              <div class="sessions-group">${sessionButtons}</div>
            </div>

            <div class="price-card-bottom">
              <div class="price-card__desc">${item.description || "Эффективный уход для гладкости кожи."}</div>
              <div class="price-card__price-action">
                <div class="price-val" data-price-output>${formatPrice(defaultPrice)}</div>
                <a class="button button--small" href="https://n1962797.yclients.com/select-city/1/select-branch?o=m-1" target="_blank" rel="noopener">Записаться</a>
              </div>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="price-card-item" data-price-row data-name="${item.name.toLowerCase()}">
            <div class="price-card-top">
              <span class="price-card__title">
                ${item.name}
                ${item.popular ? '<em>Популярное</em>' : ""}
              </span>
            </div>

            <div class="price-card-bottom">
              <div class="price-card__desc">${item.description || "Профессиональная процедура в студии."}</div>
              <div class="price-card__price-action">
                <div class="price-val">${formatPrice(item.price)}</div>
                <a class="button button--small" href="https://n1962797.yclients.com/select-city/1/select-branch?o=m-1" target="_blank" rel="noopener">Записаться</a>
              </div>
            </div>
          </div>
        `;
      }
    }).join("");

    return `
      <div class="price-list ${index === 0 ? "is-active" : ""}" id="tab-${slug}" role="tabpanel" aria-labelledby="tab-button-${slug}" data-price-list="${slug}" ${index === 0 ? "" : "hidden"}>
        <div class="price-items-grid">
          ${rows}
        </div>
      </div>
    `;
  }).join("");
};

renderServices();
renderPrices();

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".session-btn");
  if (!btn) return;

  const card = btn.closest(".price-card-item");
  card.querySelectorAll(".session-btn").forEach((b) => b.classList.remove("is-active"));
  btn.classList.add("is-active");

  const priceVal = btn.dataset.price;
  const output = card.querySelector("[data-price-output]");
  output.textContent = formatPrice(priceVal);
});

const setHeaderState = () => {
  const isScrolled = window.scrollY > 12;
  header.classList.toggle("is-scrolled", isScrolled);
  if (logo) {
    logo.src = isScrolled
      ? "./Лого сайт 200х200 тёмное.webp"
      : "./Лого сайт 200х200 светлое.webp";
  }
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

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const filterRows = () => {
  const query = searchInput.value.trim().toLowerCase();
  document.querySelectorAll(".price-list.is-active [data-price-row]").forEach((row) => {
    const name = row.dataset.name || "";
    row.hidden = query.length > 0 && !name.includes(query);
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

const cookieBanner = document.getElementById("cookieBanner");
const acceptCookies = document.getElementById("acceptCookies");

if (!localStorage.getItem("cookiesAccepted")) {
  setTimeout(() => {
    cookieBanner?.classList.add("show");
  }, 800);
}

acceptCookies?.addEventListener("click", () => {
  localStorage.setItem("cookiesAccepted", "true");
  cookieBanner?.classList.remove("show");
});
/* Логика прокрутки карусели команды по стрелкам */
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('team-carousel');
    const prevBtn = document.getElementById('team-prev');
    const nextBtn = document.getElementById('team-next');

    if (carousel && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -carousel.clientWidth, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
        });
    }
});
/*онлайн запись*/
const floatingBooking = document.getElementById("floatingBooking");
const floatingToggle = document.getElementById("floatingToggle");

if (floatingBooking && floatingToggle) {
    floatingToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        floatingBooking.classList.toggle("is-open");
    });

    document.addEventListener("click", (e) => {
        if (!floatingBooking.contains(e.target)) {
            floatingBooking.classList.remove("is-open");
        }
    });
}
