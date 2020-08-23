const grids = document.querySelectorAll('.grid');
const ships = document.querySelectorAll('.ship');
const shipSmallerGrids = document.querySelectorAll('.ship-smaller-grid');
const shipContainer = document.querySelector('.ship-container');
const playerGrid = document.querySelector('.player-grid');
const computerGrid = document.querySelector('.computer-grid');
const start = document.querySelector('#start');
const playMessage = document.querySelector('#playerMessage')
const winningMessage = document.querySelector('#winningMessage');
const winningText = document.querySelector('#winningText');
const restartBtn = document.querySelector('#restartBtn');
const yLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const debug = document.getElementById('debug')
createGrid(grids[0], 'player');
createGrid(grids[1], 'computer');
const playerSmallerGrid = document.querySelectorAll('.player-smaller-grid')
const computerSmallerGrid = document.querySelectorAll('.computer-smaller-grid');

initGame();

//Ship State 
let fleets = [
    {
        name: 'carrier',
        length: 5,
        isHorizontal: true,
        isTaken: false,
        position: []
    },
    {
        name: 'battleship',
        length: 4,
        isHorizontal: true,
        isTaken: false,
        position: []
    },
    {
        name: 'destroyer1',
        length: 3,
        isHorizontal: true,
        isTaken: false,
        position: []
    },
    {
        name: 'destroyer2',
        length: 3,
        isHorizontal: true,
        isTaken: false,
        position: []
    },
    {
        name: 'patrol-boat',
        length: 2,
        isHorizontal: true,
        isTaken: false,
        position: []
    }
]

//Computer fleet state
let cmptrFleets = [
    {
        name: 'cmptrCarrier',
        length: 5,
        isHorizontal: cmptrIsHorizontal(),
        isTaken: false,
        position: []
    },
    {
        name: 'cmptrBattleship',
        length: 4,
        isHorizontal: cmptrIsHorizontal(),
        isTaken: false,
        position: []
    },
    {
        name: 'cmptrDestroyer1',
        length: 3,
        isHorizontal: cmptrIsHorizontal(),
        isTaken: false,
        position: []
    },
    {
        name: 'cmptrDestroyer2',
        length: 3,
        isHorizontal: cmptrIsHorizontal(),
        isTaken: false,
        position: []
    },
    {
        name: 'cmptrPatrol-boat',
        length: 2,
        isHorizontal: cmptrIsHorizontal(),
        isTaken: false,
        position: []
    }
]

let shipsPositions = {
    who: fleets,
    getPosition() {
        let arr = [];
        this.who.forEach(el => {
            arr = [...arr, ...el.position]
        })
        return arr
    }
}

//Create a new computer ship positions object using shipsPositions object
let cmptrShipsPositions = Object.create(shipsPositions)
cmptrShipsPositions.who = cmptrFleets

//Init setting
let isActiveGame = false;
let playerHitCounter = 0;
let computerHitCounter = 0;
let cmptrFleetsDiv = [];
let playerPickedNum = [];
let cpuPickedNum = [];
//Start game logic
let playerCounter = 0;
let computerCounter = 0;
let playerShipPosition = [];
let computerShipPosition = [];
let player = 'player'

cpuGenerateShip();
cpuPlaceShip();

//Restart button => display after a game is ended, click to reset all setting
restartBtn.addEventListener('click', handleRestart)
//Rotate ships; Change Ship isHorizontal State
ships.forEach(ship => {
    ship.addEventListener('click', function () {
        handleRotateShip(ship)
    })
})
//Drag ship; assign dragover and drop events to the target area, later remove to prevent drag other stuffs inside;
ships.forEach(ship => {
    if (isActiveGame) {
        return
    }
    ship.addEventListener('dragstart', function (ev) {
        if (!ev.target.classList.contains('ship')) {
            return
        }
        ev.dataTransfer.setData("text/plain", ev.target.id)
        playerGrid.addEventListener('dragover', dragOver)
        playerGrid.addEventListener('drop', onDrop)
    });
    //Remove playerGrid dragover and drop event; Avoid player drag other item inside
    ship.addEventListener('dragend', function () {
        playerGrid.removeEventListener('dragover', dragOver)
        playerGrid.removeEventListener('drop', onDrop)
    })
})
// Player pick an area, check if hit or win, swap player
computerSmallerGrid.forEach(el => {
    el.addEventListener('click', e => handlePlayerPick(e))
})

