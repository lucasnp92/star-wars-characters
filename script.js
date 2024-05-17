// Essa variável abaixo vai armazenar a nossa URL da API, ou seja o endpoint da API para requisitar os dados necessários
// Vamos utilizar o let porque o valor dessa variável vai mudar constantemente ao longo da navegação. Se fossemos
// usar const isso não seria possivel, porque o valor da constante é fixo
let currentPageUrl = 'https://swapi.dev/api/people/';

// A função abaixo significa que toda vez que a minha página for carregada ela vai chamar a minha função
// Utilizamos abaixo o que chamamos de bloco try catch, que significa que ele vai tentar executar o que está no
// try (tentativa), se der sucesso OK, se não der sucesso ele vai prosseguir para o catch, para realizar a minha
// função. A função abaixo é uma função assíncrona, por isso usamos o async e o await, é uma promisse
window.onload = async () => {
    try {
        // Aqui está basciamente a principal função do nosso projeto. Ela vai pegar a URL acima e vai fazer uma
        // requisição para API e vai trazer os resultados, e depois transformar esses dados em Cards. Ela vai 
        // ter como argumento a variável currentPageUrl
        await loadCharacters(currentPageUrl);

    // No nosso catch vamos colocar um erro no console e um alerta para o usuário caso o card não seja executado 
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards')
    }

    const nextButton = document.getElementById('next-button');
    // O addEventListener vai monitorar eventos nesse elemento, que nesse caso serão os butões, e o monitoramento
    // será o click, que toda vez que eu clicar nesse butão a gente vai executar a função loadNextPage criado
    // no nosso projeto
    nextButton.addEventListener('click', loadNextPage);

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', loadPreviousPage);
};

