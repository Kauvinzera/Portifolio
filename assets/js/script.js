const about = document.getElementById("about");
const swiperWrapper = document.querySelector(".swiper-wrapper");
// Seletor do Formulário
const formulario = document.querySelector('#formulario');

// Regex de validação do e-mail
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


const socialMedia = document.querySelector(".redes-sociais")


async function getAboutGithub() {
    try {
        const resposta = await fetch('https://api.github.com/users/Kauvinzera');
        const perfil = await resposta.json(); 
    
        about.innerHTML = '';

        about.innerHTML = `
        <figure class="about-image">
                <img src="${perfil.avatar_url}" alt="Foto do perfil - ${perfil.name}" >
            </figure>

        <article class="about-content">
            <h2>Sobre mim</h2>
            <p>
                Sou o Kauã, tenho 19 anos, atualmente estou estudando Front-end
            </p>
            <p>
                Sou o Kauã, desenvolvedor em formação com foco em desenvolvimento front-end. Tenho construído minha base com tecnologias como HTML, CSS e JavaScript, sempre buscando escrever código limpo, organizado e com boas práticas desde o início.
                Tenho interesse em criar interfaces modernas, responsivas e funcionais, priorizando a experiência do usuário e a performance das aplicações. Além disso, venho expandindo meus conhecimentos em desenvolvimento back-end, trabalhando com Node.js e APIs REST, o que me permite ter uma visão mais completa de sistemas web.
                Estou em constante evolução, estudando novas tecnologias e aprimorando minhas habilidades através de projetos práticos e desafios. Meu objetivo é me tornar um desenvolvedor completo, capaz de transformar ideias em soluções reais e eficientes.
            </p>

            <div class="about-buttons-data">
                <div class="buttons-container">
                    <a href="${perfil.html_url}" target="_blank" class="botao">GitHub</a>
                    <a href="https://drive.google.com/file/d/1XBP2YclJuIsrVE0opVCepvUZ5PgXcuSV/view?usp=sharing" target="_blank" class="botao-outline">Currículo</a>
                </div>

                <div class="data-container">
                    <div class="data-item">
                        <span class="data-number">${perfil.followers}</span>
                        <span class="data-label">Seguidores</span>
                    </div>
                    <div class="data-item">
                        <span class="data-number">${perfil.public_repos}</span>
                        <span class="data-label">Repositórios</span>
                    </div>
                </div>
            </div>
        </article>
    `;
    } catch (error) {
        console.log("Erro ao buscar dados do Github", error)
    }
}

