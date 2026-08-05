(function () {
  "use strict";

  var body = document.body;
  var header = document.querySelector(".site-header");
  var menuToggle = document.querySelector(".menu-toggle");
  var siteNav = document.querySelector(".site-nav");
  var modal = document.querySelector("#project-modal");
  var modalImage = document.querySelector("#modal-image");
  var modalTitle = document.querySelector("#modal-title");
  var modalCategory = document.querySelector("#modal-category");
  var lastFocusedElement = null;

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  }

  function setMenu(open) {
    if (!menuToggle || !siteNav) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    siteNav.classList.toggle("is-open", open);
    body.classList.toggle("menu-open", open);
  }

  function openModal(button) {
    if (!modal || !modalImage || !modalTitle || !modalCategory) return;

    lastFocusedElement = document.activeElement;
    modalTitle.textContent = button.getAttribute("data-title") || "Project preview";
    modalCategory.textContent = button.getAttribute("data-category") || "VISIL Digital Studio";
    modalImage.src = button.getAttribute("data-image") || "";

    var projectImage = button.querySelector("img");
    modalImage.alt = projectImage ? projectImage.alt : "VISIL project preview";
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    body.classList.add("modal-open");

    window.setTimeout(function () {
      var closeButton = modal.querySelector(".modal-close");
      if (closeButton) closeButton.focus();
    }, 50);
  }

  function closeModal() {
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("is-open");
    body.classList.remove("modal-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function setupRevealAnimations() {
    var revealItems = document.querySelectorAll("[data-reveal]");
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px" }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  function animateCount(element) {
    var target = Number(element.getAttribute("data-count")) || 0;
    var suffix = element.getAttribute("data-suffix") || "";
    var duration = 1200;
    var startTime = null;

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    }

    window.requestAnimationFrame(tick);
  }

  function setupCounters() {
    var counters = document.querySelectorAll("[data-count]");
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window) || reducedMotion) {
      counters.forEach(function (counter) {
        counter.textContent =
          (counter.getAttribute("data-count") || "0") + (counter.getAttribute("data-suffix") || "");
      });
      return;
    }

    var counterObserver = new IntersectionObserver(
      function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.45 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  function setupProjectForm() {
    var form = document.querySelector("#project-form");
    var status = document.querySelector("#form-status");
    if (!form || !status) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var formData = new FormData(form);
      var name = formData.get("name");
      var contact = formData.get("contact");
      var service = formData.get("service");
      var message = formData.get("message");
      var whatsappMessage =
        "Hello VISIL Digital Studio!%0A%0A" +
        "Name: " + encodeURIComponent(name) + "%0A" +
        "Contact: " + encodeURIComponent(contact) + "%0A" +
        "Service: " + encodeURIComponent(service) + "%0A%0A" +
        "Project details:%0A" + encodeURIComponent(message);
      var whatsappUrl = "https://wa.me/916381197003?text=" + whatsappMessage;

      status.textContent = "Opening WhatsApp with your project brief…";
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      form.reset();
    });
  }

  function setupEvents() {
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    // theme toggle support
    var themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        var isDark = document.documentElement.getAttribute("data-theme") !== "light";
        document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
        // store preference
        try { localStorage.setItem("visil-theme", isDark ? "light" : "dark"); } catch (e) {}
      });
      // initialize from storage
      try {
        var saved = localStorage.getItem("visil-theme");
        if (saved === "light") document.documentElement.setAttribute("data-theme", "light");
      } catch (e) {}
    }

    if (menuToggle) {
      menuToggle.addEventListener("click", function () {
        setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
      });
    }

    if (siteNav) {
      siteNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          setMenu(false);
        });
      });
    }

    document.querySelectorAll(".work-open").forEach(function (button) {
      button.addEventListener("click", function () {
        openModal(button);
      });
    });

    document.querySelectorAll("[data-modal-close]").forEach(function (button) {
      button.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (modal && modal.classList.contains("is-open")) {
        closeModal();
      } else if (menuToggle && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuToggle.focus();
      }
    });
  }

  function setCurrentYear() {
    var yearElement = document.querySelector("#current-year");
    if (yearElement) yearElement.textContent = new Date().getFullYear();
  }

  setupEvents();
  setupRevealAnimations();
  setupCounters();
  setupProjectForm();
  setCurrentYear();

  // small interactive hero parallax
  var heroArt = document.querySelector('.hero-art');
  var heroLogo = document.querySelector('.hero-logo');
  if (heroArt && heroLogo) {
    heroArt.addEventListener('mousemove', function (e) {
      var rect = heroArt.getBoundingClientRect();
      var dx = (e.clientX - rect.left) / rect.width - 0.5;
      var dy = (e.clientY - rect.top) / rect.height - 0.5;
      heroLogo.style.transform = 'translate(' + (dx * 12).toFixed(2) + 'px,' + (dy * 8).toFixed(2) + 'px) rotate(' + (dx * 2).toFixed(2) + 'deg)';
    });
    heroArt.addEventListener('mouseleave', function () {
      heroLogo.style.transform = '';
    });
  }
})();
