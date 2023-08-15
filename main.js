
const slider = document.getElementById("slider");
const sliderText = document.getElementById("slider-text");
const penColorPicker = document.getElementById("pen-color");
const bgColorPicker = document.getElementById("bg-color");

let penColor = '#000000';
let bgColor = '#ffffff';
let prevBgColor = bgColor;
let sliderValue = slider.value;

createGrid(slider.value);
draw();

penColorPicker.addEventListener('input', event => {
    const value = penColorPicker.value;
    penColor = value;
});

const toggleButtons = document.querySelectorAll('.toggle');
toggleButtons.forEach(button => {
    button.addEventListener('click', e => {
        if (button.classList.contains('button-enabled')) {
            button.classList.remove('button-enabled');
        } else {
            document.querySelectorAll('.toggle').forEach(b => b.classList.remove('button-enabled'));
            button.classList.toggle('button-enabled');
        }
    });
});

const switchButtons = document.querySelectorAll('.switch');
switchButtons.forEach(button => {
    button.addEventListener('click', e => {
        if (button.classList.contains('button-enabled')) {
            button.classList.remove('button-enabled');
        } else {
            document.querySelectorAll('.switch').forEach(b => b.classList.remove('button-enabled'));
            button.classList.toggle('button-enabled');
        }
    });
});

const clearButton = document.getElementById('clear');
clearButton.addEventListener('click', e => {
    createGrid(sliderValue);    
});

function rgbToHex(rgb) {
    const components = rgb.match(/\d+/g); // Extract RGB components as numbers
    const r = parseInt(components[0]);
    const g = parseInt(components[1]);
    const b = parseInt(components[2]);

    const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    return `#${hex}`;
}

bgColorPicker.addEventListener('input', event => {
    const value = bgColorPicker.value;
    prevBgColor = bgColor;
    bgColor = value;
    fillTheGrid(bgColor, prevBgColor);
});

function fillTheGrid(color1, color2) {    
    const grid = document.querySelectorAll('.grid-element');    
    grid.forEach(element => {                
        if (rgbToHex(element.style.backgroundColor) === color2) {
            element.style.backgroundColor = color1;
        }
    });    
}

function adjustColorShade(hexColor, adjustment) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const newR = Math.max(0, Math.min(255, r + adjustment));
    const newG = Math.max(0, Math.min(255, g + adjustment));
    const newB = Math.max(0, Math.min(255, b + adjustment));

    const newHexColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    
    return newHexColor;
}


function draw() {
    const gridContainer = document.querySelector('.grid-container');

    let isDrawing = false;
    gridContainer.addEventListener('mousedown', _ => isDrawing = true);
    gridContainer.addEventListener('mouseup', _ => isDrawing = false);
    gridContainer.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            if (e.target.classList.contains('grid-element')) {
                if (document.getElementById('eraser').classList.contains('button-enabled')) {
                    e.target.style.backgroundColor = bgColor;
                    return;
                }
                
                if (document.getElementById('fill').classList.contains('button-enabled')) {
                    fillTheGrid(penColor, bgColor);
                    bgColor = penColor;
                    document.getElementById('bg-color').value = penColor;
                    document.getElementById('fill').classList.remove('button-enabled')
                    return;
                }

                if (document.getElementById('grabber').classList.contains('button-enabled')) {                    
                    document.getElementById('pen-color').value = rgbToHex(e.target.style.backgroundColor);
                    penColor = rgbToHex(e.target.style.backgroundColor);
                    document.getElementById('grabber').classList.remove('button-enabled');
                    return;
                }

                if (document.getElementById('rainbow').classList.contains('button-enabled')) {
                    e.target.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                    return;
                }

                if (document.getElementById('shading').classList.contains('button-enabled')) {                   
                    e.target.style.backgroundColor = adjustColorShade(rgbToHex(e.target.style.backgroundColor), -10);
                    return;
                }
                
                if (document.getElementById('lighten').classList.contains('button-enabled')) {
                    console.log("lighten enabled");
                    e.target.style.backgroundColor = adjustColorShade(rgbToHex(e.target.style.backgroundColor), 10);
                    return;
                }

                e.target.style.backgroundColor = penColor;
            }
        }
    });
   
}

function setGridColor(color1, color2) {
    const gridContainer = document.querySelector('.grid');
    const gridMatrix = gridContainer.querySelectorAll('.grid-element');
    for (let i = 0; i < gridMatrix.length; i++) {        
        if (gridMatrix[i].style.backgroundColor === color2) {
            gridMatrix[i].style.backgroundColor = color1;
        }        
    }
}

slider.addEventListener("input", () => {
    const value = slider.value;
    sliderValue = value;
    sliderText.textContent = `Grid size: ${value} x ${value}`;
    createGrid(value);
});

function createGrid(value) {
    const grid = document.querySelector(".grid");
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    const divW = (grid.clientWidth - value - 1) / value;
    for (let i = 0; i < value; i++) {
        const parentDiv = document.createElement("div");
        parentDiv.classList.add("grid-row");
        for (let j = 0; j < value; j++) {
            const div = document.createElement("div");
            div.setAttribute(
                "style",
                `width: ${divW}px; height: ${divW}px; background-color: ${bgColor}; padding: 0px; margin: 0px;`
            );
            div.classList.add('grid-element');
            parentDiv.appendChild(div);
        }
        grid.appendChild(parentDiv);
    }
}
