const slides = document.querySelectorAll(".slide");
const slideshowDots =   document.querySelectorAll('.slideshowDot');

const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let currentSlide = 0;

function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    slideshowDots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    slideshowDots[currentSlide].classList.add('active');
}

next.addEventListener('click', () => {
    showSlide(currentSlide + 1);
});

prev.addEventListener('click', () => {
    showSlide(currentSlide - 1);
});

setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

slideshowDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});
