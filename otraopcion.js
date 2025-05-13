
  // ---------------- SMOOTH SCROLLING ----------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        if (navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
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
  
// REEMPLAZA TODO EL CÓDIGO DEL MENU TOGGLE CON ESTO:
document.addEventListener("DOMContentLoaded", function() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const dropdowns = document.querySelectorAll(".dropdown");

  // Menú hamburguesa
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function(e) {
      e.stopPropagation(); // Evita que el evento se propague
      navLinks.classList.toggle("active");
      document.body.classList.toggle("menu-open"); // Para controlar el scroll
    });
  }

  // Dropdowns
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector("a");
    
    link.addEventListener("click", function(e) {
      if (window.innerWidth <= 768) { // Solo en móvil
        e.preventDefault();
        dropdown.classList.toggle("active");
      }
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener("click", function(e) {
    if (!e.target.closest(".nav-links") && !e.target.closest(".menu-toggle")) {
      navLinks.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });
});
