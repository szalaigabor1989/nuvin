document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    setTimeout(function () {
        document.querySelector('.preloader').classList.add('loaded');
    }, 600);

    // Toggle header's fixed state and navigation link colors when scrolling past 200px
    document.querySelector('header').classList.toggle('fixed', window.scrollY > 200);
    window.addEventListener('scroll', function () {
        document.querySelector('header').classList.toggle('fixed', window.scrollY > 200);
    });

    // Smooth scroll to anchor links with a 107px offset (for fixed header height)
    document.querySelectorAll('.navbar-nav a.nav-link, .hero a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.scrollY -
                    (window.innerWidth < 992 ? 99 : 107);
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            if (window.innerWidth < 992) {
                const bsCollapse = new bootstrap.Collapse(navbarNav, {toggle: false});
                bsCollapse.hide();
            }
        });
    });

    // Activate navigation links dynamically based on scroll position (ScrollSpy with -107px offset)
    const sections = [
        document.body, // <body id="home">
        ...document.querySelectorAll('section[id]')
    ];
    const navLinks = document.querySelectorAll('.navbar-nav a.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const scrollOffset = window.innerWidth < 992 ? 99 : 107; // Responsive offset

            if (window.scrollY >= sectionTop - scrollOffset) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Initialize Services Slider: Responsive carousel with pagination and breakpoints
    new Swiper('.services-slider', {
        direction: 'horizontal',
        loop: true,
        pagination: {
            el: '.services-slider-pagination',
        },
        slidesPerView: 1,
        spaceBetween: 0,
        breakpoints: {
            576: {
                slidesPerView: 2
            },
            768: {
                slidesPerView: 3
            }
        },
        grabCursor: true
    });

    // Animate numeric counters when element enters viewport (with IntersectionObserver)
    function animateCounter(el, duration = 2000) {
        const target = +el.getAttribute('data-count');
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = 1 - Math.pow(2, -10 * progress);
            const currentValue = Math.floor(easedProgress * target);

            el.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    const counters = document.querySelectorAll('span[data-count]');
    const countersObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                countersObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.6
    });

    counters.forEach(counter => {
        countersObserver.observe(counter);
    });

    // Animate progress bars using easing and data-valuenow attribute
    function animateProgressBar(el, duration = 1500) {
        const targetWidth = +el.getAttribute('data-valuenow');
        const startTime = performance.now();

        // easeOutCubic: szép, természetes lassulás a végén
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = easeOutCubic(progress);
            const currentWidth = easedProgress * targetWidth;

            el.style.width = currentWidth + '%';

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.style.width = targetWidth + '%'; // fixáljuk a végső értéket
            }
        }

        requestAnimationFrame(update);
    }

    const progressBars = document.querySelectorAll('.progress-bar');
    const progressBarsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBar(entry.target);
                progressBarsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    progressBars.forEach(bar => {
        progressBarsObserver.observe(bar);
    });

    // Initialize Testimonials Slider: Horizontal looped slider with scrollbar
    new Swiper('.testimonials-slider', {
        direction: 'horizontal',
        loop: true,
        scrollbar: {
            el: '.swiper-scrollbar',
        },
        grabCursor: true
    });

});