async function getProjectsGithub() {
    try {
        
        const resposta = await fetch('https://api.github.com/users/Kauvinzera/repos?sort=updated&per_page=6'); //retorna os repositórios públicos de um usuário, permitindo ordenar os resultados (sort=updated) e limitar a quantidade de itens retornados (per_page=6)
        const repositorios = await resposta.json();

        swiperWrapper.innerHTML = ""

        //Cada ícone salvo na pasta dos icons
        const linguagens= {
            JavaScript: "javascript",
            TypeScript: "typescript",
            Python: "python",
            Java: "java",
            "C++": "c_plus",
            C: "c",
            "C#": "csharp",
            PHP: "php",
            Go: "go",
            Kotlin: "kotlin",
            Swift: "swift",
            HTML: "html",
            CSS: "css",
            GitHub: "github"
        };

        repositorios.forEach(repositorio => {
            
            //linguagem principal do determinado repositório caso não tenha uma, usa Github
            const linguagem = repositorio.language || 'GitHub'
        
            //Obtém a configuração do logo correspondente à linguagem principal do projeto, garantindo que sempre exista uma imagem válida. Caso o repositório não tenha uma linguagem padrão definida, utilizaremos o logo do 'GitHub' como padrão
            const logo = linguagens[linguagem] ?? linguagens["GitHub"]
        
            //Seleciona a logo montando a Url necessária mudando apenas o nome do logo
            const urlLogo = `./assets/icons/languages/${logo}.svg`

            //Formata o nome do repositório, substituindo hifens (-) e underlines (_) por espaços em branco, removendo caracteres especiais da string e convertendo o texto para letras maiúsculas
            const nomeFormatado = repositorio.name
            .replace(/[-_]/g,' ')
            .replace(/[^a-zA-Z0-9\s]/g,' ') //pegue todos os caracteres que NÃO (^) são letras, números ou espaços e substitua por um espaço (\s = qualquer tipo de separação invisível no texto)
            .toUpperCase();

            //responsável por limitar o tamanho da descrição do repositório. Quando o texto ultrapassa 100 caracteres, a função retorna os 97 primeiros caracteres seguidos de reticências (...), indicando a continuidade do conteúdo. Caso a descrição possua até 100 caracteres, o texto original é retornado sem alterações.  
            const truncar = (texto, limite) => texto.length > limite 
            ? texto.substring(0, limite) + '...' : texto

            //Adiciona a descrição pegando do Reposititorio e caso seja muito grande, ele usa o método truncar, se não existir descrição adiciona o texto 'Projeto desenvolvido no GitHub'
            const descricao = repositorio.description 
            ? truncar(repositorio.description, 100) 
            : 'Projeto desenvolvido no GitHub'

            //Responsável por gerar as tags do projeto. Quando o repositório possui tópicos (topics), são exibidos no máximo três. Caso não existam tópicos cadastrados, é apresentada uma única tag com a linguagem principal do repositório.
            //Para limitar a quantidade de tópicos, utiliza-se o método slice, que seleciona apenas os três primeiros itens do array. Em seguida, o método map é aplicado para percorrer esses itens e gerar dinamicamente as respectivas tags.
            const tags = repositorio.topics?.length > 0 
            ? repositorio.topics.slice(0,3).map(topic => `<span class="tag">${topic}</span>`).join('')
            : `<span class="tag">${linguagem}</span>`;

            //verificará se o repositório possui o link do deploy (endereço da home page). Se existir, ele gera o botão com o link de acesso ao deploy.
            const botaoDeploy = repositorio.homepage
            ? `<a 
            href="${repositorio.homepage}" target="_blank" class="botao-outline botao-sm">Deploy
            </a>`
            : ''

            //Cria os botões de ação do card (Link do GitHub e Link do Deploy, se disponível)
            const botoesAcao = `
                <div class="project-buttons">
                    <a href="${repositorio.html_url}" target="_blank" class="botao botao-sm">
                        GitHub
                    </a>
                    ${botaoDeploy}
                </div>
            `;

            swiperWrapper.innerHTML += `
                
                <div class="swiper-slide">

                    <article class="project-card">
                        <figure class="project-image">
                            <img src="${urlLogo}" alt="Ícone ${linguagem}" onerror="this.onerror=null; this.src='./assets/icons/languages/github.svg';">
                        </figure>

                        <div class="project-content">
                            <h3>${nomeFormatado}</h3>
                            <p>${descricao}</p>
                            <div class="project-tags">${tags}</div>
                            ${botoesAcao}
                        </div>
                    </article>
                </div>
            `;
        });

         iniciarSwiper()

        //inicializar o carrossel de projetos utilizando a biblioteca Swiper
        function iniciarSwiper(){
            new Swiper('.projects-swiper', { //Cria uma nova instância do Swiper, associando o carrossel ao elemento HTML identificado pela classe 
                slidesPerView: 1, //Define que apenas 1 slide será exibido por vez no layout padrão.
                sliderPerGroup: 1, //Determina que o avanço do carrossel ocorrerá de 1 slide por grupo a cada navegação.
                spaceBetween: 24, //Define o espaçamento padrão de 24px entre os slides.
                centeredSlides: false, // Indica que os slides não serão centralizados no container.
                loop: true, //Ativa o modo de loop, fazendo com que o carrossel volte ao início após o último slide
                watchOverflow: true, //Habilita a verificação de overflow, evitando comportamentos incorretos quando a quantidade de slides for menor que o necessário.

                //Define o objeto breakpoints, responsável por controlar o comportamento do carrossel de acordo com a largura da tela
                breakpoints: {
                    0: { //TELA ATÉ 768 PIXEIS
                        slidesPerView: 1,
                        sliderPerGroup: 1,
                        spaceBetween: 40,
                        centeredSlides: false,
                    }, 
                    769: { //TELA ATÉ 1024 PIXEIS
                        slidesPerView: 2,
                        sliderPerGroup: 2,
                        spaceBetween: 40,
                        centeredSlides: false,
                    },     
                    1025: { //TELA MAIOR QUE 1025 PIXEIS
                        slidesPerView: 3,
                        sliderPerGroup: 3,
                        spaceBetween: 54,
                        centeredSlides: false,
                    }
                },   
                //Define o sistema de navegação por setas
                navigation: {
                    nextEl: '.swiper-button-next', //Associa o botão de classe swiper-button-next como Next
                    prevEl: '.swiper-button-prev', //Associa o botão de classe swiper-button-prev como Prev
                },
                //Define a configuração da paginação do carrossel
                pagination: {
                    el: '.swiper-pagination', // Associa a paginação ao elemento .swiper-pagination
                    clickable: true, //Permite que os indicadores de paginação sejam clicáveis
                    dynamicBullets: true, //Ativa o uso de bullets dinâmicos, ajustando a quantidade visível conforme a navegação
                },
                //Configura o autoplay do carrosse
                autoplay: {
                    delay: 5000, //Define um intervalo de 5 segundos entre as transições automáticas
                    pauseOnMouseEnter: true, //Pausa o autoplay quando o usuário posiciona o mouse sobre o carrossel
                    disableOnInteraction: false, //Garante que o autoplay continue ativo mesmo após interação manual
                },

                grabCursor: true, //Ativa o cursor em formato de “mão”, indicando que o carrossel pode ser arrastado
                slidesOffsetBefore: 0, //Define que não haverá deslocamento inicial antes do primeiro slide
                slidesOffsetAfter: 0,  //Define que não haverá deslocamento adicional após o último slide 
            }) ;
        };
            
    } catch (error) {
        console.log("Erro ao buscar repositórios", error)
    }
        
}

