// i18n (internationalization) system
let translations = {};
let currentLang = localStorage.getItem('lang') || 'en';

// Built-in fallback translations (used if fetching JSON fails or when opened via file://)
const fallbackTranslations = {
  en: {
    nav: { home: 'Home', what: 'What?', platforms: 'Platforms' },
    hero: { title: "Hello, I'm PatrikLani", description: 'A polish boy passionate about coding and technology.', cta: 'Learn more' },
    what: { title: 'What is PatrikLani?', description: "PatrikLani has been around since 2019, starting with video randomness and gaming on YouTube, alongside art on DeviantArt. These days, I focus on coding (mainly on GitHub) and technology. While I still draw, that's under <a href=\"https://liophex.net\" target=\"_blank\" rel=\"noopener\">Liophex</a>, one of my current identities. PatrikLani is all about the tech side." },
    lanie: { title: 'Meet Lanie!', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
    platforms: { title: 'Find me on', discord: 'Join the server' },
    footer: { backToTop: 'Back to top' }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Try loading translations.json (works when served over http), else use fallback
  fetch('translations.json')
    .then(res => {
      if (!res.ok) throw new Error('HTTP error');
      return res.json();
    })
    .then(data => {
      translations = data;
      setLanguage(currentLang);
    })
    .catch(err => {
      console.warn('Translations load failed, using fallback:', err);
      translations = fallbackTranslations;
      setLanguage(currentLang);
    });

  // Language menu toggle wiring
  const langToggle = document.getElementById('langToggle');
  const langMenu = document.getElementById('langMenu');

  if (langToggle && langMenu) {
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu.classList.toggle('lang-menu--open');
    });

    document.addEventListener('click', () => {
      langMenu.classList.remove('lang-menu--open');
    });

    langMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Language option buttons
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
});

// Set language and update DOM
function setLanguage(lang) {
  if (!translations[lang]) {
    console.warn(`Language "${lang}" not found, defaulting to English`);
    lang = 'en';
  }
  
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  
  // Update language toggle button
  const langCodes = { en: 'EN', pl: 'PL', lt: 'LT', ru: 'RU', de: 'DE' };
  const currentLangEl = document.getElementById('currentLang');
  if (currentLangEl) currentLangEl.textContent = langCodes[lang] || 'EN';
  
  // Update all translatable elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = getNestedTranslation(translations[lang], key);
    
    if (translation) {
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = translation;
      } else {
        el.textContent = translation;
      }
    }
  });
  // Close menu after selection
  const langMenu = document.getElementById('langMenu');
  if (langMenu) langMenu.classList.remove('lang-menu--open');
}

// Helper to access nested translation keys (e.g., "nav.home")
function getNestedTranslation(obj, key) {
  return key.split('.').reduce((o, k) => (o || {})[k], obj);
}

// (legacy wiring removed; now initialized on DOMContentLoaded)
