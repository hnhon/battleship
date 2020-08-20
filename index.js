const grids = document.querySelectorAll('.grid');
const ships = document.querySelectorAll('.ship');
const shipSmallerGrids = document.querySelectorAll('.ship-smaller-grid');
const playerGrid = document.querySelector('.player-grid');
const computerGrid = document.querySelector('.computer-grid');
const newGame = document.querySelector('#new-game');
const start = document.querySelector('#start');
const yLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

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

//Debug => check fleets state

newGame.addEventListener('click', function () {
    fleets.forEach(el => {
        console.log(el.name + ': ' + el.position + ' isHorz?: ' + el.isHorizontal)
    })
    console.log('player: ' + shipsPositions.getPosition())
    console.log('cmptr: ' + cmptrShipsPositions.getPosition())
})

//Mouse Over board (for selecting ship instead of the board grid)


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
function checkOccupied(shipName, newArr) {
    let checker = []
    let isOccupied = false;
    fleets.forEach(el => {
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
            if (checkOccupied(shipName, newArr)) {
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
            updateShipPositionState(shipName, newArr)
            assignIdtoGridofShip(ship.children, positionX, positionY, isHorizontal)
            ship.classList.toggle(`${shipName}-verticle`);
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
    updateShipPositionState(draggedShip.getAttribute('id'), shipArr)
    //For debug
    console.log(t.getAttribute("data-X"))
    console.log(t.getAttribute("data-Y"))
}

//Drag start; assign dragover and drop events to the target area, later remove to prevent drag other stuffs inside;
ships.forEach(ship => {
    ship.addEventListener('dragstart', function (ev) {
        ev.dataTransfer.setData("text/plain", ev.target.id)
        playerGrid.addEventListener('dragover', dragOver)
        playerGrid.addEventListener('drop', onDrop)
        console.log(ev.target)
    });
    //Remove playerGrid dragover and drop event; Avoid player drag other item inside
    ship.addEventListener('dragend', function () {
        playerGrid.removeEventListener('dragover', dragOver)
        playerGrid.removeEventListener('drop', onDrop)
    })
})


//Computer Part

//Computer Fleets State
function cmptrIsHorizontal() {
    return Math.floor(Math.random(0, 1) * 2) ? true : false
}

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
//Debug
cmptrFleets.forEach(el => {
    console.log(el.name + ' is horizontal: ' + el.isHorizontal)
})

//Create a new computer ship positions object using shipsPositions object
let cmptrShipsPositions = Object.create(shipsPositions)
cmptrShipsPositions.who = cmptrFleets

//Computer Generate Ships
cmptrFleets.forEach(fleet => {
    let containerDiv = document.createElement('div');
    containerDiv.setAttribute('id', fleet.name);
    let height = 40 * 1 + 40 * (fleet.isHorizontal ? 0 : fleet.length-1);
    let width = 40 * 1 + 40 * (fleet.isHorizontal ? fleet.length-1 : 0);
    containerDiv.style.height = height+'px';
    containerDiv.style.width = width+'px';
    containerDiv.style.display = 'flex'
    containerDiv.style.backgroundColor = 'pink'
    containerDiv.style.borderRadius = '20%'
    if (!fleet.isHorizontal) {
        containerDiv.style.flexDirection = 'column'
    }
    for (i=0; i<fleet.length; i++) {
        let smallerDiv = document.createElement('div');
        smallerDiv.style.height = '40px';
        smallerDiv.style.width = '40px';
        containerDiv.appendChild(smallerDiv);
    }
    computerGrid.appendChild(containerDiv)
})
