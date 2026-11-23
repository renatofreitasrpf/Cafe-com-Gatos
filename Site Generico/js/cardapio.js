const produtos = [
    {
        nome: "Cappuccino",
        categoria: "cafes",
        descricao: "Café espresso com leite vaporizado e uma camada de espuma.",
        preco: 12.00,
        imagem: "../assets/images/cardapio/cappuccino.jpg"
    },

    {
        nome: "Café Latte",
        categoria: "cafes",
        descricao: "Uma combinação suave de espresso e leite cremoso.",
        preco: 14.00,
        imagem: "../assets/images/cardapio/cafelatte.jpg"
    },

    {
        nome: "Mocha",
        categoria: "cafes",
        descricao: "Café espresso com chocolate e leite vaporizado.",
        preco: 15.00,
        imagem: "../assets/images/cardapio/mocha.jpg"
    },

    {
        nome: "Frappuccino",
        categoria: "bebidas",
        descricao: "Bebida gelada de café com leite e gelo.",
        preco: 18.00,
        imagem: "../assets/images/cardapio/frappuccino.jpg"
    },

    {
        nome: "Iced Coffee",
        categoria: "bebidas",
        descricao: "Café especial servido gelado com muito sabor.",
        preco: 13.00,
        imagem: "../assets/images/cardapio/icedcoffee.jpg"
    },

    {
        nome: "Brownie",
        categoria: "doces",
        descricao: "Brownie de chocolate com casquinha crocante.",
        preco: 10.00,
        imagem: "../assets/images/cardapio/brownie.jpg"
    },

    {
        nome: "Cheesecake",
        categoria: "doces",
        descricao: "Cheesecake cremoso com cobertura de frutas vermelhas.",
        preco: 16.00,
        imagem: "../assets/images/cardapio/cheesecake.jpg"
    },

    {
        nome: "Croissant",
        categoria: "salgados",
        descricao: "Croissant artesanal, leve e amanteigado.",
        preco: 11.00,
        imagem: "../assets/images/cardapio/croissant.jpg"
    },

    {
        nome: "Sanduíche Natural",
        categoria: "salgados",
        descricao: "Sanduíche fresco com queijo, frango e salada.",
        preco: 17.00,
        imagem: "../assets/images/cardapio/sanduicheNatural.jpg"
    }
];

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

const carrinho = [];

const categorias = ["cafes", "bebidas", "salgados", "doces"];

function renderizarProdutos() {
    categorias.forEach(categoria => {
        const produtosFiltrados = produtos.filter(produto =>
            produto.categoria === categoria
        );

        const grid = document.querySelector(`#${categoria}-grid`);

        grid.innerHTML = "";

        produtosFiltrados.forEach(produto => {
            const card = document.createElement("article");
            card.classList.add("produto-card");

            const imagem = document.createElement("img");
            imagem.src = produto.imagem;
            imagem.alt = produto.nome;
            imagem.loading = "lazy";

            const informacoes = document.createElement("div");
            informacoes.classList.add("produto-info");

            const nome = document.createElement("h3");
            nome.textContent = produto.nome;

            const descricao = document.createElement("p");
            descricao.textContent = produto.descricao;

            const preco = document.createElement("span");
            preco.classList.add("produto-preco");

            preco.textContent = formatarPreco(produto.preco);

            const acoes = document.createElement("div");
            acoes.classList.add("produto-acoes");

            const botaoAdicionar = document.createElement("button");
            botaoAdicionar.classList.add("btn-adicionar");
            botaoAdicionar.textContent = "+";
            botaoAdicionar.setAttribute(
                "aria-label",
                `Adicionar ${produto.nome} ao carrinho`
            );

            botaoAdicionar.addEventListener("click", () => {
                adicionarAoCarrinho(produto);
            });

            acoes.appendChild(botaoAdicionar);

            informacoes.append(nome, descricao, preco,  acoes);
            card.append(imagem, informacoes);

            grid.appendChild(card);
        });
    });
}




