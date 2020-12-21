var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;


var x = "red",
    y = 5;

function init() {
    canvas = document.getElementById('can');
    canvas.height = window.innerHeight 
    canvas.width = canvas.height
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    ctx.font = "20px Arial";
    drawGrid(ctx, canvas.width, canvas.height, canvas.width/8)

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
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

function floodFill(a, b) {
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    startPixel = ctx.getImageData(0, 0, a, b).data;
    var startColor = [startPixel[0], startPixel[1], startPixel[2]]
    var pixelStack = [[a, b]];
    
    while(pixelStack.length) {
        var x, y, newPos, reachLeft, reachRight;
        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];
        pixelPos = (y*canvas.width+x)*4;

        while(y -- >= drawingBoundTop && matchColor(startColor, pixelPos)) {
            colorPixel(pixelPos);
        }
    }

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
    ctx.fillText("1", w/2, 15)
    ctx.strokeStyle = 'rgb(204,204,204)';
    ctx.lineWidth = 1;
    ctx.stroke(); 

    ctx.beginPath()
    ctx.moveTo(w/2, 0)
    ctx.lineTo(w/2, h)
    ctx.lineWidth = 5
    ctx.strokeStyle = "black"
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, h/2)
    ctx.lineTo(w, h/2)
    ctx.lineWidth = 5
    ctx.strokeStyle = "black"
    ctx.stroke()
};



init()
plotPoint(10, 10)
console.log(canvas.height)