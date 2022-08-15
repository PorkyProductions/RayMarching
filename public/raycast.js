/*


Copyright (c) 2022 PorkyProductions and its contributors
All rights reserved.


*/
var canvas = document.getElementById("canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var ctx = canvas.getContext("2d");
var obstacleSize = 40;
var mouseX = 0;
var mouseY = 0;
var laserAngle = 0;
var obstacles = [];
function Update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawCircle(mouseX, mouseY, 10);
    obstacles.forEach(function (obs) {
        FillCircle(obs[0], obs[1], obstacleSize, "black");
    });
    switch (AimInput()) {
        case "mouse":
            laserAngle = Math.atan2(mouseY - canvas.height / 2, mouseX - canvas.width / 2);
            break;
        case "rotate":
            laserAngle += 1 / 100;
    }
    if (AimInput() != "light") {
        DrawRect(canvas.width / 2, canvas.height / 2, 40, 3, laserAngle * 180 / Math.PI, "red");
        Laser(laserAngle, true);
    }
    else {
        for (var i = 0; i < 360; i += 1) {
            Laser(i / 180 * Math.PI, false);
        }
    }
    ctx.save();
    ctx.fillStyle = "red";
    FillCircle(canvas.width / 2, canvas.height / 2, 10, "black");
    ctx.restore();
}
function Laser(laserAngle, draw) {
    var vectorX = Math.cos(laserAngle);
    var vectorY = Math.sin(laserAngle);
    var distance = 10000;
    var curX = canvas.width / 2;
    var curY = canvas.height / 2;
    if (obstacles.length > 0) {
        distance = 0;
        //while (distance < 10000 & increase > 0.1) {
        var smallError = false;
        var _loop_1 = function (i) {
            var smallestDistance = 10000;
            obstacles.forEach(function (obs) {
                smallestDistance = Math.min(smallestDistance, GetDistance(curX, curY, obs[0], obs[1]) - obstacleSize);
            });
            if (smallestDistance > 0 && draw) {
                DrawCircle(curX, curY, smallestDistance);
            }
            distance += smallestDistance;
            curX = canvas.width / 2 + vectorX * distance;
            curY = canvas.height / 2 + vectorY * distance;
            if (smallestDistance < 1) {
                ctx.save();
                ctx.strokeStyle = "red";
                FillCircle(curX, curY, 5, "red");
                ctx.restore();
                smallError = true;
            }
        };
        for (var i = 0; i < 100 && !smallError; i++) {
            _loop_1(i);
        }
    }
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineTo(canvas.width / 2 + (vectorX * distance), canvas.height / 2 + (vectorY * distance));
    ctx.stroke();
}
function GetDistance(x1, y1, x2, y2) {
    var y = x2 - x1;
    var x = y2 - y1;
    return Math.sqrt(x * x + y * y);
}
function DrawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
}
function FillCircle(x, y, r, color) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
function DrawRect(x, y, width, height, degrees, color) {
    // first save the untranslated/unrotated context
    ctx.save();
    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(x, y);
    // rotate the rect
    ctx.rotate(degrees * Math.PI / 180);
    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    //       so the rect needs to be offset accordingly when drawn
    ctx.rect(-width / 2, -height / 2, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    // restore the context to its untranslated/unrotated state
    ctx.restore();
}
function AimInput() {
    var ele = document.getElementsByName('aim');
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].checked)
            return ele[i].value;
    }
}
var mouseDown = 0;
var mouseRightDown = 0;
window.onload = function () {
    document.body.onmousedown = function (event) {
        if (event.which == 3) {
            return;
        }
        if (MouseInBounds()) {
            obstacles.push([mouseX, mouseY]);
        }
    };
};
function GetMousePos(evt) {
    Update();
    var rect = canvas.getBoundingClientRect();
        mouseX = evt.clientX - rect.left;
        mouseY = evt.clientY - rect.top;
    
}
function MouseInBounds() {
    return (mouseX > 0 && mouseY > 0 && mouseX < canvas.width && mouseY < canvas.height) 
    
}
setInterval(function () {
    Update();
}, 50);
window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
}, false);
