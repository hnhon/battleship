const grids = document.querySelectorAll('.grid');
const ships = document.querySelectorAll('.ship');
const shipSmallerGrids = document.querySelectorAll('.ship-smaller-grid');
const playerGrid = document.querySelector('.player-grid');
const computerGrid = document.querySelector('.computer-grid');
const newGame = document.querySelector('#new-game');
const start = document.querySelector('#start');
const yLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K'];

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

//Create smaller grids inside larger grids
function createGrid(grid, whosGrid) {
    for (i = 0; i < 100; i++) {
        let div = document.createElement('div');
        grid.appendChild(div);
        div.style.height = '40px';
        div.style.width = '40px';
        div.setAttribute('class', 'smaller-grid')
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

createGrid(grids[0], 'player');
createGrid(grids[1], 'computer');

//Debug => check fleets state and occupy state
newGame.addEventListener('click', function () {
    fleets.forEach(el => {
        console.log(el.name + ': ' + el.position)
    })
    console.log('occupied array: ' + occupied)
})

//Put position of occupied grids (the same as id of smaller grids of each ship) to the occupy array
let occupied = [];
function updateOccupiedPosition() {
    occupied = [];
    fleets.forEach(fleet => {
        occupied.push(...fleet.position)
    })
}
//Update fleets position state
function updateShipPositionState(shipName, shipPosition) {
    //prevent add null to the positon state
    if (shipPosition.indexOf(null) >= 0) {
        return
    }
    fleets.forEach(fleet => {
        if (fleet.name == shipName) {
            fleet.position = shipPosition
        }
    })
}

//Check if the new position is occupied
function checkOccupied() {

}

//Rotate ships; Change Ship isHorizontal State
ships.forEach(ship => {
    ship.addEventListener('click', function () {
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
        //Rotate while inside of the board
        //Assign positon to each child of ship when rotate inside the board
        if (ship.parentElement.getAttribute('data-X') !== null) {
            //Get the first child of ship postion data
            let positionX = ship.parentElement.getAttribute("data-X");
            let positionY = ship.parentElement.getAttribute("data-Y");
            //Get ship state data
            fleets.forEach(fleet => {
                if (fleet.name == shipName) {
                    //Rotate when the ship is horizontal
                    if (fleet.isHorizontal) {
                        //Check if rotate to verticle will exceed the board
                        let shipEndPosition = yLetter.indexOf(positionY) + fleet.length;
                        if (shipEndPosition > 10) {
                            isOutofGrid = true;
                            return;
                        }
                        //If not outside of the board, rotate
                        fleet.isHorizontal = !fleet.isHorizontal;
                        //If after rotate to verticle it's inside the board, Assign verticle position
                        for (j = 0; j < ship.children.length; j++) {
                            let positionYEach = yLetter[yLetter.indexOf(positionY) + j];
                            ship.children[j].setAttribute('id', `${positionX}-${positionYEach}-player`)
                        }
                    }
                    //What click does when ship is veriticle 
                    else {
                        //Check if rotate to verticle will exceed the board
                        let shipEndPosition = parseInt(positionX) + fleet.length - 1;
                        if (shipEndPosition > 10) {
                            isOutofGrid = true;
                            return;
                        }
                        fleet.isHorizontal = !fleet.isHorizontal;
                        //Assign verticle position
                        for (j = 0; j < ship.children.length; j++) {
                            let positionXEach = parseInt(positionX) + j;
                            ship.children[j].setAttribute('id', `${positionXEach}-${positionY}-player`)
                        }
                    }
                    if (isOutofGrid) {
                        return;
                    }
                    ship.classList.toggle(`${shipName}-verticle`);
                }
            })
        }
    })
})

// Drag and Drop ships
const dragOver = function (ev) {
    ev.preventDefault();
}

const onDrop = function (ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData('text/plain');
    let draggedShip = document.getElementById(data);
    //to later check if ship out of grid
    let isOutofGrid;
    // Get Drop Area Position from the first child position of the ship
    let positionX = ev.target.getAttribute("data-X");
    let positionY = ev.target.getAttribute("data-Y");
    //Get Drop Area Position base on horizontal or vertible for all childs of ship
    let shipOrientation;
    let allPostion = [];
    let shipLength = 0;
    fleets.forEach(el => {
        if (el.name == draggedShip.getAttribute('id')) {
            shipLength = el.length
            if (el.isHorizontal) {
                shipOrientation = 'horizontal'
                allPostion = [`${positionX}-${positionY}-player`]
                for (i = 0; i < el.length - 1; i++) {
                    allPostion.push(`${positionX + i + 1}-${positionY}-player`)
                }
            } else {
                shipOrientation = 'verticle'
                allPostion = [`${positionX}-${positionY}-player`]
                for (i = 0; i < el.length - 1; i++) {
                    allPostion.push(`${positionX}-${yLetter[yLetter.indexOf(positionY) + i + 1]}-player`)
                }
            }
        }
    })
    if (shipOrientation == 'horizontal') {

    } else if (shipOrientation == 'verticle') {

    }
    //Check if position is occupied

    // Assign position id to ship
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
    ev.target.appendChild(draggedShip)
    //Pass dragged ship position as array for updateShipPositionState, updateOccupiedPosition function
    let shipArr = [];
    Array.from(draggedShip.children).forEach(el => {
        shipArr = [...shipArr, el.getAttribute('id')]
    })
    //Update dragged ship position state
    updateShipPositionState(draggedShip.getAttribute('id'), shipArr)
    //Update occupy array
    updateOccupiedPosition()
    //For debug
    // console.log('occupied positions: ' + occupied)
    console.log(ev.target.getAttribute("data-X"))
    console.log(ev.target.getAttribute("data-Y"))
}

//Drag start; assign dragover and drop events to the target area, later remove to prevent drag other stuffs inside;
ships.forEach(ship => {
    ship.addEventListener('dragstart', function (ev) {
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

//Computer Generate Ships
function generateShip(height, width, dir) {
    let div = document.createElement('div');
    computerGrid.appendChild(div);
    div.style.borderRadius = '20%'
    div.style.backgroundColor = 'pink'
    //change ship direction
    if (dir == 0) {
        div.style.width = width;
        div.style.height = height
    } else {
        div.style.width = height;
        div.style.height = width;
    }
}

function dir() {
    return Math.floor(Math.random(0, 1) * 2)
}

generateShip('200px', '40px', dir());
generateShip('160px', '40px', dir());
generateShip('120px', '40px', dir());
generateShip('120px', '40px', dir());
generateShip('80px', '40px', dir());
