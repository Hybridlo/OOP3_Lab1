function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function checkToDraw(done, amount) {
    if (done == amount + 1) {    //+1 for hedgehog
        setTimeout(draw, 50);    //to make sure everything loaded
    }
}

function generate() {
    var done = 0;

    drawInfos = []

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

    var imgHedg = new Image();
    imgHedg.addEventListener("load", function () {
        var drawInfo = {
        x: (gl.canvas.width - imgHedg.width),
        y: (gl.canvas.height - imgHedg.height) / 2,
        textureInfo: loadImageAndCreateTextureInfo('hedgehog.png'),
        };

        drawInfos.push(drawInfo);
        done++;
        checkToDraw(done, amount);
    });
    imgHedg.src = 'hedgehog.png';

    document.getElementById("generate").disabled = "disabled";
    document.getElementById("collect").disabled = "";
}