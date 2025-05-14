
  // ---------------- SMOOTH SCROLLING (General - Modified by Manus) ----------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetSelector = this.getAttribute("href");
      if (targetSelector && targetSelector.length > 1 && targetSelector.startsWith("#")) {
        const target = document.querySelector(targetSelector);
        if (target) {
          const isNavLink = this.closest(".nav-links");
          if (!isNavLink) { // Only preventDefault and scroll if NOT a nav-link (new logic handles nav-links)
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
          }
          // If it IS a nav-link, the new DOMContentLoaded logic will handle its scrolling and menu closing.
        }
      }
    });
  });

  // ---------------- REUSABLE SLIDER FUNCTION ----------------
  function initSlider(
    wrapperSelector,
    slideSelector,
    indicatorSelector,
    autoSlide = false
  ) {
    const slider = document.querySelector(wrapperSelector);
    const slides = document.querySelectorAll(
      `${wrapperSelector} ${slideSelector}`
    );
    const indicators = document.querySelectorAll(indicatorSelector);

    if (!slider || slides.length === 0 || indicators.length === 0) return null;

    let currentIndex = 0;
    const totalSlides = slides.length;
    const slideWidthPercent = 100 / totalSlides;
    let autoSlideInterval;
    let startX = 0;
    let isDragging = false;

    function updateSlider() {
      slider.style.transform = `translateX(-${
        currentIndex * slideWidthPercent
      }%)`;
      indicators.forEach((ind, index) => {
        ind.classList.toggle("active", index === currentIndex);
      });
    }

    function goToSlide(index) {
      if (index >= 0 && index < totalSlides) {
        currentIndex = index;
        updateSlider();
      }
    }

    function nextSlide() {
      goToSlide((currentIndex + 1) % totalSlides);
    }

    // Eventos para touch (móvil)
    slider.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        slider.style.transition = "none";
      },
      { passive: true }
    );

    slider.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        const x = e.touches[0].clientX;
        const diff = startX - x;
        slider.style.transform = `translateX(calc(-${
          currentIndex * slideWidthPercent
        }% - ${diff}px))`;
      },
      { passive: false }
    );

    slider.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      slider.style.transition = "transform 0.5s ease";

      // Umbral mínimo de 50px para considerar swipe
      if (diff > 50 && currentIndex < totalSlides - 1) {
        currentIndex++;
      } else if (diff < -50 && currentIndex > 0) {
        currentIndex--;
      }
      updateSlider();
    });

    // Eventos para mouse (opcional)
    slider.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      isDragging = true;
      slider.style.transition = "none";
      e.preventDefault(); // Evita selección de texto
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const x = e.clientX;
      const diff = startX - x;
      slider.style.transform = `translateX(calc(-${
        currentIndex * slideWidthPercent
      }% - ${diff}px))`;
    });

    document.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.clientX;
      const diff = startX - endX;
      slider.style.transition = "transform 0.5s ease";

      if (diff > 50 && currentIndex < totalSlides - 1) {
        currentIndex++;
      } else if (diff < -50 && currentIndex > 0) {
        currentIndex--;
      }
      updateSlider();
    });

    // Sistema de indicadores
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        goToSlide(index);
        resetAutoSlide();
      });
    });

    // Auto-slide (opcional)
    function startAutoSlide() {
      if (autoSlide) {
        autoSlideInterval = setInterval(nextSlide, 5000);
      }
    }

    function resetAutoSlide() {
      if (autoSlide) {
        clearInterval(autoSlideInterval);
        startAutoSlide();
      }
    }

    // Inicialización
    updateSlider();
    startAutoSlide();

    // Pausar auto-slide al interactuar
    slider.addEventListener("mouseenter", () => {
      if (autoSlide) clearInterval(autoSlideInterval);
    });

    slider.addEventListener("mouseleave", () => {
      if (autoSlide) startAutoSlide();
    });

    return {
      goToSlide,
      nextSlide,
    };
  }

  // ---------------- INICIALIZAR SLIDERS ----------------
  const aquagymSlider = initSlider(
    ".aquagym-slider",
    ".slide",
    ".aquagym-indicator",
    false
  );
  const matronatacionSlider = initSlider(
    ".matronatacion-slider",
    ".slide",
    ".matronatacion-indicator",
    false
  );
  const natacionSlider = initSlider(
    ".natacion-slider",
    ".slide",
    ".natacion-indicator",
    false
  );
  const aboutSlider = initSlider(
    ".about-slider",
    ".slide",
    ".about-indicator",
    false
  );

  // ---------------- CARRUSEL DE IMÁGENES AQUAGYM ----------------
  const aquagymImageContainer = document.querySelector(".aquagym-image");
  if (aquagymImageContainer) {
    const aquagymImages = aquagymImageContainer.querySelectorAll("img");
    let currentAquagymImageIndex = 0;
    let aquagymImageInterval;
    const aquagymTransitionTime = 5000; // 5 segundos

    function changeAquagymImage() {
      aquagymImages[currentAquagymImageIndex].classList.remove("active");
      currentAquagymImageIndex =
        (currentAquagymImageIndex + 1) % aquagymImages.length;
      aquagymImages[currentAquagymImageIndex].classList.add("active");
    }

    function startAquagymSlider() {
      if (aquagymImages.length > 0) {
        aquagymImages[0].classList.add("active");
        aquagymImageInterval = setInterval(
          changeAquagymImage,
          aquagymTransitionTime
        );
      }
    }

    startAquagymSlider();

    // Control al pasar el ratón
    aquagymImageContainer.addEventListener("mouseenter", () => {
      clearInterval(aquagymImageInterval);
    });

    aquagymImageContainer.addEventListener("mouseleave", () => {
      aquagymImageInterval = setInterval(
        changeAquagymImage,
        aquagymTransitionTime
      );
    });
  }

  //---------------CARRUSEL DE IMAGENES NATACION-------------------//
  const natacionImageContainer = document.querySelector(".natacion-image");
  if (natacionImageContainer) {
    const natacionImages = natacionImageContainer.querySelectorAll("img");
    let currentNatacionImageIndex = 0;
    let natacionImageInterval;
    const natacionTransitionTime = 5000; // 5 segundos

    function changeNatacionImage() {
      natacionImages[currentNatacionImageIndex].classList.remove("active");
      currentNatacionImageIndex =
        (currentNatacionImageIndex + 1) % natacionImages.length;
      natacionImages[currentNatacionImageIndex].classList.add("active");
    }

    function startNatacionSlider() {
      if (natacionImages.length > 0) {
        natacionImages[0].classList.add("active");
        natacionImageInterval = setInterval(
          changeNatacionImage,
          natacionTransitionTime
        );
      }
    }

    startNatacionSlider();

    natacionImageContainer.addEventListener("mouseenter", () => {
      clearInterval(natacionImageInterval);
    });

    natacionImageContainer.addEventListener("mouseleave", () => {
      natacionImageInterval = setInterval(
        changeNatacionImage,
        natacionTransitionTime
      );
    });
  }

  // ---------------- CARRUSEL DE IMÁGENES MATRONATACIÓN ----------------
  const matronatacionImageContainer = document.querySelector(
    ".matronatacion-image"
  );
  if (matronatacionImageContainer) {
    const matronatacionImages =
      matronatacionImageContainer.querySelectorAll("img");
    let currentMatronatacionImageIndex = 0;
    let matronatacionImageInterval;
    const matronatacionTransitionTime = 5000; // 5 segundos

    function changeMatronatacionImage() {
      // Solo cambia la opacidad para transición suave
      matronatacionImages[currentMatronatacionImageIndex].style.opacity = 0;

      setTimeout(() => {
        matronatacionImages[currentMatronatacionImageIndex].classList.remove(
          "active"
        );
        currentMatronatacionImageIndex =
          (currentMatronatacionImageIndex + 1) % matronatacionImages.length;
        matronatacionImages[currentMatronatacionImageIndex].classList.add(
          "active"
        );
        matronatacionImages[currentMatronatacionImageIndex].style.opacity = 1;
      }, 500);
    }

    function startMatronatacionSlider() {
      if (matronatacionImages.length > 0) {
        // Mostrar solo la primera imagen inicialmente
        matronatacionImages.forEach((img, index) => {
          img.classList.toggle("active", index === 0);
          img.style.opacity = index === 0 ? 1 : 0;
        });

        matronatacionImageInterval = setInterval(
          changeMatronatacionImage,
          matronatacionTransitionTime
        );
      }
    }

    startMatronatacionSlider();

    // Pausar al pasar el ratón
    matronatacionImageContainer.addEventListener("mouseenter", () => {
      clearInterval(matronatacionImageInterval);
    });

    matronatacionImageContainer.addEventListener("mouseleave", () => {
      matronatacionImageInterval = setInterval(
        changeMatronatacionImage,
        matronatacionTransitionTime
      );
    });
  }

  // ---------------- NAVEGACIÓN CLUB ----------------
  const sobreClubLink = document.getElementById("go-to-sobre-club");
  if (sobreClubLink && aboutSlider) {
    sobreClubLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#sobre").scrollIntoView({ behavior: "smooth" });
      aboutSlider.goToSlide(0);
    });
  }

  const objetivosClubLink = document.getElementById("go-to-objetivos-club");
  if (objetivosClubLink && aboutSlider) {
    objetivosClubLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#sobre").scrollIntoView({ behavior: "smooth" });
      aboutSlider.goToSlide(1);
    });
  }

  const dondeEstamosLink = document.getElementById("go-to-donde-estamos");
  if (dondeEstamosLink && aboutSlider) {
    dondeEstamosLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#sobre").scrollIntoView({ behavior: "smooth" });
      aboutSlider.goToSlide(2);
    });
  }

  // ---------------- NAVEGACIÓN AQUAGYM ----------------
  const sobreAquagymLink = document.getElementById("go-to-sobre-aquagym");
  if (sobreAquagymLink && aquagymSlider) {
    sobreAquagymLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#aqua").scrollIntoView({ behavior: "smooth" });
      aquagymSlider.goToSlide(0);
    });
  }

  const beneficiosLink = document.getElementById("go-to-beneficios");
  if (beneficiosLink && aquagymSlider) {
    beneficiosLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#aqua").scrollIntoView({ behavior: "smooth" });
      aquagymSlider.goToSlide(1);
    });
  }

  const horariosLink = document.getElementById("go-to-horarios");
  if (horariosLink && aquagymSlider) {
    horariosLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#aqua").scrollIntoView({ behavior: "smooth" });
      aquagymSlider.goToSlide(2);
    });
  }

  // ---------------- NAVEGACIÓN MATRONATACIÓN ----------------
  const sobreMatronatacionLink = document.getElementById(
    "go-to-sobre-matronatacion"
  );
  if (sobreMatronatacionLink && matronatacionSlider) {
    sobreMatronatacionLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#matro").scrollIntoView({ behavior: "smooth" });
      matronatacionSlider.goToSlide(0);
    });
  }

  const beneficiosMatronatacionLink = document.getElementById(
    "go-to-beneficios-matronatacion"
  );
  if (beneficiosMatronatacionLink && matronatacionSlider) {
    beneficiosMatronatacionLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#matro").scrollIntoView({ behavior: "smooth" });
      matronatacionSlider.goToSlide(1);
    });
  }

  const horariosMatronatacionLink = document.getElementById(
    "go-to-horarios-matronatacion"
  );
  if (horariosMatronatacionLink && matronatacionSlider) {
    horariosMatronatacionLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#matro").scrollIntoView({ behavior: "smooth" });
      matronatacionSlider.goToSlide(2);
    });
  }

  // ---------------- NAVEGACIÓN NATACIÓN 2025 ----------------
  const sobreNatacionLink = document.getElementById("go-to-sobre-natacion");
  if (sobreNatacionLink && natacionSlider) {
    sobreNatacionLink.addEventListener("click", function (e) {
      e.preventDefault();
      document
        .querySelector("#natacion-2025")
        .scrollIntoView({ behavior: "smooth" });
      natacionSlider.goToSlide(0);
    });
  }

  const beneficiosNatacionLink = document.getElementById(
    "go-to-beneficios-natacion"
  );
  if (beneficiosNatacionLink && natacionSlider) {
    beneficiosNatacionLink.addEventListener("click", function (e) {
      e.preventDefault();
      document
        .querySelector("#natacion-2025")
        .scrollIntoView({ behavior: "smooth" });
      natacionSlider.goToSlide(1);
    });
  }

  const horariosNatacionLink = document.getElementById(
    "go-to-horarios-natacion"
  );
  if (horariosNatacionLink && natacionSlider) {
    horariosNatacionLink.addEventListener("click", function (e) {
      e.preventDefault();
      document
        .querySelector("#natacion-2025")
        .scrollIntoView({ behavior: "smooth" });
      natacionSlider.goToSlide(2);
    });
  }
  
 // --- START MANUS MODIFIED MENU LOGIC (Replaces original menu toggle code) ---
 document.addEventListener("DOMContentLoaded", function() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links"); 
  const dropdownLiElements = document.querySelectorAll("li.dropdown"); 

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function(event) {
      event.stopPropagation(); 
      navLinks.classList.toggle("active"); 
      document.body.classList.toggle("menu-open"); 
    });
  }

  dropdownLiElements.forEach(dropdownLi => { 
    const mainDropdownLink = dropdownLi.querySelector("a"); 
    
    if (mainDropdownLink && mainDropdownLink.parentElement === dropdownLi) {
        mainDropdownLink.addEventListener("click", function(event) {
            if (window.innerWidth <= 768) { 
                if (dropdownLi.querySelector(".dropdown-menu")) { 
                    event.preventDefault(); 
                    dropdownLi.classList.toggle("active"); 
                    dropdownLiElements.forEach(otherDropdownLi => {
                        if (otherDropdownLi !== dropdownLi && otherDropdownLi.classList.contains("active")) {
                            otherDropdownLi.classList.remove("active");
                        }
                    });
                }
            }
        });
    }
  });

  const allNavSiteLinks = document.querySelectorAll(".nav-links a"); 

  allNavSiteLinks.forEach(navLink => {
    navLink.addEventListener("click", function(event) {
      const href = this.getAttribute("href");
      const isInternalPageLink = href && href.startsWith("#") && href.length > 1;

      if (isInternalPageLink) {
        event.preventDefault(); 
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const header = document.querySelector("header");
          const headerOffset = header ? header.offsetHeight : 0;
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }

      if (navLinks && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        if (document.body.classList.contains("menu-open")) {
            document.body.classList.remove("menu-open");
        }
      }

      const parentDropdownLi = this.closest("li.dropdown");
      if (parentDropdownLi && parentDropdownLi.classList.contains("active")) {
         parentDropdownLi.classList.remove("active");
      }
      if (parentDropdownLi && window.innerWidth > 768) {
          const mainLinkOfParent = parentDropdownLi.querySelector("a");
          if (mainLinkOfParent && mainLinkOfParent.parentElement === parentDropdownLi) {
              mainLinkOfParent.blur();
          }
          parentDropdownLi.classList.remove("active"); 
      }
      
      if (window.innerWidth <= 768) {
        dropdownLiElements.forEach(d => {
            d.classList.remove("active");
        });
      }
    });
  });

  document.addEventListener("click", function(event) {
    const isClickInsideNavContainer = navLinks && navLinks.contains(event.target);
    const isClickOnToggle = menuToggle && menuToggle.contains(event.target);

    if (!isClickInsideNavContainer && !isClickOnToggle) {
      if (navLinks && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        if (document.body.classList.contains("menu-open")) {
            document.body.classList.remove("menu-open");
        }
      }
      dropdownLiElements.forEach(dropdownLi => {
        dropdownLi.classList.remove("active");
      });
    }
  });
});
// --- END MANUS MODIFIED MENU LOGIC ---
