// o guarda de saida logo abaixo usa return: fora de uma funcao isso nem carrega
(function () {
    const hero = document.querySelector('.hero');
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const indicadores = Array.from(
        document.querySelectorAll('[data-slide-indicador]')
    );
    const botaoAnterior = document.querySelector('[data-slide-anterior]');
    const botaoProximo = document.querySelector('[data-slide-proximo]');

    if (!hero || slides.length < 2) {
        return;
    }

    const INTERVALO = 6000;
    const prefereMovimentoReduzido = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    );

    let atual = 0;
    let temporizador = null;

    function mostrar(indice) {
        atual = (indice + slides.length) % slides.length;

        slides.forEach((slide, posicao) => {
            slide.classList.toggle('active', posicao === atual);
        });

        indicadores.forEach((indicador, posicao) => {
            const ativo = posicao === atual;

            indicador.classList.toggle('active', ativo);

            if (ativo) {
                indicador.setAttribute('aria-current', 'true');
            } else {
                indicador.removeAttribute('aria-current');
            }
        });
    }

    function parar() {
        if (temporizador !== null) {
            window.clearInterval(temporizador);
            temporizador = null;
        }
    }

    function iniciar() {
        parar();

        if (prefereMovimentoReduzido.matches || document.hidden) {
            return;
        }

        temporizador = window.setInterval(() => mostrar(atual + 1), INTERVALO);
    }

    function avancar(passo) {
        mostrar(atual + passo);
        iniciar();
    }

    botaoAnterior?.addEventListener('click', () => avancar(-1));
    botaoProximo?.addEventListener('click', () => avancar(1));

    indicadores.forEach((indicador, posicao) => {
        indicador.addEventListener('click', () => {
            mostrar(posicao);
            iniciar();
        });
    });

    hero.addEventListener('mouseenter', parar);
    hero.addEventListener('mouseleave', iniciar);
    hero.addEventListener('focusin', parar);
    hero.addEventListener('focusout', (evento) => {
        if (!hero.contains(evento.relatedTarget)) {
            iniciar();
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            parar();
        } else {
            iniciar();
        }
    });

    mostrar(0);
    iniciar();
})();
