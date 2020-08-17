const grids = document.querySelectorAll('.grid');
const ships = document.querySelectorAll('.ship');
const playerGrid = document.querySelector('.player-grid');
const computerGrid = document.querySelector('.computer-grid');
const newGame = document.querySelector('#new-game')
const start = document.querySelector('#start')

//Create smaller grids inside larger grids
function createGrid(grid) {
    for (i = 0; i < 100; i++) {
        let div = document.createElement('div');
        grid.appendChild(div);
        div.style.height = '40px';
        div.style.width = '40px';
        //Assign data attribute to the borad for coordination;
        //Use number for X axis, letter for Y axis; Top-left corner is A1; Bottom-right is K10;
        let dataX = (i+1)%10;
        if (dataX == 0) {
            dataX = 10;
        }
        let dataYNumber = Math.floor(((i)/10));
        let yLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K'];
        let dataYLetter = yLetter[(dataYNumber)]
        div.setAttribute('data-x', dataX)
        div.setAttribute('data-y', dataYLetter)
    }
};

createGrid(grids[0]);
createGrid(grids[1]);

//Rotate ships
ships[0].addEventListener('click', function () {
    ships[0].classList.toggle('carrier-verticle')
})
ships[1].addEventListener('click', function () {
    ships[1].classList.toggle('battleship-verticle')
})
ships[2].addEventListener('click', function () {
    ships[2].classList.toggle('destroyer-verticle')
})
ships[3].addEventListener('click', function () {
    ships[3].classList.toggle('destroyer-verticle')
})
ships[4].addEventListener('click', function () {
    ships[4].classList.toggle('patrol-boat-verticle')
})

// Drag and Drop ships
ships.forEach(ship => {
    ship.addEventListener('dragstart', function (ev) {
        ev.dataTransfer.setData("text", ev.target.id)
        console.log(ev.target)
        console.log(this.child)
        console.log(ev.target.id)
    })
})

playerGrid.addEventListener('dragover', function (ev) {
    ev.preventDefault()
})

playerGrid.addEventListener('drop', function (ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData('text');
    ev.target.appendChild(document.getElementById(data))
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