async function linksContact() {
    const github = await fetch('https://api.github.com/users/Kauvinzera');    
    const perfil = await github.json();

    socialMedia.innerHTML = "" 

    socialMedia.innerHTML = `
            <div class="social-container">
                <a href="https://www.linkedin.com/in/kauaviniciussabino2707" target="_blank" class="social-icon" aria-label="LinkedIn">
                    <img src="assets/icons/social/linkedin.svg" alt="Link para o LinkedIn" class="linkedin">
                </a>
                <a href="${perfil.html_url}" target="_blank" class="social-icon" aria-label="GitHub">
                    <img src="assets/icons/social/github.svg" alt="Link para o GitHub" class="github">
                </a>
                <a href="https://www.instagram.com/kauvin_sabino/" target="_blank" class="social-icon" aria-label="Instagram">
                    <img src="assets/icons/social/instagram.svg" alt="Link para o Instagram" class="instagram">
                </a>
            </div>

    ` 
}


//Função de Validação do Formulário
formulario.addEventListener('submit', function(event){ //submit permite interceptar o envio dos dados para realizar a validação antes do envio.
    event.preventDefault(); //impedindo o envio automático do formulário até que todas as validações sejam concluídas

    document.querySelectorAll('form span').forEach(span => span.innerHTML = '');

    let isValid = true;

    const nome = document.querySelector('#nome');
    const erroNome = document.querySelector('#erro-nome');


    //função trim() é utilizada para remover os espaços em branco no início e no final de uma string. Esses espaços geralmente são inseridos pelo usuário de forma involuntária, especialmente em campos de formulário, e podem causar problemas em validações e comparações de dados.
    if (nome.value.trim().length < 3) {
        erroNome.innerHTML = 'O Nome deve ter no mínimo 3 caracteres.';
        if (isValid) nome.focus(); //Função focus() é usada para dar foco a um elemento HTML, como um campo de entrada, botão ou link.
        isValid = false;
    }

    const email = document.querySelector('#email');
    const erroEmail = document.querySelector('#erro-email');

    if (!email.value.trim().match(emailRegex)) {
       erroEmail.innerHTML = 'Digite um e-mail válido';
        if(isValid) email.focus();
        isValid = false;
    }

    const assunto = document.querySelector('#assunto');
    const erroAssunto = document.querySelector('#erro-assunto');

    if(assunto.value.trim().length < 5) {
        erroAssunto.innerHTML = 'O assunto deve ter no mínimo 5 caracteres.'
        if(isValid) assunto.focus();
        isValid = false;
    }

    const message = document.querySelector('#message');
    const erroMessage = document.querySelector('#erro-message');

    if(message.value.trim().length === 0) {
        erroMessage.innerHTML = 'A mensagem não pode ser vazia';
        if(isValid) message.focus();
        isValid = false;
    }

    if(isValid) {
        const submitButton = formulario.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        formulario.submit();
    }
});


//Executar a função ao carregar o script
getAboutGithub();
getProjectsGithub();  
linksContact();      

        