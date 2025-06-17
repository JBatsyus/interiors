const lenis = new Lenis({
    autoRaf: true,
    anchors: true,
});

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
    console.log(e);
});

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


const menuHumb = document.querySelector('.menu-humb');
const menuMob = document.querySelector('.menu-mob');
const header = document.querySelector('.header');

// Обработчик клика на бургер
menuHumb.addEventListener('click', function (e) {
    e.stopPropagation(); // Предотвращаем всплытие
    this.classList.toggle('active');
    menuMob.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});

// Закрытие меню при клике вне его
document.addEventListener('click', function (e) {
    if (!e.target.closest('.menu-mob') && !e.target.closest('.menu-humb')) {
        menuHumb.classList.remove('active');
        menuMob.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

// Закрытие при клике на ссылки
document.querySelectorAll('.menu-mob a').forEach(link => {
    link.addEventListener('click', () => {
        menuHumb.classList.remove('active');
        menuMob.classList.remove('active');
        document.body.classList.remove('no-scroll');
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


gsap.registerPlugin(ScrollTrigger);

// Находим ВСЕ элементы с классом marquee
const marquees = document.querySelectorAll('.marquee');
const marqueeTweens = [];

// Проверяем, есть ли элементы
if (marquees.length === 0) {
    console.warn('Элементы с классом .marquee не найдены');
}

// Инициализируем каждый marquee
marquees.forEach((marquee, index) => {
    // Дублируем контент для каждого
    marquee.innerHTML += marquee.innerHTML;
    
    // Создаем анимацию для каждого элемента
    const marqueeTween = gsap.to(marquee, {
        xPercent: -50, // Половина, так как контент продублирован
        ease: "none",
        repeat: -1,
        duration: 30,
        paused: true
    });
    
    // Устанавливаем начальную позицию в середине
    marqueeTween.progress(0.5);
    
    // Сохраняем ссылку на анимацию
    marqueeTweens.push(marqueeTween);
    
    // Запускаем анимацию
    marqueeTween.play();
    
    console.log(`Marquee ${index + 1} инициализирован`);
});

let lastScroll = 0;

function handleScroll() {
    const currentScroll = window.scrollY;
    
    // Применяем изменение направления ко всем marquee
    marqueeTweens.forEach((tween, index) => {
        if (currentScroll > lastScroll) {
            tween.timeScale(1); // влево
        } else {
            tween.timeScale(-1); // вправо
        }
    });
    
    lastScroll = currentScroll;
}

// Добавляем throttling для производительности
let ticking = false;
window.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Дополнительная проверка: убеждаемся что все анимации активны
function ensureAnimationsActive() {
    marqueeTweens.forEach((tween, index) => {
        if (tween.paused()) {
            console.log(`Перезапуск анимации ${index + 1}`);
            tween.play();
        }
    });
}

// Проверяем каждые 5 секунд
setInterval(ensureAnimationsActive, 5000);

console.log(`Инициализировано ${marqueeTweens.length} marquee анимаций`);