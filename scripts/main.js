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
});

// const lenis = new Lenis({
//     autoRaf: true,
//     direction: 'vertical',
//     gestureDirection: 'vertical',
// });

// Функция для обновления состояния Lenis
// function updateLenis() {
//     if (document.body.classList.contains('no-scroll')) {
//         lenis.stop(); // Останавливаем Lenis
//     } else {
//         lenis.start(); // Возобновляем Lenis
//     }
// }

const menuHumb = document.querySelector('.menu-humb');
const menuMob = document.querySelector('.menu-mob');
const header = document.querySelector('.header');

// Обработчик клика на бургер
menuHumb.addEventListener('click', function (e) {
    e.stopPropagation();
    this.classList.toggle('active');
    menuMob.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    // updateLenis(); // Обновляем состояние Lenis
});

// Закрытие меню при клике вне его
document.addEventListener('click', function (e) {
    if (!e.target.closest('.menu-mob') && !e.target.closest('.menu-humb')) {
        menuHumb.classList.remove('active');
        menuMob.classList.remove('active');
        document.body.classList.remove('no-scroll');
        // updateLenis(); // Обновляем состояние Lenis
    }
});

// Закрытие при клике на ссылки
document.querySelectorAll('.menu-mob a').forEach(link => {
    link.addEventListener('click', () => {
        menuHumb.classList.remove('active');
        menuMob.classList.remove('active');
        document.body.classList.remove('no-scroll');
        // updateLenis(); // Обновляем состояние Lenis
    });
});

// Инициализация Lenis
// function raf(time) {
//     lenis.raf(time);
//     requestAnimationFrame(raf);
// }

// requestAnimationFrame(raf);




var swiperWorkflowGallery = new Swiper(".workflow-gallery__swiper", {
    lazy: true,
    loop: true,
    effect: "fade",
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
    },
    navigation: {
        nextEl: ".icon--arrow-right",
        prevEl: ".icon--arrow-left",
    },

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

gsap.registerPlugin(ScrollTrigger);

const images = document.querySelectorAll('.image');
const infoContents = document.querySelectorAll('.info-content');
const counterCurrent = document.querySelector('.counter__current');
const counterTotal = document.querySelector('.counter__total');

let currentImageIndex = 0;

// Пиним контейнер
gsap.to(".pin-container", {
    scrollTrigger: {
        trigger: ".scroll-section",
        start: "top top",
        end: "+=100%",
        scrub: true,
        pin: true,
        onUpdate: ({
            progress
        }) => {
            const index = Math.min(images.length - 1, Math.floor(progress * images.length));

            if (index !== currentImageIndex) {
                // Скрыть текущее изображение и текст
                images[currentImageIndex].classList.remove('image--active');
                infoContents[currentImageIndex].classList.remove('info-content--active');

                // Показать новое изображение и текст
                images[index].classList.add('image--active');
                infoContents[index].classList.add('info-content--active');

                // Обновить счетчик
                counterCurrent.textContent = String(index + 1).padStart(2, '0');

                currentImageIndex = index;
            }
        }
    },
    duration: 1
});

// Установить общее количество изображений
counterTotal.textContent = String(images.length).padStart(2, '0');