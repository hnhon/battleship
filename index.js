const grids = document.querySelectorAll('.grid');
const ships = document.querySelectorAll('.ship');
const playerGrid = document.querySelector('.player-grid');
const computerGrid = document.querySelector('.computer-grid');
const newGame = document.querySelector('#new-game');
const start = document.querySelector('#start');
const yLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K'];

//Create smaller grids inside larger grids
function createGrid(grid) {
    for (i = 0; i < 100; i++) {
        let div = document.createElement('div');
        grid.appendChild(div);
        div.style.height = '40px';
        div.style.width = '40px';
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
    }
};

createGrid(grids[0]);
createGrid(grids[1]);

//Rotate ships; Change Ship isHorizontal State
ships.forEach(ship => {
    ship.addEventListener('click', function(){
        let id = ship.getAttribute('id');
        ship.classList.toggle(`${id}-verticle`);
        fleets.forEach(fleet => {
            if (fleet.name == id) {
                fleet.isHorizontal = !fleet.isHorizontal;
            }
        })
    })
})

// ships[0].addEventListener('click', function () {
//     ships[0].classList.toggle('carrier-verticle');
//     fleets.forEach(ship => {
//         if (ship.name == ships[0].getAttribute('id')) {
//             ship.isHorizontal = !ship.isHorizontal;
//         }
//     })
// })
// ships[1].addEventListener('click', function () {
//     ships[1].classList.toggle('battleship-verticle')
// })
// ships[2].addEventListener('click', function () {
//     ships[2].classList.toggle('destroyer-verticle')
// })
// ships[3].addEventListener('click', function () {
//     ships[3].classList.toggle('destroyer-verticle')
// })
// ships[4].addEventListener('click', function () {
//     ships[4].classList.toggle('patrol-boat-verticle')
// })

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

// Drag and Drop ships
const dragOver = function (ev) {
    ev.preventDefault();
}

const onDrop = function (ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData('text/plain');
    let draggedShip = document.getElementById(data);
    ev.target.appendChild(draggedShip)
    //Get Drop Area Position from the first child position of the ship
    let positionX = ev.target.getAttribute("data-X");
    let positionY = ev.target.getAttribute("data-Y");
    //Assign position id to ship
    fleets.forEach(ship => {
        if (ship.name == data) {
            if (ship.isHorizontal) {
                for (j = 0; j < draggedShip.children.length; j++) {
                    let positionXEach = parseInt(positionX) + j;
                    draggedShip.children[j].setAttribute('id', `${positionXEach}-${positionY}`)
                }
            } else {
                for (j = 0; j < draggedShip.children.length; j++) {
                    let positionYEach = yLetter[yLetter.indexOf(positionY) + j];
                    draggedShip.children[j].setAttribute('id', `${positionX}-${positionYEach}`)
                }
            }
        }
    })

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
