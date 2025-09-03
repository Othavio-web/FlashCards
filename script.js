// Variáveis de estado

let flippedCards = [] //array armazena cartas viradas (max duas)
let attempts = 0 // contador de tentativas do jogador


// lista de perguntas e respostas


    const flashcards = [
	{
		question: "O que é JavaScript?",
		answer: "JavaScript é uma linguagem de programação interpretada e orientada a objetos, usada principalmente para adicionar interatividade e dinamismo a páginas web."
	},
	{
		question: "O que são funções de callback em JavaScript?",
		answer: "São funções passadas como argumento para outra função, que serão executadas após um determinado evento ou operação."
	},
	{
		question: "O que é o this em JavaScript?",
		answer: "this se refere ao contexto de execução atual. Seu valor varia dependendo de como a função é chamada."
	},
	{
		question: "O que é hoisting em JavaScript?",
		answer: 'Hoisting é o comportamento em que declarações de variáveis e funções são "movidas" para o topo do escopo durante a fase de compilação. Isso faz com que seja possível usar uma função antes de sua definição no código.'
	},
	{
		question: "O que são tipos primitivos em JavaScript?",
		answer: "Os tipos primitivos em JavaScript são: String, Number, Boolean, Null, Undefined, BigInt e Symbol. Eles representam valores imutáveis e não são objetos."
	},
];



//objetivo de embaralhar as cartas
function shuffleCards(array){
    const shuffled = array.sort(()=> (math().randon() > 0.5? 1 : -1))// se valor positivo vai depois, se negativo vai antes
    return shuffled
}



function createCard(card){
    //cria elemento principal da carta
    const cardElement = document.createElement("div")
    cardElement.className = "card"

    //cria elemento emoji
    const resposta = document.createElement("span")
    resposta.className = "card-resposta"
    resposta.content = card.content

    //add elemento no card

    cardElement.appendChild(resposta)

    //add elemento de click na carta
    cardElement.addEventListener("click", ()=>handleCardClick(cardElement, card))

    return cardElement
}

//objetivo de renderizar as cartas
function renderCards(){
    const deck = document.getElementById("deck")
    deck.innerHTML=""
    const cards = shuffleCards(cardItems)
    cards.array.forEach(element => {
        const cardElement = createCard(element)
        deck.appendChild(cardElement)
    });
}

function handleCardClick(cardElement, card){    // ignora click quando verifica o par ou se já foi revelada
    if(card.classList.contains("revealed")){
        attempts--
        //remove classe que revela o conteudo
        cardE.classList.remove("revealed")
        return
    }else if(!cardElement.classList.contains("revealed")){
        attempts++
        //add classe que revela o conteudo
        cardElement.classList.add("revealed")
    }
    
    cardElement.classList.add("revealed")

    //add no array as cartas viradas
    flippedCards.push({cardElement, card})

    if(flippedCards.length===flashcards.length){
        console.log("todas as cartas foram lidas, reinicie o baralho")
        
    }
}

function resetGame(){
    flippedCards = []
    isCheckingPairs = false
    matchedPairs=0
    attempts=0
    cardItems.forEach((item)=>{item.mached=false})
    renderCards()
    updateStats()
}

function updateStats(){
    document.getElementById("stats").textContent = `${matchedPairs} cartas de ${flashcards.length} tentativas`
}

function initGame(){
    renderCards()

    document.getElementById("restart").addEventListener("click", resetGame)
}

function liberaProximaTentativa(){
    flippedCards = []
    isCheckingPairs = false
    updateStats()
}

initGame()