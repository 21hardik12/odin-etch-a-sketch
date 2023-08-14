
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
        document.querySelectorAll('.toggle').forEach(b => b.classList.remove('button-enabled'));
        button.classList.add('button-enabled');
    });
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
    const grid = document.querySelectorAll('.grid-element');    
    grid.forEach(element => {        
        if (rgbToHex(element.style.backgroundColor) === prevBgColor) {
            element.style.backgroundColor = bgColor;
        }
    });
});

function draw() {
    const gridContainer = document.querySelector('.grid-container');

    let isDrawing = false;
    gridContainer.addEventListener('mousedown', _ => isDrawing = true);
    gridContainer.addEventListener('mouseup', _ => isDrawing = false);
    gridContainer.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            if (e.target.classList.contains('grid-element')) {
                if (!document.getElementById('eraser').classList.contains('button-enabled')) {
                    e.target.style.backgroundColor = penColor;
                } else {
                    e.target.style.backgroundColor = bgColor;
                }
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
