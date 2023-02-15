const  colorPicker = document.getElementById("colorPicker"),
    canvasWidth = document.getElementById('canvasWidth'),
    canvasHeight = document.getElementById('canvasHeight'),
    amountWidth = document.getElementById('amountWidth'),
    amountHeight = document.getElementById('amountHeight'),
    jsonUpload = document.getElementById('fileUpload'),
    canvas = document.getElementById('canvas')
;

let mouse = {x: 0, y: 0, down: false};
let mouseDown;
let ctx = canvas.getContext('2d');
let circles = []
let backgroundColor,  canvasX, canvasY, xAmount, yAmount, circleSize, random;
let ifCircleSelected = false;
let selectedCircle;

function downloadJson(){

    backgroundColor = colorPicker.value;
    canvasX = canvasWidth.value;
    canvasY = canvasHeight.value;
    xAmount = amountWidth.value;
    yAmount = amountHeight.value;

    var data = {
        "backgroundColor": colorPicker.value,
        "canvasX": canvasWidth.value
    }

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

    const link = document.createElement("a");
    link.setAttribute("href",dataStr);
    link.setAttribute("download", "scene.json");
    link.click();
}

[canvasWidth, canvasHeight, amountWidth, amountHeight].forEach(function(elem) {
    elem.addEventListener("input", function() {
        console.log('qwe')
    });
});


jsonUpload.addEventListener('change', function (){
    let fileReader = new FileReader();

    fileReader.onload = function(e) {
        let intern = JSON.parse(e.target.result);
        console.log(intern)
    };
    fileReader.readAsText(jsonUpload.files[0]);
})



canvas.addEventListener("mousemove", function (event) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = Math.round((event.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
    mouse.y = Math.round((event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);

    if (mouseDown && ifCircleSelected){
        let i = findCircle(selectedCircle);
        if (i === -1) return;
        circles.splice(i,1)
        redrawCanvas()
        let mouseX = mouse.x;
        let mouseY = mouse.y;
        selectedCircle = [mouseX,mouseY,20]
        circles.push([mouseX,mouseY,20])
        drawCircle(mouseX, mouseY, 20)
        drawCircleBorder(mouseX, mouseY, 20)
    }
});

canvas.addEventListener('mousedown', function (){
    mouseDown = true;
})

canvas.addEventListener('mouseup', function (){
    mouseDown = false;
})

canvas.addEventListener('click', function (){
    if (ifCircleSelected && !mouseDown){
        redrawCanvas();
        ifCircleSelected = false;
        return;
    }

    let mouseX = mouse.x;
    let mouseY = mouse.y;

    for (let e of circles){
        if ((mouseX >= e[0] - e[2] && mouseX <= e[0] + e[2]) && (mouseY >= e[1] - e[2] && mouseY <= e[1] + e[2])) {
            console.log('intersecrion')
            ifCircleSelected = true;
            drawCircleBorder(e[0],e[1],e[2])
            return;
        }
    }

    circles.push([mouseX,mouseY,20])
    drawCircle(mouseX, mouseY, 20)
})

function drawCircleBorder(x,y,r){
    selectedCircle = [x,y,r];
    ctx.strokeStyle = '#00b2ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r + 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath()
}


function drawCircle(x,y,r){
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    console.log(circles)
    ctx.fill();
    ctx.closePath();
}

function redrawCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let e of circles){
        drawCircle  (e[0],e[1],e[2])
    }
}

function findCircle(e){
    for (let [index,q] of circles.entries()){
        if (q[0] === e[0] && q[1] === e[1]){
            return index
        }
    }
    return -1;
}