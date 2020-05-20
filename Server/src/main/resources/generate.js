function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function checkToDraw(done, amount) {
    if (done == amount + 1) {    //+1 for hedgehog
        setTimeout(draw, 50);    //to make sure everything loaded
    }
}

var hedgIndex;

function generate() {
    var done = 0;

    drawInfos = []

    var imgHedg = new Image();
    imgHedg.addEventListener("load", function () {
        var drawInfo = {
        x: (gl.canvas.width - imgHedg.width),
        y: (gl.canvas.height - imgHedg.height) / 2,
        textureInfo: loadImageAndCreateTextureInfo('hedgehog.png'),
        };

        drawInfos.push(drawInfo);
        hedgIndex = drawInfos.indexOf(drawInfo);
        done++;
        checkToDraw(done, amount);
    });
    imgHedg.src = 'hedgehog.png';

    var amount = parseInt(document.getElementById('applesAmount').value, 10)

    var imgApple = new Image();
    imgApple.addEventListener("load", function () {

        for (var i = 0; i < amount; i++){
            var drawInfo = {
            x: Math.random() * (gl.canvas.width - imgApple.width - imgHedg.width),
            y: Math.random() * (gl.canvas.height - imgApple.height),
            textureInfo: loadImageAndCreateTextureInfo('apple.png'),
            };
            drawInfos.push(drawInfo);
            done++;
            checkToDraw(done, amount);
        }
        
    });
    imgApple.src = 'apple.png';    //to know width and height

    document.getElementById("generate").disabled = "disabled";
    document.getElementById("collect").disabled = "";
}

function sendPositionsString() {
    var send = "[";
    send += "[";        //hedgehog first
    send += String(Math.round(drawInfos[hedgIndex].x + drawInfos[hedgIndex].textureInfo.width / 2));
    send += ", ";
    send += String(Math.round(drawInfos[hedgIndex].y + drawInfos[hedgIndex].textureInfo.height / 2));
    send += "]";
    send += ", "; 

    drawInfos.forEach(drawInfo => {
        if (drawInfos.indexOf(drawInfo) === hedgIndex)
            return;
        send += "[";
        send += String(Math.round(drawInfo.x + drawInfo.textureInfo.width / 2));
        send += ", ";
        send += String(Math.round(drawInfo.y + drawInfo.textureInfo.height / 2));
        send += "]";
        if (drawInfos.indexOf(drawInfo) !== drawInfos.length - 1 && (drawInfos.indexOf(drawInfo) + 1 !== hedgIndex || hedgIndex !== drawInfos.length - 1))
            send += ", "; 
    });
    send += "]";

    return send;
}

function getOrder(data) {
    var order = [];

    var start = 0;
    var space = 0;

    while (space !== -1) {
        space = data.indexOf(" ", start);
        var index;
        if (space === -1)
        {
            index = parseInt(data.substring(start));
        }
        else
            index = parseInt(data.substring(start, space));

        if (index >= hedgIndex)     //to exclude hedgehog
            index++;
        
        order.push(index);
        start = space + 1;
    }

    return order;
}

function startAnimation(order) {
    var speed = 150;
    var delta = 5;
    var hedgCenter = [drawInfos[hedgIndex].x + Math.round(drawInfos[hedgIndex].textureInfo.width / 2), drawInfos[hedgIndex].y + Math.round(drawInfos[hedgIndex].textureInfo.height / 2)];
    var appleCenter = [drawInfos[order[0]].x + Math.round(drawInfos[order[0]].textureInfo.width / 2), drawInfos[order[0]].y + Math.round(drawInfos[order[0]].textureInfo.height / 2)];
    var dx = appleCenter[0] - hedgCenter[0];
    var dy = appleCenter[1] - hedgCenter[1];
    [dx, dy] = [dx / (Math.abs(dx) + Math.abs(dy)), dy / (Math.abs(dx) + Math.abs(dy))];            //dx + dy = 1

    var then = 0;
    function render(time) {
        var now = time * 0.001;
        var deltaTime = Math.min(0.1, now - then);
        then = now;
    
        var state = update(deltaTime);
        draw();
    
        var left = 0;
        if (state)
            requestAnimationFrame(render);
        else
            document.getElementById("generate").disabled = "";
    }
    requestAnimationFrame(render);

    function checkProximity() {
        hedgCenter = [drawInfos[hedgIndex].x + Math.round(drawInfos[hedgIndex].textureInfo.width / 2), drawInfos[hedgIndex].y + Math.round(drawInfos[hedgIndex].textureInfo.height / 2)];
        if (Math.abs(hedgCenter[0] - appleCenter[0]) < delta && Math.abs(hedgCenter[1] - appleCenter[1]) < delta) {
            drawInfos[order[0]] = null;
            order.shift();

            if (order.length === 0)
                return false;

            appleCenter = [drawInfos[order[0]].x + Math.round(drawInfos[order[0]].textureInfo.width / 2), drawInfos[order[0]].y + Math.round(drawInfos[order[0]].textureInfo.height / 2)];
            dx = appleCenter[0] - hedgCenter[0];
            dy = appleCenter[1] - hedgCenter[1];
            [dx, dy] = [dx / (Math.abs(dx) + Math.abs(dy)), dy / (Math.abs(dx) + Math.abs(dy))];
        }
        return true;
    }

    function update(deltaTime) {
        drawInfos[hedgIndex].x += dx * speed * deltaTime;
        drawInfos[hedgIndex].y += dy * speed * deltaTime;

        return checkProximity();
    }
}

function collect() {
    let socket = new WebSocket("ws://localhost:8025/solver/ws");

    var infoField = document.getElementById("status");
    infoField.textContent = "Waiting for server connection...";

    socket.onopen = function(e) {
        infoField.textContent = "Connection established, waiting for solution...";
        socket.send(sendPositionsString());
    };
      
    socket.onmessage = function(event) {
        document.getElementById("collect").disabled = "disabled";
        infoField.textContent = "Response: " + event.data;
        var order = getOrder(event.data);
        startAnimation(order);
    };
      
    socket.onclose = function(event) {
        infoField.textContent = "Connection closed";
    };
      
    socket.onerror = function(error) {
        alert(`[error] ${error.message}`);
    };
}