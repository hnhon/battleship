const grid = document.querySelector('.grid');

grid.style.backgroundColor = 'green';

function createGrid(grid) {
    for (i = 0; i < 100; i++) {
        let div = document.createElement('div');
        grid.appendChild(div);
        div.style.height = '40px';
        div.style.width = '40px';
    }
};

createGrid(grid);