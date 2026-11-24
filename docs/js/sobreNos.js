document.addEventListener('DOMContentLoaded', () => {
const prefereMovimentoReduzido =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefereMovimentoReduzido) {
        return;
    }

    const elementos = document.querySelectorAll(
        '.historia-container, ' +
        '.missao-container, ' +
        '.valor-card, ' +
        '.convite-section'
    );

    if (!elementos.length) {
        return;
    }

    document.documentElement.classList.add('js-animacoes');

    elementos.forEach((elemento, index) => {
        elemento.classList.add('revelar');
        if (elemento.classList.contains('valor-card')) {
            elemento.style.transitionDelay = `${index * 0.1}s`;
        }
    });
    const observador = new IntersectionObserver((entradas, observer) => {

        entradas.forEach(entrada => {

            if (entrada.isIntersecting) {

                entrada.target.classList.add('visivel');
                 observer.unobserve(entrada.target);

            }

        });

    }, {
        threshold: 0.15
    });
    elementos.forEach(elemento => {
        observador.observe(elemento);
    });

});