//Ready button, click to start game
start.addEventListener('click', handleStartGame)

function removePlayerShip() {
    ships.forEach(ship => {
        ship.parentNode.removeChild(ship)
    })
}

function addPlayerShip() {
    for (i = 0; i < 5; i++) {
        shipContainer.appendChild(ships[i])
    }
}

function removeCpuShip () {
    document.querySelectorAll('.computer-ship').forEach(ship => {
        ship.parentNode.removeChild(ship)
    })
}

function initState() {
    fleets.forEach(fleet => {
        fleet.isHorizontal = true;
        fleet.isTaken = false;
        fleet.position = [];
    })
    cmptrFleets.forEach(el => {
        el.isHorizontal = cmptrIsHorizontal();
        el.isTaken = false;
        el.position = [];
    })
}

function initGame() {
    document.body.removeChild(winningMessage)
}

function handleRestart() {
    initGame()
    initState()
    removePlayerShip()
    addPlayerShip()
    playerSmallerGrid.forEach(el => {
        el.classList.remove('picked-square')
        el.classList.remove('hitted-square')
    })
    isActiveGame = false;
    playerHitCounter = 0;
    computerHitCounter = 0;
    cmptrFleetsDiv = [];
    removeCpuShip();
    cpuGenerateShip();
    cpuPlaceShip();
    playerCounter = 0;
    computerCounter = 0;
    playerShipPosition = [];
    computerShipPosition = [];
    player = 'player'
    cpuPickedNum = [];
    playerPickedNum = [];
    computerSmallerGrid.forEach(el => {
        el.classList.remove('picked-square')
        el.classList.remove('hitted-square')
    })
    playMessage.innerHTML = ''
}

//Create smaller grids inside board
function createGrid(grid, whosGrid) {
    for (i = 0; i < 100; i++) {
        let div = document.createElement('div');
        grid.appendChild(div);
        div.style.height = '40px';
        div.style.width = '40px';
        div.setAttribute('class', 'smaller-grid')
        div.setAttribute('number', i)
        div.classList.add(`${whosGrid}-smaller-grid`)
        //Assign data attribute to the borad for coordination;
        //Use number for X axis, letter for Y axis; Top-left corner is A1; Bottom-right is K10;
        let dataX = (i + 1) % 10;
        if (dataX == 0) {
            dataX = 10;
        }
        let dataYNumber = Math.floor(((i) / 10));
        let dataYLetter = yLetter[(dataYNumber)]
        div.setAttribute('data-x', dataX)
        div.setAttribute('data-y', dataYLetter)
        div.setAttribute('position', dataX + '-' + dataYLetter + '-' + whosGrid)
    }
};

//Update fleets position state
function updateShipPositionState(shipName, shipPosition, who) {
    //prevent add null to the positon state
    if (shipPosition.indexOf(null) >= 0) {
        return
    }
    who.forEach(fleet => {
        if (fleet.name == shipName) {
            fleet.position = shipPosition
        }
    })
}

//Assign postion id to each grid of ship base on orientation
function assignIdtoGridofShip(ship, startX, startY, isHorizontal) {
    if (isHorizontal) {
        for (i = 0; i < ship.length; i++) {
            ship[i].setAttribute('id', `${parseInt(startX) + i}-${startY}-player`)
        }
    } else {
        for (i = 0; i < ship.length; i++) {
            ship[i].setAttribute('id', `${startX}-${yLetter[yLetter.indexOf(startY) + i]}-player`)
        }
    }
}
//Check if occupied 
function checkOccupied(shipName, newArr, who) {
    let checker = []
    let isOccupied = false;
    who.forEach(el => {
        if (el.name !== shipName) {
            checker = [...checker, ...el.position]
        }
    })
    newArr.forEach(el => {
        if (checker.indexOf(el) >= 0) {
            isOccupied = true
        }
    })
    return isOccupied
}

