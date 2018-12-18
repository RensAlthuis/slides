

let orImgD; //Original image data
var newImgD; //New image data transformed
var outImgD; //Outline data
var newImg = document.createElement('img');
let WIDTH = 640;
let HEIGHT = 480;
let animIndex = 0; //Line height animator is at
var animator;

newImg.src = './input.png';

    newImg.onload = function(){
    scr.context.drawImage(newImg,10,10);
    orImgD = scr.context.getImageData(0,0,WIDTH,HEIGHT);
    blackWhite();
    }

    function hasBNeighbour(arr, index){
        if(index - 4 >= 0 && arr[index - 4] == 0)
            return true;
        else if(index + 4 < arr.length && arr[index + 4] == 0)
            return true;
        else if(index - WIDTH*4 >= 0 && arr[index - WIDTH*4] == 0)
            return true;
        else if(index + WIDTH*4 < arr.length && arr[index + WIDTH*4] == 0)
            return true;

        return false;
    }

    function blackWhite(){
        var white = false;
        var outline = false;
        var thresh = 100;
        //newImgD.data = orImgD.data.slice();
        var data = [];
        for(var i=0; i < orImgD.data.length; i+=4)
        {
            white = !(orImgD.data[i] < thresh && orImgD.data[i + 1] < thresh && orImgD.data[i + 2] < thresh);
            if(white)
            console.log("test");
            data[i] = white ? 255 : 0;
            data[i + 1] = white ? 255 : 0;
            data[i + 2] = white ? 255 : 0;
            data[i + 3] = orImgD.data[i + 3];
        }
        console.log(data);
        var outData = [];

        //console.log(outImgD.data.length);
        for(var x=0; x < data.length; x+=4){
            outline = (data[x] == 255) && hasBNeighbour(data, x);
            outData[x] = outline ? 255 : 0;
            outData[x + 1] = outline ? 255 : 0;
            outData[x + 2] = outline ? 255 : 0;
            outData[x + 3] = 255;
        }

        animAr = [];
        animAr.length = outData.length;
        animAr.fill(0);
        for(var x=0; x < animAr.length; x+=4){
            animAr[x + 3] = 255;
        }
        var clampedAnimAr = Uint8ClampedArray.from(animAr);
        console.log(clampedAnimAr);
        var outimg = new ImageData(Uint8ClampedArray.from(outData), WIDTH, HEIGHT);
        animator = setInterval(drawAnimation, 10, outimg);
    }

    function drawAnimation(sourceAr){
            if(animIndex == HEIGHT)
            {
                clearInterval(animator);
                return;
            }
            animIndex ++;
            scr.context.putImageData(sourceAr, 0, 0, 0, 0, WIDTH, animIndex);
    }



/*
const Square = require("./square.js");
var sq = new Square();
events.emit('addObject', sq);


function mousedown(ev){
    console.log(sq.isClicked(ev.clientX, ev.clientY));
}*/