// Variáveis de estado globais
let currentFloor = 'T';
let isMoving = false;
let doorsOpen = true;
let targetFloor = null;
let floorQueue = [];

// Mapeamento de andares para índices numéricos
const floorValues = {
    '3': 3,
    '2': 2,
    '1': 1,
    'T': 0
};

// Mapeamento de nomes de andares
const floorNames = {
    '3': 'Diretoria',
    '2': 'RH e Marketing',
    '1': 'Desenvolvimento',
    'T': 'Recepção'
};

// Mapeamento de sequência de andares (para transição)
const floorSequence = ['3', '2', '1', 'T'];

// Elementos DOM
let building;
let gameContainer;
let elevatorElement;
let elevatorDoors;
let elevatorDisplay;
let floorButtons;
let movingIndicator;
let directionIcon;
let floorTransition;
let clickOverlay;

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log("Jogo iniciado!");
    
    // Inicializa referências aos elementos DOM
    building = document.querySelector('.building');
    gameContainer = document.querySelector('.game-container');
    elevatorElement = document.querySelector('.elevator');
    elevatorDoors = document.querySelector('.elevator-doors');
    elevatorDisplay = document.querySelector('.elevator-display');
    floorButtons = document.querySelectorAll('.floor-button');
    movingIndicator = document.querySelector('.elevator-moving-indicator');
    directionIcon = document.querySelector('.direction i');
    floorTransition = document.querySelector('.floor-transition');
    clickOverlay = document.querySelector('.click-overlay');
    
    // Inicializa as portas abertas
    elevatorDoors.classList.add('doors-open');
    
    // Configura o elevador no andar térreo
    moveToFloor('T', true);
});

// Função global para requisitar andar (usada pelo onclick)
function requestFloor(floor) {
    console.log("Botão clicado para o andar:", floor);
    
    // Evita múltiplos cliques durante animações
    if (clickOverlay.classList.contains('active')) {
        console.log("Bloqueado - animação em andamento");
        return;
    }
    
    // Se já estiver no andar solicitado e as portas abertas, não faz nada
    if (floor === currentFloor && doorsOpen) {
        console.log("Já estamos neste andar com portas abertas");
        return;
    }
    
    // Adiciona o andar à fila se não estiver já
    if (!floorQueue.includes(floor) && floor !== currentFloor) {
        floorQueue.push(floor);
        console.log("Andar adicionado à fila:", floorQueue);
        
        // Destaca o botão do andar na fila
        const button = document.getElementById(`button-${floor}`);
        if (button) {
            button.classList.add('active');
        }
    }
    
    // Se o elevador não estiver em movimento, inicia a movimentação
    if (!isMoving) {
        processQueue();
    }
}

// Processa a fila de andares
function processQueue() {
    if (floorQueue.length === 0) {
        isMoving = false;
        return;
    }
    
    isMoving = true;
    targetFloor = floorQueue[0];
    
    // Prevenir cliques durante a animação
    clickOverlay.classList.add('active');
    
    // Se as portas estiverem abertas, fecha-as primeiro
    if (doorsOpen) {
        closeDoors().then(() => {
            moveElevator();
        });
    } else {
        moveElevator();
    }
}

// Move o elevador para o andar de destino
function moveElevator() {
    console.log("Movendo elevador de", currentFloor, "para", targetFloor);
    
    // Determina a direção baseado nos valores numéricos dos andares
    const isGoingUp = floorValues[targetFloor] > floorValues[currentFloor];
    
    // Atualiza indicador de movimento e animação de direção
    if (isGoingUp) {
        // Subindo
        directionIcon.className = 'fas fa-arrow-up';
        gameContainer.classList.add('moving-up');
        gameContainer.classList.remove('moving-down');
    } else {
        // Descendo
        directionIcon.className = 'fas fa-arrow-down';
        gameContainer.classList.add('moving-down');
        gameContainer.classList.remove('moving-up');
    }
    
    // Mostra o indicador
    movingIndicator.classList.add('visible');
    
    // Simula a transição entre andares
    floorTransition.classList.add('active');
    
    // Calcula quantos andares precisamos mover
    const currentIndex = floorSequence.indexOf(currentFloor);
    const targetIndex = floorSequence.indexOf(targetFloor);
    const floorsToMove = Math.abs(targetIndex - currentIndex);
    
    // Calcula o tempo de movimento baseado no número de andares
    const moveTime = 1500 * floorsToMove;
    
    // Faz o movimento do prédio através de CSS transform
    setTimeout(() => {
        moveToFloor(targetFloor);
        
        // Remove a transição após um momento
        setTimeout(() => {
            floorTransition.classList.remove('active');
            
            // Remove as classes de movimento
            gameContainer.classList.remove('moving-up', 'moving-down');
            
            // Finaliza o movimento
            finishMovement();
        }, 500);
    }, moveTime);
}

// Move o elevador para um andar específico
function moveToFloor(floor, immediate = false) {
    currentFloor = floor;
    
    // Atualiza o display do elevador
    elevatorDisplay.textContent = floor;
    
    // Posiciona o prédio no andar correto (com ou sem animação)
    if (immediate) {
        building.style.transition = 'none';
        building.style.transform = `translateY(${floorValues[floor] * 100}vh)`;
        // Força um reflow para aplicar o estilo imediatamente
        void building.offsetWidth;
        building.style.transition = '';
    } else {
        building.style.transform = `translateY(${floorValues[floor] * 100}vh)`;
    }
}

// Finaliza o movimento do elevador
function finishMovement() {
    console.log("Chegou ao destino:", targetFloor);
    
    // Esconde o indicador de movimento
    movingIndicator.classList.remove('visible');
    
    // Remove da fila e desativa o botão
    floorQueue.shift();
    const button = document.getElementById(`button-${currentFloor}`);
    if (button) {
        button.classList.remove('active');
    }
    
    // Abre as portas
    openDoors().then(() => {
        // Libera os cliques
        clickOverlay.classList.remove('active');
        
        // Espera um pouco antes de processar o próximo andar da fila
        setTimeout(() => {
            if (floorQueue.length > 0) {
                processQueue();
            } else {
                isMoving = false;
            }
        }, 2000);
    });
}

// Abre as portas do elevador
function openDoors() {
    return new Promise(resolve => {
        if (!doorsOpen) {
            console.log("Abrindo portas");
            // Mostra os botões de andar
            elevatorElement.classList.remove('buttons-hidden');
            
            elevatorDoors.classList.add('doors-open');
            elevatorDoors.classList.remove('doors-closed');
            doorsOpen = true;
            setTimeout(resolve, 1000); // Tempo para abrir as portas
        } else {
            resolve();
        }
    });
}

// Fecha as portas do elevador
function closeDoors() {
    return new Promise(resolve => {
        if (doorsOpen) {
            console.log("Fechando portas");
            // Esconde os botões de andar
            elevatorElement.classList.add('buttons-hidden');
            
            elevatorDoors.classList.remove('doors-open');
            elevatorDoors.classList.add('doors-closed');
            doorsOpen = false;
            setTimeout(() => {
                resolve();
            }, 1000); // Tempo para fechar as portas
        } else {
            resolve();
        }
    });
}