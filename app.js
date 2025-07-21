/*
Ideas for additions:
    
    -add ants on click at click location with differnet color to distinguish
    -may pivot into an ant sim where they tend to follow pheromones from differnet ants
        -will follow or not each step based on random chance



*/ 




const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');


const size = 100; // Grid size (100x100)
const cellSize = canvas.width / size;

let grid = Array.from({ length: size }, () => Array(size).fill(0)); // 0: white, 1: black
               

let antsArray = Array.from({length:getRandomInt(0, 11)}, () => ({
            x: getRandomInt(0,size),
            y: getRandomInt(0,size), 
            dir: getRandomInt(-1,4)                 // 0: up, 1: right, 2: down, 3: left
            }))

let speed = 1;
let interval;
let running = false;

const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

speedSlider.addEventListener('input', () => {
    speed = parseInt(speedSlider.value);
    speedValue.textContent = speed;

    if (running) {
        clearInterval(interval);
        interval = setInterval(step, speed);
    }
});



function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function popGrid(){
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {

            let rand = getRandomInt(-1, 500)

            if (rand == 0) rand = 2;
            else rand = 0;

            grid[y][x] = rand
    }
  }

}

function drawGrid() {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if(grid[y][x] == 2){
                ctx.fillStyle = 'green';
            }
            else{
                ctx.fillStyle = grid[y][x] ? 'white' : '#442e049c';
            }
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

        // Draw ant
        ctx.fillStyle = 'red';
        for(let ant of antsArray){
            ctx.fillRect(ant.x * cellSize, ant.y * cellSize, cellSize, cellSize);
        }
}



function step() {
    for (let ant of antsArray){

        let current = grid[ant.y][ant.x];
        if(current == 2){
            ant.dir = 0
            grid[ant.y][ant.x] = 0
            antsArray.push({
                x: ant.x + getRandomInt(-6,6),
                y: ant.y + getRandomInt(-6,6),
                dir: Math.floor(Math.random() * 4)
            });
        }
        ant.dir = (ant.dir + (current ? 3 : 1)) % 4;
        grid[ant.y][ant.x] = current ? 0 : 1;
      
        if (ant.dir === 0) ant.y--;
        else if (ant.dir === 1) ant.x++;
        else if (ant.dir === 2) ant.y++;
        else if (ant.dir === 3) ant.x--;
      
        ant.x = (ant.x + size) % size;
        ant.y = (ant.y + size) % size;
    }
    
    drawGrid();
}

function start() {
    if (!running) {
        running = true;
        interval = setInterval(step, speed);
    }
}


function pause() {
    running = false;
    clearInterval(interval);
}

function reset() {
    pause();
    grid = Array.from({ length: size }, () => Array(size).fill(0));
    ant = { x: getRandomInt(0,100),
            y: getRandomInt(0,100), 
            dir: getRandomInt(-1,4) };
    popGrid()
    drawGrid();
    start()
}

// Initial draw
popGrid();
drawGrid();


canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const gridX = Math.floor(mouseX / cellSize);
  const gridY = Math.floor(mouseY / cellSize);

  // Add new ant at the clicked location with random direction
  antsArray.push({
    x: gridX,
    y: gridY,
    dir: Math.floor(Math.random() * 4)
  });

  drawGrid(); // Update immediately
});

