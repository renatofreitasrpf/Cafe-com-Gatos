'use strict';

// sem o IIFE, as funcoes declaradas aqui viram propriedades do window
(function () {
    // um objeto por item; a categoria precisa casar com o id da secao no HTML
    const PRODUTOS = [
        {
            id: 'cappuccino',
            nome: 'Cappuccino',
            categoria: 'cafes',
            descricao: 'Café espresso com leite vaporizado e uma camada de espuma.',
            preco: 12.5,
            imagem: '../assets/images/cardapio/cappuccino.jpg'
        },
        {
            id: 'cafe-latte',
            nome: 'Café Latte',
            categoria: 'cafes',
            descricao: 'Uma combinação suave de espresso e leite cremoso.',
            preco: 14.9,
            imagem: '../assets/images/cardapio/cafeLatte.jpg'
        },
        {
            id: 'mocha',
            nome: 'Mocha',
            categoria: 'cafes',
            descricao: 'Café espresso com chocolate e leite vaporizado.',
            preco: 15.9,
            imagem: '../assets/images/cardapio/mocha.jpg'
        },
        {
            id: 'frappuccino',
            nome: 'Frappuccino',
            categoria: 'bebidas',
            descricao: 'Bebida gelada de café com leite e gelo.',
            preco: 19.9,
            imagem: '../assets/images/cardapio/frappuccino.jpg'
        },
        {
            id: 'iced-coffee',
            nome: 'Iced Coffee',
            categoria: 'bebidas',
            descricao: 'Extraído a frio por 12 horas, servido com gelo.',
            preco: 13.5,
            imagem: '../assets/images/cardapio/icedCoffee.jpg'
        },
        {
            id: 'croissant',
            nome: 'Croissant',
            categoria: 'salgados',
            descricao: 'Assado aqui de manhã. Se acabar, acabou.',
            preco: 11.9,
            imagem: '../assets/images/cardapio/croissant.jpg'
        },
        {
            id: 'sanduiche-natural',
            nome: 'Sanduíche Natural',
            categoria: 'salgados',
            descricao: 'Sanduíche fresco com queijo, frango e salada.',
            preco: 17.5,
            imagem: '../assets/images/cardapio/sanduicheNatural.jpg'
        },
        {
            id: 'brownie',
            nome: 'Brownie',
            categoria: 'doces',
            descricao: '70% cacau, massa densa, servido morno.',
            preco: 10.9,
            imagem: '../assets/images/cardapio/brownie.jpg'
        },
        {
            id: 'cheesecake',
            nome: 'Cheesecake',
            categoria: 'doces',
            descricao: 'Cheesecake cremoso com cobertura de frutas vermelhas.',
            preco: 16.9,
            imagem: '../assets/images/cardapio/cheesecake.jpg'
        }
    ];

    const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    const painel = document.querySelector('#carrinho');
    const itens = document.querySelector('#carrinho-itens');
    const total = document.querySelector('#carrinho-total');
    const quantidade = document.querySelector('#carrinho-quantidade');
    const botaoFechar = document.querySelector('#btn-fechar-carrinho');

    const botaoCarrinho = document.querySelector('#btn-carrinho');
    const badge = document.querySelector('#carrinho-badge');

    const containerProdutos = document.querySelector('.produtos-container');
    const linksCategoria = document.querySelectorAll('.categoria-link');

    // a gaveta do celular cobre a tela quase toda: la quem avisa que o item entrou eh o valor no botao
    const temEspacoLateral = window.matchMedia('(min-width: 701px)');

    if (!painel || !containerProdutos) {
        return;
    }

    // recarregar a pagina limpa carrinho
    const carrinho = [];

    function criarCard(produto) {
        return `
            <article class="card produto-card">
                <img src="${produto.imagem}" alt="" loading="lazy" decoding="async">
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <div class="produto-rodape">
                        <span class="produto-preco">${formatadorMoeda.format(produto.preco)}</span>
                        <button type="button" class="btn-adicionar" data-adicionar="${produto.id}" aria-label="Adicionar ${produto.nome} ao carrinho">
                            Adicionar
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    function renderizarProdutos() {
        containerProdutos.querySelectorAll('.produtos-grid').forEach((grade) => {
            const categoria = grade.closest('.categoria-produtos').id;

            grade.innerHTML = PRODUTOS
                .filter((produto) => produto.categoria === categoria)
                .map(criarCard)
                .join('');
        });
    }

    function adicionarAoCarrinho(id) {
        const produto = PRODUTOS.find((item) => item.id === id);

        if (!produto) {
            return;
        }

        const itemExistente = carrinho.find((item) => item.id === id);

        if (itemExistente) {
            itemExistente.quantidade += 1;
        } else {
            carrinho.push({ ...produto, quantidade: 1 });
        }

        // o painel aparece para confirmar, mas sem puxar o foco: da para seguir clicando no cardapio
        renderizarCarrinho();

        if (temEspacoLateral.matches) {
            abrirCarrinho(false);
        }
    }

    function alterarQuantidade(id, passo) {
        const item = carrinho.find((entrada) => entrada.id === id);

        if (!item) {
            return;
        }

        const posicao = carrinho.indexOf(item);

        item.quantidade += passo;

        if (item.quantidade <= 0) {
            carrinho.splice(posicao, 1);
        }

        renderizarCarrinho();

        // o innerHTML recria os botoes e derruba o foco; devolvo no equivalente
        if (painel.hidden) {
            botaoCarrinho.focus();
            return;
        }

        // item zerado sai da lista: o foco cai em quem ficou no lugar dele
        const vizinho = carrinho[Math.min(posicao, carrinho.length - 1)];
        const atual = itens.querySelector(
            `[data-acao="${passo > 0 ? 'aumentar' : 'diminuir'}"][data-id="${id}"]`
        );
        const proximo = itens.querySelector(
            `[data-acao="diminuir"][data-id="${vizinho.id}"]`
        );

        (atual || proximo || botaoFechar).focus();
    }

    function criarItemCarrinho(item) {
        return `
            <div class="carrinho-item">
                <div class="carrinho-item-info">
                    <strong>${item.nome}</strong>
                    <span>${item.quantidade} × ${formatadorMoeda.format(item.preco)}</span>
                </div>
                <div class="carrinho-item-acoes">
                    <button type="button" class="btn-quantidade" data-acao="diminuir" data-id="${item.id}" aria-label="Remover uma unidade de ${item.nome}">−</button>
                    <span class="carrinho-item-qtd">${item.quantidade}</span>
                    <button type="button" class="btn-quantidade" data-acao="aumentar" data-id="${item.id}" aria-label="Adicionar uma unidade de ${item.nome}">+</button>
                </div>
            </div>
        `;
    }

    function renderizarCarrinho() {
        itens.innerHTML = carrinho.length
            ? carrinho.map(criarItemCarrinho).join('')
            : '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';

        let valorTotal = 0;
        let unidades = 0;

        carrinho.forEach((item) => {
            valorTotal += item.preco * item.quantidade;
            unidades += item.quantidade;
        });

        const valorFormatado = formatadorMoeda.format(valorTotal);

        total.textContent = valorFormatado;
        badge.textContent = valorFormatado;
        quantidade.textContent = unidades;

        if (!carrinho.length) {
            ocultarCarrinho();
        }
    }

    function abrirCarrinho(moverFoco = true) {
        painel.hidden = false;
        botaoCarrinho.setAttribute('aria-expanded', 'true');

        if (moverFoco) {
            botaoFechar.focus();
        }
    }

    function ocultarCarrinho() {
        painel.hidden = true;
        botaoCarrinho.setAttribute('aria-expanded', 'false');
    }

    function fecharCarrinho() {
        ocultarCarrinho();
        botaoCarrinho.focus();
    }

    function fecharSeClicouFora(evento) {
        if (painel.hidden) {
            return;
        }

        const { target } = evento;

        if (painel.contains(target) || botaoCarrinho.contains(target) || target.closest('[data-adicionar]')) {
            return;
        }

        ocultarCarrinho();
    }

    containerProdutos.addEventListener('click', (evento) => {
        const botao = evento.target.closest('[data-adicionar]');

        if (botao) {
            adicionarAoCarrinho(botao.dataset.adicionar);
        }
    });

    itens.addEventListener('click', (evento) => {
        const botao = evento.target.closest('[data-acao]');

        if (!botao) {
            return;
        }

        const passo = botao.dataset.acao === 'aumentar' ? 1 : -1;

        alterarQuantidade(botao.dataset.id, passo);
    });

    botaoCarrinho.addEventListener('click', () => {
        if (painel.hidden) {
            abrirCarrinho();
        } else {
            fecharCarrinho();
        }
    });
    botaoFechar.addEventListener('click', fecharCarrinho);

    document.addEventListener('pointerdown', fecharSeClicouFora);

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && !painel.hidden) {
            fecharCarrinho();
        }
    });

    function ativarCategoria(id) {
        linksCategoria.forEach((link) => {
            const atual = link.getAttribute('href') === `#${id}`;

            link.classList.toggle('active', atual);

            if (atual) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    const secoes = document.querySelectorAll('.categoria-produtos');

    if ('IntersectionObserver' in window && secoes.length) {
        const observador = new IntersectionObserver(
            (entradas) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        ativarCategoria(entrada.target.id);
                    }
                });
            },
            // so a fatia do meio da tela decide a categoria ativa: sem isso ela troca cedo demais
            { rootMargin: '-25% 0px -60% 0px' }
        );

        secoes.forEach((secao) => observador.observe(secao));
    }

    renderizarProdutos();
    renderizarCarrinho();
})();
