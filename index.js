const grids = document.querySelectorAll('.grid');
const ships = document.querySelectorAll('.ship');
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
    },
    {
        name: 'battleship',
        length: 4,
        isHorizontal: true,
        isTaken: false,
    },
    {
        name: 'destroyer1',
        length: 3,
        isHorizontal: true,
        isTaken: false,
    },
    {
        name: 'destroyer2',
        length: 3,
        isHorizontal: true,
        isTaken: false,
    },
    {
        name: 'patrol-boat',
        length: 2,
        isHorizontal: true,
        isTaken: false,
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
        div.setAttribute('position', dataX+dataYLetter+'-'+whosGrid)
    }
};

createGrid(grids[0], 'player');
createGrid(grids[1], 'computer');

//Set the state of small grids consisting of the board
const smallerGrids = document.querySelectorAll('.smaller-grid');
let smallerGridStates = [];
smallerGrids.forEach(el => {
    smallerGridStates = [...smallerGridStates, {
        name: el.getAttribute('position'),
        isOverlaped: false
    }]
})

// Set each individual grid(.smaller-grid) of a board isOverlaped state
function setIsOverlaped () {
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
                            ship.children[j].setAttribute('id', `${positionX}-${positionYEach}`)
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
                            ship.children[j].setAttribute('id', `${positionXEach}-${positionY}`)
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
                    draggedShip.children[j].setAttribute('id', `${positionXEach}-${positionY}`)
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
                    draggedShip.children[j].setAttribute('id', `${positionX}-${positionYEach}`)
                }
            }
        }
    })
    if (isOutofGrid) {
        return
    }
    ev.target.appendChild(draggedShip)
    console.log(ev.target.getAttribute("data-X"))
    console.log(ev.target.getAttribute("data-Y"))
}

ships.forEach(ship => {
    ship.addEventListener('dragstart', function (ev) {
        ev.dataTransfer.setData("text/plain", ev.target.id)
        let shipName = ev.target.getAttribute('id');
        fleets.forEach(ship => {
            if (ship.name == shipName) {
                let shipLenght = ship.length;
            }
        })
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