function startGame() {
    isActiveGame = !isActiveGame
}

const handleRotateShip = (ship) => {
    if (isActiveGame) {
        return
    }
    let shipName = ship.getAttribute('id');
    let isOutofGrid;
    //Initial rotate when all ships are outside of the board
    if (ship.parentElement.getAttribute('data-X') == null) {
        fleets.forEach(fleet => {
            if (fleet.name == shipName) {
                fleet.isHorizontal = !fleet.isHorizontal;
            }
        })
        ship.classList.toggle(`${shipName}-verticle`);
    }

    //Rotate inside gird
    if (ship.parentElement.getAttribute('data-X') !== null) {
        let positionX = ship.parentElement.getAttribute("data-X");
        let positionY = ship.parentElement.getAttribute("data-Y");
        let newOrientation;
        let fleetLength;
        let isHorizontal;
        //Retrieve state
        fleets.forEach(el => {
            if (el.name == shipName) {
                if (el.isHorizontal) {
                    newOrientation = 'vert'
                } else {
                    newOrientation = 'hoz'
                }
                fleetLength = el.length
            }
        })

        //Check if occupied
        let newArr = [];
        if (newOrientation == 'hoz') {
            for (i = 0; i < fleetLength; i++) {
                newArr = [...newArr, `${parseInt(positionX) + i}-${positionY}-player`]
            }
        } else if (newOrientation == 'vert') {
            for (i = 0; i < fleetLength; i++) {
                newArr = [...newArr, `${positionX}-${yLetter[yLetter.indexOf(positionY) + i]}-player`]
            }
        }
        if (checkOccupied(shipName, newArr, fleets)) {
            return
        }
        //Check if out of board, if not assign arg to following
        if (newOrientation == 'hoz') {
            if ((parseInt(positionX) + fleetLength - 1) > 10) {
                isOutofGrid = true
            } else {
                isHorizontal = true
            }
        } else if (newOrientation == 'vert') {
            if ((yLetter.indexOf(positionY) + fleetLength) > 10) {
                isOutofGrid = true
            } else {
                isHorizontal = false
            }
        };
        if (isOutofGrid) {
            return
        }
        fleets.forEach(fleet => {
            if (fleet.name == shipName) {
                fleet.isHorizontal = !fleet.isHorizontal;
            }
        })
        updateShipPositionState(shipName, newArr, fleets)
        assignIdtoGridofShip(ship.children, positionX, positionY, isHorizontal)
        ship.classList.toggle(`${shipName}-verticle`);
    }
}

// Drag and Drop ships
const dragOver = function (ev) {
    ev.preventDefault();
    if (isActiveGame) {
        return
    }
}

