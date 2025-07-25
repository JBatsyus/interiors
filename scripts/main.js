document.addEventListener('DOMContentLoaded', () => {
    // Функция для удаления якоря из URL
    function removeAnchorFromUrl() {
        if (window.location.hash) {
            // Удаляем якорь из URL
            history.pushState({}, '', window.location.href.replace(/#.*$/, ''));
        }
    }

    // Вызываем функцию при загрузке страницы, чтобы удалить якорь, если он есть
    removeAnchorFromUrl();

    // Обработчик события hashchange для удаления якоря при изменении хэша
    window.addEventListener('hashchange', () => {
        removeAnchorFromUrl();
    });

    // Бегущая строка
    const marquees = document.querySelectorAll('.marquee');
    if (!marquees.length) return;

    let lastScrollTop = window.scrollY;
    let ticking = false;

    // Для каждого .marquee создаём свой объект состояния
    const instances = [];

    marquees.forEach(marquee => {
        // Клонируем содержимое дважды для бесконечности
        marquee.innerHTML = marquee.innerHTML + marquee.innerHTML + marquee.innerHTML;

        // Получаем ширину оригинального блока
        const firstChild = marquee.children[0];
        const originalWidth = Array.from(marquee.children).slice(0, Math.floor(marquee.children.length / 3))
            .reduce((acc, el) => acc + el.offsetWidth, 0);

        instances.push({
            marquee,
            speed: 1.5,
            position: -originalWidth / 2,
            originalWidth
        });

        // Устанавливаем начальную позицию
        marquee.style.transform = `translateX(${instances[instances.length - 1].position}px)`;
    });

    function animate() {
        instances.forEach(instance => {
            const {
                marquee,
                originalWidth
            } = instance;

            instance.position -= instance.speed;

            // Зацикливание через модуль
            instance.position %= originalWidth;

            // Чтобы не было разрыва между дубликатами
            if (instance.position > 0) {
                instance.position -= originalWidth;
            }

            marquee.style.transform = `translateX(${instance.position}px)`;
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Обработчик скролла
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.scrollY;

                instances.forEach(instance => {
                    if (currentScroll > lastScrollTop) {
                        instance.speed = Math.abs(instance.speed); // вниз → влево
                    } else if (currentScroll < lastScrollTop) {
                        instance.speed = -Math.abs(instance.speed); // вверх → вправо
                    }
                });

                lastScrollTop = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });



    // Скролл к началу блока (блок слайдеров готовых работ - на мобилке прокрутка к началу блока)
    const checkMobile = () => window.matchMedia('(max-width: 768px)').matches;

    // Обработчик клика
    const handleNavClick = function (e) {
        if (!checkMobile()) return;

        e.preventDefault();
        $('.workflow-gallery__swiper').first()[0].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    // Инициализация
    $('.workflow-gallery__nav').on('click', handleNavClick);

    // Оптимизированная обработка ресайза
    let resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            $('.workflow-gallery__nav').off('click').on('click', handleNavClick);
        }, 250);
    });

    // Мобильное меню

    const menuHumb = document.querySelector('.menu-humb');
    const menuMob = document.querySelector('.menu-mob');


    menuHumb.addEventListener('click', function (e) {
        e.stopPropagation();
        this.classList.toggle('active');
        menuMob.classList.toggle('active');
        document.documentElement.classList.toggle('no-scroll');
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.menu-mob') && !e.target.closest('.menu-humb')) {
            menuHumb.classList.remove('active');
            menuMob.classList.remove('active');
            document.documentElement.classList.remove('no-scroll');
        }
    });

    var links = document.querySelectorAll('.menu-mob a');
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
            menuHumb.classList.remove('active');
            menuMob.classList.remove('active');
            document.documentElement.classList.remove('no-scroll');
        });
    }


});

// var swiper = new Swiper(".mySwiper", {
//     slidesPerView: 1,
//     spaceBetween: 20,
//     loop: true,
//     effect: 'fade',
//     pagination: {
//         el: ".counter",
//         type: "fraction",
//     },
//     fadeEffect: {
//         crossFade: true
//     }

// });
// var swiper2 = new Swiper(".mySwiper2", {
//     slidesPerView: 1,
//     effect: 'fade',
//     mousewheel: true,
//     thumbs: {
//         swiper: swiper,
//     },
// });


