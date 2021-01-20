// import * from "utils.js"

var tilings = []; //contains the coloured version of each canvas-drawn tiling's pixel data

var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;
        
var curColor = {
    r:219,
    g: 219,
    b:219

}
var colorLayerData;

var x = "red",
    y = 5;

function initLineMode() {
    canvas = document.getElementById('can');
    canvas.height = window.innerHeight 
    canvas.width = canvas.height
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    ctx.font = "20px Arial";
    drawGrid(ctx, canvas.width, canvas.height, canvas.width/8);

    canvas.addEventListener("mousemove", mv, false);
    canvas.addEventListener("mousedown", dwn, false);
    canvas.addEventListener("mouseup", up, false);
    canvas.addEventListener("mouseout", out, false);
}

function mv(e) {
    findxy('move', e);
}
function dwn(e) {
    findxy('down', e);
}
function up(e) {
    findxy('up', e);
}
function out(e) {
    findxy('out', e);
}

function initPaintMode() {
    canvas.removeEventListener("mousemove", mv, false);
    canvas.removeEventListener("mousedown", dwn, false);
    canvas.removeEventListener("mouseup", up, false);
    canvas.removeEventListener("mouseout", out, false);

    canvas.addEventListener("mousedown", pnt, false);
}

function pnt(e) {
    var mouseX = e.pageX - canvas.offsetLeft,
        mouseY = e.pageY - canvas.offsetTop;

    paintAt(mouseX, mouseY)
}

function draw() {
    // ctx.beginPath();
    // ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    // ctx.closePath();
}

function erase() {
    var m = confirm("Want to clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
    }
}


function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.getBoundingClientRect().right;
        currY = e.clientY - canvas.getBoundingClientRect().top;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        ctx.closePath()
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}

function plotPoint(x, y) {
    ctx.fillStyle = "gray"
    ctx.fillRect(x, y, 20, 20)
}
function storeTiling() {
    fillColorR = 219;
    fillColorB = 219;
    fillColorG = 219
}

function updateColor() { //every time a call to floodfill is made, we should update the fill color
    curColor.b -= 30;
    curColor.g -= 30;
}

function floodfill(startX, startY, startR, startG, startB) {
    var newPos,
        x,
        y,
        pixelPos,
        reachLeft,
        reachRight,
        drawingBoundLeft = 0,
        drawingBoundTop = 0,
        drawingBoundRight = 0 + canvas.width,
        drawingBoundBottom = 0 + canvas.height,
        pixelStack = [[startX, startY]];
    

    while (pixelStack.length) {    

        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];

        // Get current pixel position
        pixelPos = (y * canvas.width + x) * 4;

        // Go up as long as the color matches and are inside the canvas
        while (y >= drawingBoundTop && matchStartColor(pixelPos, startR, startG, startB)) {
            y -= 1;
            pixelPos -= canvas.width * 4;
        }

        pixelPos += canvas.width * 4;
        y += 1;
        reachLeft = false;
        reachRight = false;

        // Go down as long as the color matches and in inside the canvas
        while (y <= drawingBoundBottom && matchStartColor(pixelPos, startR, startG, startB)) {
            y += 1;

            colorPixel(pixelPos, curColor.r, curColor.g, curColor.b);

            if (x > drawingBoundLeft) {
                if (matchStartColor(pixelPos - 4, startR, startG, startB)) {
                    if (!reachLeft) {
                        // Add pixel to stack
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else if (reachLeft) {
                    reachLeft = false;
                }
            }

            if (x < drawingBoundRight) {
                if (matchStartColor(pixelPos + 4, startR, startG, startB)) {
                    if (!reachRight) {
                        // Add pixel to stack
                        pixelStack.push([x + 1, y]);
                        reachRight = true;
                    }
                } else if (reachRight) {
                    reachRight = false;
                }
            }

            pixelPos += canvas.width * 4;
        }
    }
    ctx.putImageData(colorLayerData, 0, 0);

}

function paintAt (startX, startY) {
    updateColor();
    colorLayerData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    var pixelPos = (startY * canvas.width + startX) * 4,
        r = colorLayerData.data[pixelPos],
        g = colorLayerData.data[pixelPos + 1],
        b = colorLayerData.data[pixelPos + 2],
        a = colorLayerData.data[pixelPos + 3];


    floodfill(startX, startY, r, g, b);

}

function withinInterval(val, center,  margin) {
    return (val > center - margin && val < center + margin);

}
function matchStartColor(pixelPos, startR, startG, startB)
{
  var r = colorLayerData.data[pixelPos];    
  var g = colorLayerData.data[pixelPos+1];  
  var b = colorLayerData.data[pixelPos+2];

  return (r == startR && g == startG && b == startB) || (withinInterval(r, 204, 5) && withinInterval(b, 204, 5) && withinInterval(g, 204, 5)) || (r == 0 && b == 0 && g == 0);
}


function colorPixel(pixelPos)
{
  colorLayerData.data[pixelPos] = curColor.r;
  colorLayerData.data[pixelPos+1] = curColor.g;
  colorLayerData.data[pixelPos+2] = curColor.b;
  colorLayerData.data[pixelPos+3] = 255;
}


function drawGrid(ctx, w, h, step) {
    ctx.beginPath(); 
    i = 0;
    for (var x=0;x<=w;x+=step) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            if (i % 2 == 0) {
                ctx.fillText((2*x / w - 1).toString(), x, h/2);
            }
            i ++;
    }
    ctx.fillText((1).toString(), w-15, h/2);
    // set the color of the line
    ctx.strokeStyle = 'rgb(204,204,204)';
    ctx.lineWidth = 1;
    ctx.stroke(); 
    ctx.beginPath(); 
    for (var y=0;y<=h;y+=step) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            if (y/step % 2 == 0) {
                ctx.fillText((1 - 2*y/h).toString(), w/2, y);
            }
    }
    ctx.fillText("1", w/2, 15);
    ctx.strokeStyle = 'rgb(204,204,204)';
    ctx.lineWidth = 1;
    ctx.stroke(); 

    ctx.beginPath();
    ctx.moveTo(w/2, 0);
    ctx.lineTo(w/2, h);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, h/2);
    ctx.lineTo(w, h/2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.stroke();
};



initLineMode();
// plotPoint(10, 10)
console.log(canvas.height);