function adicionarAoCarrinho(produto) {

    const produtoExistente = carrinho.find(item =>
        item.nome === produto.nome
    );

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }

    renderizarCarrinho();
    abrirCarrinho();
}

function removerDoCarrinho(nomeProduto) {

    const produtoExistente = carrinho.find(item =>
        item.nome === nomeProduto
    );
    if (produtoExistente) {

        produtoExistente.quantidade--;

        if (produtoExistente.quantidade === 0) {
            const indice = carrinho.indexOf(produtoExistente);
            carrinho.splice(indice, 1);
        }
    }

    renderizarCarrinho();
}


function renderizarCarrinho() {

    const painelCarrinho = document.querySelector("#carrinho");
    const carrinhoItens = document.querySelector("#carrinho-itens");
    const carrinhoTotal = document.querySelector("#carrinho-total");
    const carrinhoBadge = document.querySelector("#carrinho-badge");
    const carrinhoQuantidade = document.querySelector("#carrinho-quantidade");

    carrinhoItens.innerHTML = "";
    painelCarrinho.hidden = carrinho.length === 0;

    let total = 0;
    let quantidadeTotal = 0;

    carrinho.forEach(item => {

        const subtotal = item.preco * item.quantidade;

        total += subtotal;
        quantidadeTotal += item.quantidade;

        const elemento = document.createElement("div");
        elemento.classList.add("carrinho-item");
        const informacoes = document.createElement("div");
        informacoes.classList.add("carrinho-item-info");
        const nome = document.createElement("strong");
        nome.textContent = `${item.nome} x ${item.quantidade}`;
        const preco = document.createElement("span");
        preco.textContent = formatarPreco(subtotal);

        
        const controles = document.createElement("div");
        controles.classList.add("carrinho-item-acoes");

        const botaoAdicionar = document.createElement("button");
        botaoAdicionar.classList.add("btn-adicionar-quantidade");
        botaoAdicionar.textContent = "+";
        botaoAdicionar.setAttribute(
            "aria-label",
            `Adicionar uma unidade de ${item.nome}`
        );

        botaoAdicionar.addEventListener("click", () => {
            adicionarAoCarrinho(item);
        });
        const botaoRemover = document.createElement("button");
        botaoRemover.classList.add("btn-remover");
        botaoRemover.textContent = "−";
        botaoRemover.setAttribute(
            "aria-label",
            `Remover uma unidade de ${item.nome}`
        );

        botaoRemover.addEventListener("click", () => {
            removerDoCarrinho(item.nome);
        });

        controles.append(botaoAdicionar, botaoRemover);
        informacoes.append(nome, preco);
        elemento.append(informacoes, controles);
        carrinhoItens.appendChild(elemento);
    });

    carrinhoQuantidade.textContent = quantidadeTotal;
    carrinhoTotal.textContent = formatarPreco(total);
    carrinhoBadge.textContent = formatarPreco(total);
}


const linksCategorias = document.querySelectorAll(".categoria-link");

const secoesCategorias = document.querySelectorAll(".categoria-produtos");

function atualizarCategoria(id) {

    linksCategorias.forEach(link => {

        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
        );
    });
}

const observador = new IntersectionObserver((entradas) => {

    entradas.forEach(entrada => {

        if (entrada.isIntersecting) {
            atualizarCategoria(entrada.target.id);
        }
    });
}, {
    rootMargin: "-20% 0px -60% 0px"
});

secoesCategorias.forEach(secao => {
    observador.observe(secao);
});

renderizarProdutos();


const botaoCarrinho = document.querySelector("#btn-carrinho");
const botaoFecharCarrinho = document.querySelector("#btn-fechar-carrinho");
const painelCarrinho = document.querySelector("#carrinho");

function abrirCarrinho() {

    painelCarrinho.hidden = false;

    botaoCarrinho.setAttribute("aria-expanded", "true");
}

function fecharCarrinho() {

    painelCarrinho.hidden = true;

    botaoCarrinho.setAttribute("aria-expanded", "false");
}
botaoCarrinho.addEventListener("click", abrirCarrinho);
botaoFecharCarrinho.addEventListener("click", fecharCarrinho);
