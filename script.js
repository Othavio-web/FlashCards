// Lista de flashcards (pergunta e resposta)
    const flashcards = [
      { front: "O que é o this em JavaScript?", back: "this se refere ao contexto de execução atual. Seu valor varia dependendo de como a função é chamada." },
      { front: "O que são funções de callback em JavaScript?", back: "São funções passadas como argumento para outra função, que serão executadas após um determinado evento ou operação." },
      { front: "O que é JavaScript?", back: "JavaScript é uma linguagem de programação interpretada e orientada a objetos, usada principalmente para adicionar interatividade e dinamismo a páginas web." },
      { front: "O que é hoisting em JavaScript?", back: "Hoisting é o comportamento em que declarações de variáveis e funções são 'movidas' para o topo do escopo durante a fase de compilação. Isso faz com que seja possível usar uma função antes de sua definição no código." },
      { front: "O que são tipos primitivos em JavaScript?", back: "Os tipos primitivos em JavaScript são: String, Number, Boolean, Null, Undefined, BigInt e Symbol. Eles representam valores imutáveis e não são objetos." }
    ];

    let currentIndex = 0;
    const card = document.getElementById("card");
    const front = document.getElementById("question");
    const back = document.getElementById("answer");

    // Função para mostrar o card atual
    function showCard(index) {
      front.textContent = flashcards[index].front;
      back.textContent = flashcards[index].back;
      card.classList.remove("flipped"); // volta para frente
    }

    // Navegação
    function nextCard() {
      currentIndex = (currentIndex + 1) % flashcards.length;
      showCard(currentIndex);
    }

    function prevCard() {
      currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
      showCard(currentIndex);
    }

    // Virar o card
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });

    // Mostrar o primeiro card ao iniciar
    showCard(currentIndex);