var swiperWorkflowGallery = new Swiper(".workflow-gallery__swiper", {
    lazy: true,
    // loop: true,
    // effect: "fade",
    // autoplay: {
    //     delay: 3000,
    //     disableOnInteraction: false,
    //     pauseOnMouseEnter: false,
    // },
    navigation: {
        nextEl: ".icon--arrow-right",
        prevEl: ".icon--arrow-left",
    },

});


// Инициализация Fancybox
Fancybox.bind("[data-fancybox]", {
    Thumbs: {
        type: "classic"
    },
    Toolbar: {
        display: {
            left: ["infobar"],
            middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW"],
            right: ["slideshow", "thumbs", "close"],
        },
    },
    Images: {
        zoom: true
    },
    hideScrollbar: false, // Не скрывать скроллбар
    autoFocus: false, // Отключить автофокус
    dragToClose: false, // Отключить закрытие при скролле

});

document.querySelectorAll('.contact-form__tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Удаляем активный класс у всех табов
        document.querySelectorAll('.contact-form__tab').forEach(t => {
            t.classList.remove('active');
        });

        // Добавляем активный класс текущему табу
        tab.classList.add('active');

        // Скрываем все содержимое табов
        document.querySelectorAll('.contact-form__pane').forEach(pane => {
            pane.classList.remove('active');
        });

        // Показываем нужное содержимое
        const tabName = tab.dataset.tab;
        document.querySelector(`.contact-form__pane[data-tab-content="${tabName}"]`).classList.add('active');
    });
});

/// mask
$(function () {
    $(".input-phone").mask("+7 (999) 999 - 99 - 99");
});



document.addEventListener('DOMContentLoaded', function () {
    // Определяем мобильное устройство
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Инициализация Swiper
    var thumbsSwiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        pagination: {
            el: ".swiper-pagination",
            type: "fraction",
        },
        allowTouchMove: isMobile // Включаем свайп только на мобильных
    });

    var mainSwiper = new Swiper(".mySwiper2", {
        slidesPerView: 1,
        effect: 'fade',
        mousewheel: {
            forceToAxis: true,
            sensitivity: isMobile ? 1.5 : 0.8 // Увеличиваем чувствительность для мобильных
        },
        thumbs: {
            swiper: thumbsSwiper
        },
        allowTouchMove: isMobile, // Включаем свайп только на мобильных
        speed: isMobile ? 300 : 600 // Уменьшаем скорость анимации для мобильных
    });

    // Инициализация GSAP ScrollTrigger только для десктопов
    if (!isMobile) {
        gsap.registerPlugin(ScrollTrigger);

        function initScrollAnimation() {
            var pinContainer = document.querySelector('.pin-container');
            var slideCount = mainSwiper.slides.length;
            var scrollDistance = slideCount * window.innerHeight;

            ScrollTrigger.getAll().forEach(trigger => trigger.kill());

            ScrollTrigger.create({
                trigger: pinContainer,
                start: "top top",
                end: "+=" + scrollDistance,
                pin: true,
                anticipatePin: 1,
                scrub: 0.5,
                onUpdate: function (self) {
                    var progress = self.progress * (slideCount - 1);
                    var currentSlide = Math.floor(progress);

                    if (currentSlide !== mainSwiper.activeIndex && !mainSwiper.destroyed) {
                        mainSwiper.slideTo(currentSlide);
                    }
                },
                onEnter: function () {
                    if (!mainSwiper.destroyed) mainSwiper.mousewheel.enable();
                },
                onLeaveBack: function () {
                    if (!mainSwiper.destroyed) mainSwiper.mousewheel.disable();
                }
            });

            ScrollTrigger.refresh();
        }

        initScrollAnimation();
        window.addEventListener('resize', initScrollAnimation);
    }

    // Оптимизация для мобильных устройств
    if (isMobile) {
        // Увеличиваем область свайпа
        document.querySelectorAll('.swiper').forEach(swiper => {
            swiper.style.touchAction = 'pan-y';
            swiper.style.overflow = 'visible';
        });

        // Добавляем инерцию при скролле
        mainSwiper.params.mousewheel.releaseOnEdges = true;
        mainSwiper.params.mousewheel.invert = false;
    }
});