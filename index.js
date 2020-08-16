const grids = document.querySelectorAll('.grid');
const ships = document.querySelectorAll('.ship');
const playerGrid = document.querySelector('.player-grid');
const computerGrid = document.querySelector('.computer-grid');

grids[0].style.backgroundColor = 'lightBlue';
grids[1].style.backgroundColor = 'lightBlue';


//Create smaller grids inside larger grids
function createGrid(grid) {
    for (i = 0; i < 100; i++) {
        let div = document.createElement('div');
        grid.appendChild(div);
        div.style.height = '40px';
        div.style.width = '40px';
    }
};

createGrid(grids[0]);
createGrid(grids[1]);

//Rotate ships
ships[0].addEventListener('click', function(){
    ships[0].classList.toggle('carrier-verticle')
})
ships[1].addEventListener('click', function(){
    ships[1].classList.toggle('battleship-verticle')
})
ships[2].addEventListener('click', function(){
    ships[2].classList.toggle('destroyer-verticle')
})
ships[3].addEventListener('click', function(){
    ships[3].classList.toggle('destroyer-verticle')
})
ships[4].addEventListener('click', function(){
    ships[4].classList.toggle('patrol-boat-verticle')
})

// Drag and Drop ships
ships.forEach(ship => {
    ship.addEventListener('dragstart', function(ev) {
        ev.dataTransfer.setData("text", ev.target.id)
    })
})

playerGrid.addEventListener('dragover', function(ev){
    ev.preventDefault()
})

playerGrid.addEventListener('drop', function(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData('text');
    ev.target.appendChild(document.getElementById(data))
})

//Computer Generate Ships


let randomShip = {
    direction: 
}