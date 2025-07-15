/**
* Template Name: Vesperr - v4.10.0
* Template URL: https://bootstrapmade.com/vesperr-free-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function () {
  "use strict";
  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 20
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function (e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function (e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()
/**
   * Contact Form
   */

// document.getElementById("sendmessage-button").addEventListener("click",
let sendMessage = function () {
  var name = document.getElementById("c_name").value;
  var email = document.getElementById("c_email").value;
  var subject = document.getElementById("c_subject").value;
  var message = document.getElementById("c_message").value;

  // Input validation
  if (name === '' || email === '' || subject === '' || message === '') {
    alert('Please fill in all fields before submitting the form.');
    return;
  }

  $.ajax({
    url: "https://jalebi.efeone.com/api/resource/Lead?first_name=" + encodeURIComponent(name) +
         "&email_id=" + encodeURIComponent(email) +
         "&custom_subject=" + encodeURIComponent(subject) +
         "&custom_message=" + encodeURIComponent(message),
    type: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'token ffceb203fabe2fc:773041385edd49a'
    },
    success: function (response) {
      const alertBox = document.getElementById("custom-alert");
      alertBox.style.display = "block";

      document.getElementById("c_name").value = "";
      document.getElementById("c_email").value = "";
      document.getElementById("c_subject").selectedIndex = 0;
      document.getElementById("c_message").value = "";

      setTimeout(() => {
        alertBox.style.display = "none";
      }, 3000);
    },
    error: function () {
      alert("Error while sending message");
    }
  });
}

function loadLifeSlider() {
  jQuery.ajax({
    url: 'https://jalebi.efeone.com/api/resource/Efeone Website Image?fields=["image_type","attachment","remarks","priority"]&filters=[["is_published","=","1"]]&order_by=priority asc',
    type: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'token ffceb203fabe2fc:773041385edd49a'
    },
    success: function (response) {
      const images = response.data;
      const slideContainer = document.getElementById("efeoneSlides");
      const sliderWidth = 450;
      let slideIndex = 0;
      let totalSlides = images.length;

      if (totalSlides === 0) return;

      // Inject slides into DOM
      images.forEach(item => {
        const img = document.createElement("img");
        img.src = 'https://jalebi.efeone.com'+ item.attachment || 'https://placehold.co/450x450?text=No+Image';
        img.alt = item.remarks || "efeone image";
        slideContainer.appendChild(img);
      });

      // Clone first slide for seamless loop
      const firstClone = slideContainer.children[0].cloneNode(true);
      slideContainer.appendChild(firstClone);

      // Auto-slide logic
      setInterval(() => {
        slideIndex++;
        slideContainer.style.transition = "transform 0.5s ease-in-out";
        slideContainer.style.transform = `translateX(-${slideIndex * sliderWidth}px)`;

        if (slideIndex === totalSlides) {
          setTimeout(() => {
            slideContainer.style.transition = "none";
            slideContainer.style.transform = "translateX(0px)";
            slideIndex = 0;
          }, 500);
        }
      }, 3000);
    },
    error: function (err) {
      console.error("Error loading images:", err);
    }
  });
}

// Call this function on DOM ready
jQuery(document).ready(function () {
  loadLifeSlider();
});