const onDrop = function (ev) {
    ev.preventDefault();
    if (isActiveGame) {
        return
    }
    let data = ev.dataTransfer.getData('text/plain');
    let draggedShip = document.getElementById(data);
    //to later check if ship out of grid
    let isOutofGrid;
    //Get the correct drop area// Important for not recurring adding child to parent element
    let t = ev.target;
    while (t !== null && !t.classList.contains('smaller-grid')) {
        t = t.parentNode
    }
    //Important: get the position from the borad grid; not from the direct parent; Get Drop Area Position from the first child position of the ship 
    let positionX = t.getAttribute("data-X");
    let positionY = t.getAttribute("data-Y");
    //Get Drop Area Position base on horizontal or vertible for all childs of ship
    let allPosition = [];
    fleets.forEach(el => {
        if (el.name == draggedShip.getAttribute('id')) {
            if (el.isHorizontal) {
                allPosition = [`${parseInt(positionX)}-${positionY}-player`]
                for (i = 0; i < el.length - 1; i++) {
                    allPosition.push(`${parseInt(positionX) + i + 1}-${positionY}-player`)
                }
            } else {
                allPosition = [`${positionX}-${positionY}-player`]
                for (i = 0; i < el.length - 1; i++) {
                    allPosition.push(`${positionX}-${yLetter[yLetter.indexOf(positionY) + i + 1]}-player`)
                }
            }
        }
    })
    //Check if position is occupied
    let checker = []
    let isOccupied = false;
    fleets.forEach(el => {
        if (el.name !== draggedShip.getAttribute('id')) {
            checker = [...checker, ...el.position]
        }
    })
    allPosition.forEach(el => {
        if (checker.indexOf(el) >= 0) {
            isOccupied = true
        }
    })
    if (isOccupied) {
        return
    }

    // Assign position id to ship if it's inside the board
    fleets.forEach(ship => {
        if (ship.name == data) {
            if (ship.isHorizontal) {
                let shipEndPosition = parseInt(positionX) + draggedShip.children.length - 1;
                if (shipEndPosition > 10) {
                    isOutofGrid = true;
                    return;
                }
                //Assign horizontal position
                for (j = 0; j < draggedShip.children.length; j++) {
                    let positionXEach = parseInt(positionX) + j;
                    draggedShip.children[j].setAttribute('id', `${positionXEach}-${positionY}-player`)
                }
            } else {
                let shipEndPosition = yLetter.indexOf(positionY) + draggedShip.children.length;
                if (shipEndPosition > 10) {
                    isOutofGrid = true;
                    return;
                }
                // Assign verticle position
                for (j = 0; j < draggedShip.children.length; j++) {
                    let positionYEach = yLetter[yLetter.indexOf(positionY) + j];
                    draggedShip.children[j].setAttribute('id', `${positionX}-${positionYEach}-player`)
                }
            }
        }
    })

    if (isOutofGrid) {
        return
    }
    //Drop ship and update state
    t.appendChild(draggedShip)
    //Pass dragged ship position as array for updateShipPositionState, updateOccupiedPosition function
    let shipArr = [];
    Array.from(draggedShip.children).forEach(el => {
        shipArr = [...shipArr, el.getAttribute('id')]
    })
    //Update dragged ship position state
    updateShipPositionState(draggedShip.getAttribute('id'), shipArr, fleets)
}

function cmptrIsHorizontal() {
    return Math.floor(Math.random() * 2) ? false : true
}

//Computer Generate Ships
function cpuGenerateShip() {
    cmptrFleets.forEach(fleet => {
        let containerDiv = document.createElement('div');
        containerDiv.setAttribute('id', fleet.name);
        containerDiv.classList.add('computer-ship')
        let height = 40 * 1 + 40 * (fleet.isHorizontal ? 0 : fleet.length - 1);
        let width = 40 * 1 + 40 * (fleet.isHorizontal ? fleet.length - 1 : 0);
        containerDiv.style.height = height + 'px';
        containerDiv.style.width = width + 'px';
        containerDiv.style.display = 'flex'
        if (!fleet.isHorizontal) {
            containerDiv.style.flexDirection = 'column'
        }
        for (i = 0; i < fleet.length; i++) {
            let smallerDiv = document.createElement('div');
            smallerDiv.style.height = '40px';
            smallerDiv.style.width = '40px';
            containerDiv.appendChild(smallerDiv);
        }
        cmptrFleetsDiv = [...cmptrFleetsDiv, containerDiv]
    })
}

