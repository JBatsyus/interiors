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