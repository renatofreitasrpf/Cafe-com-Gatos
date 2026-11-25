// o guarda de saida la embaixo usa return: fora de uma funcao isso nem carrega
(function () {
    // os mesmos gatos da pagina Nossos Gatinhos: se um nome mudar la, muda aqui tambem
    const GATINHOS = [
        {
            id: 'lindsay',
            nome: 'Lindsay Lohan',
            idade: '4 meses',
            faixa: 'filhote',
            descricao: 'Observa tudo antes de chegar perto. Com paciência, ganha confiança rápido e vira companhia para o dia inteiro.',
            imagem: '../assets/images/gatinhos/gato-tricolor.jpg',
            tags: ['Vacinada', 'Vermifugada', 'Castração agendada']
        },
        {
            id: 'coco',
            nome: 'Côco',
            idade: '1 ano',
            faixa: 'adulto',
            descricao: 'Cheio de energia e curiosidade. Precisa de brinquedos, prateleiras e alguém disposto a brincar todos os dias.',
            imagem: '../assets/images/gatinhos/gato-branco.jpg',
            tags: ['Vacinado', 'Vermifugado', 'Castrado', 'Assusta com aspirador']
        },
        {
            id: 'carioca',
            nome: 'Carioca',
            idade: '3 anos',
            faixa: 'adulto',
            descricao: 'Tranquilo e carinhoso, passa boa parte do dia dormindo. Estranha barulho alto no começo e convive bem com outros gatos.',
            imagem: '../assets/images/gatinhos/gato-preto.jpg',
            tags: ['Vacinado', 'Vermifugado', 'Castrado']
        },
        {
            id: 'angelico',
            nome: 'Angélico Ferreira',
            idade: '6 meses',
            faixa: 'filhote',
            descricao: 'Especialista em achar o melhor canto para dormir. Dócil, gosta de colo e de um ambiente calmo para as sonecas.',
            imagem: '../assets/images/gatinhos/gato-laranja.jpg',
            tags: ['Vacinado', 'Vermifugado', 'Castração agendada']
        }
    ];

    const lista = document.querySelector('#lista-adocao');
    const status = document.querySelector('#status-adocao');
    const molde = document.querySelector('#molde-gatinho');
    const filtros = document.querySelectorAll('[data-filtro]');
    const dialogo = document.querySelector('#dialogo-adocao');

    if (!lista || !status || !molde || !dialogo) {
        return;
    }

    const form = document.querySelector('#form-adocao');
    const sucesso = document.querySelector('#form-sucesso');
    const sucessoTitulo = document.querySelector('#sucesso-titulo');
    const dialogoGatinho = document.querySelector('#dialogo-gatinho');
    const campoGatinho = document.querySelector('#campo-gatinho');
    const campoNome = document.querySelector('#adotante-nome');

    // a foto vai sem alt: o h3 logo abaixo ja diz o nome
    function montarFicha(gatinho) {
        const card = molde.content.cloneNode(true);
        const imagem = card.querySelector('img');

        imagem.src = gatinho.imagem;

        card.querySelector('.adocao-topo h3').textContent = gatinho.nome;
        card.querySelector('.chip').textContent = gatinho.idade;
        card.querySelector('.adocao-info p').textContent = gatinho.descricao;

        const tags = card.querySelector('.adocao-tags');

        gatinho.tags.forEach((tag) => {
            const item = document.createElement('li');
            item.textContent = tag;
            tags.append(item);
        });

        card.querySelector('[data-adotar]').dataset.adotar = gatinho.id;

        return card;
    }

    // na carga inicial nao anuncio: quem chega na pagina ja ouve a lista inteira
    function mostrarGatinhos(faixa, anunciar = true) {
        const selecionados = GATINHOS.filter(
            (gatinho) => faixa === 'todos' || gatinho.faixa === faixa
        );

        lista.replaceChildren();

        if (!selecionados.length) {
            const aviso = document.createElement('p');
            aviso.className = 'adocao-vazio';
            aviso.textContent =
                'Nenhum gatinho nesta faixa por enquanto. Fale com a gente pelo Instagram para saber das próximas chegadas.';
            lista.append(aviso);
        } else {
            selecionados.forEach((gatinho) => lista.append(montarFicha(gatinho)));
        }

        // o contador eh o que muda; a grade inteira nao precisa ser reanunciada
        if (anunciar) {
            status.textContent = `${selecionados.length} ${
                selecionados.length === 1 ? 'gatinho disponível' : 'gatinhos disponíveis'
            }`;
        }
    }

    filtros.forEach((botao) => {
        botao.addEventListener('click', () => {
            filtros.forEach((outro) => {
                outro.setAttribute('aria-pressed', String(outro === botao));
            });

            mostrarGatinhos(botao.dataset.filtro);
        });
    });

    function abrirFormulario(gatinho) {
        form.reset();
        form.hidden = false;
        sucesso.hidden = true;
        dialogoGatinho.textContent = `Interesse em adotar ${gatinho.nome}:`;
        campoGatinho.value = gatinho.nome;

        dialogo.showModal();
        document.body.style.overflow = 'hidden';
        campoNome.focus();
    }

    // o <dialog> devolve o foco para o botao que abriu sozinho, entao nao guardo nada
    function fecharFormulario() {
        dialogo.close();
    }

    lista.addEventListener('click', (evento) => {
        const botao = evento.target.closest('[data-adotar]');

        if (!botao) {
            return;
        }

        const gatinho = GATINHOS.find((item) => item.id === botao.dataset.adotar);

        if (gatinho) {
            abrirFormulario(gatinho);
        }
    });

    dialogo.querySelectorAll('[data-fechar-dialogo]').forEach((botao) => {
        botao.addEventListener('click', fecharFormulario);
    });

    dialogo.addEventListener('click', (evento) => {
        if (evento.target === dialogo) {
            fecharFormulario();
        }
    });

    dialogo.addEventListener('close', () => {
        document.body.style.overflow = '';
    });

    form.addEventListener('submit', (evento) => {
        evento.preventDefault();

        // nada sai daqui: a demonstracao so troca o formulario pela confirmacao
        const primeiroNome = campoNome.value.trim().split(' ')[0];

        form.hidden = true;
        sucesso.hidden = false;
        sucessoTitulo.textContent = `Obrigado, ${primeiroNome}!`;
        sucesso.querySelector('[data-fechar-dialogo]').focus();
    });

    mostrarGatinhos('todos', false);
})();
