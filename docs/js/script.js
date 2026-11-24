
'use strict';

const configuracoes = {
    seletorAnimacao: [
        '.gatinhos-banner',
        '.header-section',
        '.gatinho-card',
        '.cuidados-texto',
        '.cuidados-imagem',
        '.convite-gatinhos'
    ].join(', '),

    distanciaObservacao: '0px 0px -60px 0px',
    limiteVisibilidade: 0.15,
    duracaoAnimacao: 700
};

const movimentoReduzido = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
);

function inicializarAnimacoes() {

    const elementos = document.querySelectorAll(
        configuracoes.seletorAnimacao
    );
    if (!elementos.length || movimentoReduzido.matches) {
        return;
    }
    if (!('IntersectionObserver' in window)) {
        return;
    }

    elementos.forEach((elemento, indice) => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(25px)';
        elemento.style.transition = `
            opacity ${configuracoes.duracaoAnimacao}ms ease,
            transform ${configuracoes.duracaoAnimacao}ms ease
        `;

        if (elemento.classList.contains('gatinho-card')) {
            elemento.style.transitionDelay = `${indice * 100}ms`;
        }
    });

    const observador = new IntersectionObserver((entradas, observer) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.style.opacity = '1';
                entrada.target.style.transform = 'translateY(0)';
                observer.unobserve(entrada.target);
            }
        });
    }, {
        root: null,
        rootMargin: configuracoes.distanciaObservacao,
        threshold: configuracoes.limiteVisibilidade
    });
    elementos.forEach(elemento => {
        observador.observe(elemento);
    });
}

function otimizarImagens() {

    const imagens = document.querySelectorAll(
        '.gatinho-imagem img, .cuidados-imagem img'
    );

    imagens.forEach(imagem => {
        imagem.loading = 'lazy';
        imagem.decoding = 'async';
        imagem.addEventListener('error', () => {
            imagem.alt = 'Imagem do gatinho temporariamente indisponível';
            imagem.classList.add('imagem-indisponivel');
        }, { once: true });
    });
}

function inicializarPagina() {
    otimizarImagens();
    inicializarAnimacoes();
}
inicializarPagina();