async function loadCharacters(url) {
    // Com o get element by id estamos manipulando elementos usando o DOM, vamos pegar um elemento de dentro do
    // HTML para manipulá-lo por meio do JavaScript, vamos pegar o id desse elemento no nosso HTML.
    const mainContent = document.getElementById('main-content');
    // Aqui nós vamos modificar o HTML que está dentro desse elemento, e como valor uma string vazia, ou seja, ele
    // vai limpar os resultados anteriores, se não vai carregar varios cards, ficando um conteúdo gigante
    mainContent.innerHTML = '';

    try {
        // essa variável vai armazenar os dados que receber nessa requisição
        const response = await fetch(url);
        // Porque utilizar Json? O que recebemos da nossa requisição ele não vem em formato Json. Isso é necessário
        // para se iterar com os arrays
        const responseJson = await response.json();

        // Porque usamos esse 'results'? Quando abrimos a documentação da API vemos que os personagens estão
        // dentro de results, que é o que nos interessa. o forEach vai fazer um loop, ele ai iterar com todos
        // os objetos do nosso array, objeto por objeto.
        responseJson.results.forEach((character) => {
            // Vamos utilizar para criar cada card um novo método chamado createElement, que vai criar um elemento
            // ou uma tag HTML, pode ser qualquer uma, uma div, um novo span, h1, etc
            const card = document.createElement("div");
            // Aqui vamos utilizar crases porque vamos fazer uma template string, para concatenar uma variável aqui
            // dentro da URL, ela precisa ser dinâmica. Abaixo vamos utilizar o método replace vamos extrair 
            // somente o ID que precisamos de cada imagem e para isto vamos utilizar uma expressão regular, regexp
            // O regexp procura um padrão dentro de um grupo de caracteres.
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')` 
            card.className = "cards"

            const characterNameBG = document.createElement("div")
            characterNameBG.className = "character-name-bg"

            const characterName = document.createElement("span")
            characterName.className = "character-name"
            // Aqui queremos que o nome de cada personagem seja dinâmico e não estático no mesmo nome. Por meio
            // do innerText estou pedindo para mudar o conteuo de texto desse elemento
            characterName.innerText = `${character.name}`

            // Precisamos agora organizar os cards, colocar as informações uma dentro do outra de maneira
            // organizada, porque elas ainda estão soltas. Usamos o appendChild. Ele vai pegar um elemento
            // filho e colocar dentro de uma elemento pai. Aqui pegamos o characterName que ó span criado
            // anteriormente e colocamos ele dentro do characterNameBg
            characterNameBG.appendChild(characterName)

            // Aqui pegamos o characterNameBg e colocamos ele dentro do card
            card.appendChild(characterNameBG)

            // Quando eu clicar no card ele vai fazer com que o meu modal apareça em tela
            card.onclick = () => {
                const modal = document.getElementById("modal")
                // Quando eu clicar ele vai alterar o estilo para visible
                modal.style.visibility = "visible"

                // Abaixo nós criamos essa variável para limpar todas as informações do modal-content
                // É necessário usar uma string vazia como no código abaixo
                const modalContent = document.getElementById("modal-content")
                modalContent.innerHTML = ''

                // Abaixo estamos criando nossas div assim como foi feito nos cards, e posteriormente vamos
                // estilizá-los dentro do nosso CSS
                const characterImage = document.createElement("div")
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg'`
                characterImage.className = "character-image"

                // Abaixo estamos criando os spans do nosso modal, com as caracteristicas de cada personagem
                const name = document.createElement("span")
                name.className = "character-details"
                // Aqui utilizamos template string para poder pegar o nome de cada personagem, que estamos recebendo
                // do método forEach, ai dentro do span estamos aproveitando o name
                name.innerText = `Nome: ${character.name}`

                // Nos próximos dados, basta alterar os dados correspondentes, de acordo com o nome que está na API
                // Veja que abaixo eu chamei a função convertHeight, criado no final da página, para alterar
                // valores que eu receber da minha api do inglês para o português, fiz isso também com os seguintes
                const characterHeight = document.createElement("span")
                characterHeight.className = "character-details"
                characterHeight.innerText = `Altura: ${convertHeight(character.height)}`

                const mass = document.createElement("span")
                mass.className = "character-details"
                mass.innerText = `Peso: ${convertMass(character.mass)}`

                const eyeColor = document.createElement("span")
                eyeColor.className = "character-details"
                eyeColor.innerText = `Cor dos Olhos: ${convertEyeColor(character.eye_color)}`

                const birthYear = document.createElement("span")
                birthYear.className = "character-details"
                birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`

                // Agora nós estamos jogando dentro do elemento pai os elementos filhos, um a um. O primeiro
                // que estamos colocando é a Imagem do personagem (characterImage)
                modalContent.appendChild(characterImage)
                modalContent.appendChild(name)
                modalContent.appendChild(characterHeight)
                modalContent.appendChild(mass)
                modalContent.appendChild(eyeColor)
                modalContent.appendChild(birthYear)
            }

            // O mesmo foi feito para o card em relação ao mainContent
            mainContent.appendChild(card);

        });

        // Repetimos essas variáveis dos botões nessa parte porque estamos em outro escopo, para executar outras
        // funcionalidades a esses botões.
        const nextButton = document.getElementById('next-button');
        const backButton = document.getElementById('back-button');

        // Abaixo vamos manipular o nosso disabled, se ele for TRUE vai estar desabilitado. Ou seja, ele vai estar
        // desabilitado quando o responseJson.next for falso (por isso o uso da '!' é a negação). Na prática,
        // na API quando houver o next o botão vai ficar habilitado para passar pra proxima página, e quando
        // não houver o next na API, o botão ficará desabilitado.
        nextButton.disabled = !responseJson.next;
        backButton.disabled = !responseJson.previous;

        // Inicialmente o botão de voltar fica invisible, por não ter uma página anterior à primeira página,
        // então nós vamos manipular o estilo 'visibility' do meu CSS desse elemento. Vamos utilizar um
        // operador ternário para verificar, na resposta que vem da API eu vou perguntar: tem um previous?
        // E na resposta, caso tenha um previous, ele vai ficar visível, se não ele vai ficar escondido (hidden)
        backButton.style.visibility = responseJson.previous ? "visible" : "hidden";
        // Abaixo funciona da mesma lógica, se não houver na API uma próxima pagina, o botão next ficará invisível
        nextButton.style.visibility = responseJson.next ? "visible" : "hidden";

        currentPageUrl = url

    } catch (error) {
        alert('Erro ao carregar personagens')
        console.log(error)
    }
}

// Aqui nós basicamente vamos prevenir um erro, ou seja, ele só vai executar o loadNextPage quando existir
// um valor dentro da variável currentPageUrl. (Se o valor da variável !currentPageUrl for nulo ele vai dar return
// vai interromper a execução da função, se não houver essa URL da próxima página, não faz sentido executar a função)
async function loadNextPage() {
    if (!currentPageUrl) return;

    // Abaixo estou fazendo uma requisição para a nossa API, onde ele vai armazenar em response, depois vou
    // transformar essa requisição em Json.
    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()
        // Após recebido a requisição ele vai puxar na API e vai mandar como argumento o next da próxima página
        await loadCharacters(responseJson.next)

    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a próxima página')
    }
}

// O botão de volta é basicamente a mesma coisa do botão next só mudando os valores corretamente
async function loadPreviousPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadCharacters(responseJson.previous)

    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a página anterior')
    }
}

function hideModal() {
    // Abaixo agora essa variável representa o modal, e podemos agora manipular o elemento
    const modal = document.getElementById("modal")
    // Toda vez que essa função for chamada ela vai colocar a visibilidade como hidden. O elemento ele já existe
    // porém, ele só vai aparecer em tela quando clicarmos no card
    modal.style.visibility = "hidden"
}

// Todos os dados que vem da API estão em ingles, então vamos criar funções que vamos alterar o nome do resultado
// recebido pelo API de acordo com o que for compativél com os dados do meu objeto.

// A função abaixo significa que, se aquele dado recebido da API está presente no meu objeto cores, ele faz
// uma comparação, se ele estiver ele vai atribuir o valor que está na devida chave do meu objeto
function convertEyeColor(eyeColor) {
    const cores = {
        blue: "azul",
        brown: "castanho",
        green: "verde",
        yellow: "amarelo",
        black: "preto",
        pink: "rosa",
        red: "vermelho",
        orange: "laranja",
        hazel: "avelã",
        unknown: "desconhecida"
    };
    // Abaixo significa que ele vai retornar o valor devido, caso ele esteja presente no meu objeto Cores
    // coloquei para que todos os dados sejam colocados em letra minúscula
    return cores[eyeColor.toLowerCase()] || eyeColor;
}

// Abaixo é a função para converter o height e passar o valor como casa decimal
function convertHeight(height) {
    // Se o peso for idêntico à unknown ele vai retornar desconhecida
    if (height === "unknown") {
        return "desconhecida"
    }
    // Não sendo desconhecida ele vai retornar a altura divida por 100 e vai retornar o
    // o número quebrado (caso tenha) e colocar esse número quebrado em duas casas decimais
    return (height / 100).toFixed(2);
}

function convertMass(mass) {
    if (mass === "unknown") {
        return "desconhecido"
    }
    // Vamos utilizar o mesmo dado da API só que adicionando o kg no final. Como é o mesmo dado, usamos o 
    // template string
    return `${mass} kg`
}

function convertBirthYear(birthYear) {
    if (birthYear === "unknown") {
        return "desconhecido"
    }

    return birthYear
}