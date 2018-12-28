

let orImgD; //Original image data
var newImgD; //New image data transformed
var outImgD; //Outline data
var newImg = document.createElement('img');
let WIDTH = 640;
let HEIGHT = 480;
let animIndex = 0; //Line height animator is at

newImg.src = './Scrooge.png';

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
        var thresh = 31;
        //newImgD.data = orImgD.data.slice();
        var data = [];
        for(var i=0; i < orImgD.data.length; i+=4)
        {
            //Selects white casts it to white
            white = !(orImgD.data[i] < thresh && orImgD.data[i + 1] < thresh && orImgD.data[i + 2] < thresh) || (orImgD.data[i+3] <= 100);
            data[i] = white ? 255 : 0;
            data[i + 1] = white ? 255 : 0;
            data[i + 2] = white ? 255 : 0;
            //data[i + 3] = 255;
            data[i + 3] = orImgD.data[i + 3];
        }

        var bwImage = new ImageData(Uint8ClampedArray.from(data), WIDTH, HEIGHT);
        scr.context.putImageData(bwImage, 0, 0);
        var outData = [];


        //If I'm a white pixel and I have a black neighbour(perfect joke setup right there)
        //Im part of the outline
        for(var x=0; x < data.length; x+=4){
            outline = (data[x] == 255) && hasBNeighbour(data, x);
            outData[x] = outline ? 255 : 0;
            outData[x + 1] = outline ? 100 : 0;
            outData[x + 2] = outline ? 255 : 0;
            outData[x + 3] = outline ? 255 : 0;
        }

        var whitePixels = getWhitePixels(outData);
        console.log("whitepixels "+whitePixels.length);
        var allOutlines = [];

        while(whitePixels.length > 0)
        {
            var startE = {};
            startE = whitePixels.pop();
            //console.log(startE);
            if(startE !== null)
            {
                var actualOutline = null;
                actualOutline = findOutline(whitePixels, outData, startE);
                allOutlines.push(actualOutline);
            }
        }
        console.log("outline "+actualOutline.length);

        animAr = createEmpty(outData.length, false);
        var outAr = createEmpty(outData.length, true);
        /*
        animAr.length = outData.length;
        animAr.fill(0);
        for(var x=0; x < animAr.length; x+=4){
            animAr[x + 3] = 255;
        }*/
        var clampedAnimAr = Uint8ClampedArray.from(animAr);
        console.log(clampedAnimAr);
        var outimg = new ImageData(Uint8ClampedArray.from(outData), WIDTH, HEIGHT);
        var noutImg = new ImageData(Uint8ClampedArray.from(outAr), WIDTH, HEIGHT);
        //animator = setInterval(drawAnimation, 1, outimg);
        console.log(actualOutline.length);
        //drawOutLineAnim(actualOutline,noutImg);

        while(allOutlines.length > 0)
        {
            var animator = null;
            animator = setInterval(drawOutLineAnim, 1, allOutlines.pop(), noutImg, animator);
        }
    }

    //Creates an empty black RGB array of length length, either transparent or not
    function createEmpty(length, transparent){
        newAr = [];
        newAr.length = length;
        newAr.fill(0);
        for(var x=0; x < newAr.length; x+=4){
            newAr[x + 3] = transparent ?  0 : 255;
        }
        return newAr;
    }

    function findOutline(whitePixels, orImage, startElem){

        function searchNeighbour(orImage, outline, x, y){
            var num = getWhitePixel(orImage, outline[i].x+x, outline[i].y+y);
            var n = contains(whitePixels, num);
            if(n != null) {
                outline.push(num);
                //console.log("pushing value at x "+num.x+" y "+num.y);
                whitePixels[n] = null;
            }
        };

        function contains(list, elem){
            if (elem == null) return null;

            for(var i = 0; i < list.length; i++){
                if(JSON.stringify(list[i]) == JSON.stringify(elem)) return i;
            }
            return null;
        };

        function getWhitePixel(orImage, x, y){
            var index = (x*4 + y*WIDTH*4);
            if(index < 0 || index >= orImage.length)
                return null;

            var num = orImage[index];
            if (num == 255){
                return {x:x, y:y};
            }
            return null;
        };

        var outline = [];
        outline.push(startElem);
        console.log("first: "+outline[outline.length-1].x +","+outline[outline.length-1].y);
        var i;
        for(i=0; i < outline.length; i++){
            searchNeighbour(orImage, outline, -1, -1);
            searchNeighbour(orImage, outline, -1, +1);
            searchNeighbour(orImage, outline, -1,  0);
            searchNeighbour(orImage, outline,  0, -1);
            searchNeighbour(orImage, outline,  0, +1);
            searchNeighbour(orImage, outline, +1, -1);
            searchNeighbour(orImage, outline, +1, +1);
            searchNeighbour(orImage, outline, +1,  0);
        }
        //console.log("ended after iteration "+(i+1));
        return outline;
    }


    function getWhitePixels(orAr){
        var newAr = [];
        for(var i=0; i < orAr.length; i+=4){
            if(orAr[i] == 255)
                newAr.push({x: (i/4) % WIDTH, y: ~~((i/4) /WIDTH)});
        }
        return newAr;
    }

    function drawAnimation(sourceAr){
            if(animIndex == HEIGHT)
            {
                animDone = true;
                clearInterval(animator);
                return;
            }
            animIndex ++;
            img.context.putImageData(sourceAr, 0, 0, 0, 0, WIDTH, animIndex);
    }

    function drawOutLineAnim(outline, target, myself){
        if(!(outline.length > 0))
        {
            clearInterval(myself);
            animDone = true;
            console.log("done");
            return;
        }
        var tar = {};
        tar = outline.pop();
        //console.log(tar);
        //for(var i=0; i <=4; i++)
        //{
            //console.log("ok" + (tar.x*4 + WIDTH*4*tar.y + i));
        target.data[tar.x*4 + WIDTH*4*tar.y + 0] = 255;
        target.data[tar.x*4 + WIDTH*4*tar.y + 1] = 100;
        target.data[tar.x*4 + WIDTH*4*tar.y + 2] = 255;
        target.data[tar.x*4 + WIDTH*4*tar.y + 3] = 255;
        //}

        img.context.putImageData(target, 0, 0);
    }



/*
const Square = require("./square.js");
var sq = new Square();
events.emit('addObject', sq);


function mousedown(ev){
    console.log(sq.isClicked(ev.clientX, ev.clientY));
}*/