//Computer Place Ship
function cpuPlaceShip() {
    for (i = 0; i < 5; i++) {
        let isOutofGrid = true;
        let isOccupied = true;
        let shipName = cmptrFleetsDiv[i].getAttribute('id')
        let shipLength;
        let shipArr = [];
        let randomNum;
        while (isOutofGrid || isOccupied) {
            randomNum = Math.floor(Math.random() * 100);

            let orientation;
            shipArr = [randomNum];

            cmptrFleets.forEach(fleet => {
                if (fleet.name == shipName) {
                    orientation = fleet.isHorizontal ? 'hoz' : 'vert';
                    shipLength = fleet.length;
                }
            })
            if (orientation == 'hoz') {
                for (j = 0; j < shipLength - 1; j++) {
                    shipArr = [...shipArr, randomNum + j + 1]
                }
                let index = randomNum % 10
                isOutofGrid = index + shipLength - 1 > 9 ? true : false;
            } else {
                for (j = 0; j < shipLength - 1; j++) {
                    shipArr = [...shipArr, randomNum + (j + 1) * 10]
                }
                let index = Math.floor(randomNum / 10);
                isOutofGrid = index + shipLength - 1 > 9 ? true : false;
            }
            isOccupied = checkOccupied(shipName, shipArr, cmptrFleets);
        }
        computerSmallerGrid[randomNum].appendChild(cmptrFleetsDiv[i])
        updateShipPositionState(shipName, shipArr, cmptrFleets)
    }
}

function handleStartGame() {
    let checker = shipsPositions.getPosition().length;
    if (checker !== 17) {
        playMessage.innerHTML = 'You haven\'t place all ships'
        return
    }
    else {
        if (isActiveGame) {
            playMessage.innerHTML = 'Game already started'
            return
        }
        playMessage.innerHTML = 'Game Start'
        playerShipPosition = shipsPositions.getPosition()
        computerShipPosition = cmptrShipsPositions.getPosition()
        startGame()
    }
}

function handlePlayerPick(e) {
    if (!isActiveGame) {
        return
    }
    if (player !== 'player') {
        return
    }
    let t = e.target
    while (t !== null && !t.classList.contains('computer-smaller-grid')) {
        t = t.parentNode
    }
    //Prevent pick the square that has been picked before
    let pickedNum = parseInt(t.getAttribute('number'))
    if (playerPickedNum.some(num => num === pickedNum)) {
        console.log('picked before')
        console.log('pick another')
        return
    }
    playerPickedNum = [...playerPickedNum, pickedNum]
    //Check if hit
    let isHit = checkHit(t.getAttribute('number'), player);
    //Counte hit
    playerCounter = isHit ? playerCounter + 1 : playerCounter;
    //Styling
    let style = isHit ? 'hitted-square' : 'picked-square'
    t.classList.add(style)
    //Check if win
    let isWin = ((playerCounter == 17) ? true : false)
    //if win end game
    if (isWin) {
        endGame();
        winningText.innerHTML = 'You win!';
        return;
    }
    //Swap player
    player = 'computer'
    //Computer acctact
    setTimeout(cpuAttack, 1000)
}

function checkHit(id, player) {
    let checker = [];
    checker = (player == 'player') ? computerShipPosition : playerShipPosition
    let isHit = checker.some(position => position == id)
    return isHit
}

function cpuAttack() {
    //Pick a square that hasn't been picked before
    let randomNum = Math.floor(Math.random() * 100)
    while (cpuPickedNum.some(cpuPickedNum => cpuPickedNum == randomNum)) {
        randomNum = Math.floor(Math.random() * 100)
    }
    cpuPickedNum = [...cpuPickedNum, randomNum]
    //Get the square position
    let dataX = (randomNum % 10) + 1;
    let dataY = yLetter[Math.floor(randomNum / 10)]
    let id = `${dataX}-${dataY}-player`
    //Check if hit
    let isHit = checkHit(id, player);
    //Count hit
    computerCounter = isHit ? computerCounter + 1 : computerCounter;
    //Styling
    let style = isHit ? 'hitted-square' : 'picked-square'
    playerSmallerGrid[randomNum].classList.add(style)
    //Check if win
    let isWin = ((computerCounter == 17) ? true : false)
    //if win, end game
    if (isWin) {
        endGame();
        winningText.innerHTML = `${player} win!`;
        return;
    }
    //Swap player
    player = 'player'
}

function endGame() {
    document.body.appendChild(winningMessage)
}





