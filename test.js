const fs =  require("fs");
const {dialog} = require("electron").remote;

let orImgD; //Original image data
var newImgD; //New image data transformed
var outImgD; //Outline data
var newImg = document.createElement('img');
let WIDTH = 640;
let HEIGHT = 480;
let animIndex = 0; //Line height animator is at
let animC = 0; //Amount of dispatched animators
let animator = 0; //Last animator ID
let content = "";
let buf;



window.onkeyup = async function (event){
        var key = event.key;
        var output = document.getElementById("console");
        var input = output.value;
        if(key == "Enter"){
            var args = [];
            if(input.startsWith("gimg"))
            {
                if(input.length > 4)
                    args = input.substr(5).split(" ");
                else
                    args = [];
                if(args.length == 1)
                {
                    correctInput(true);
                    Gimg2(args[0]);
                }
                else if(args.length == 2)
                {
                    correctInput(true);
                    Gimg2(args[0], args[1]);
                }
                else
                {
                    correctInput(false);
                    console.log("Incorrect argument count "+args.length);
                }
            }
            else
            if(input.startsWith("limg"))
                {
                    if(input.length > 4)
                        args = input.substr(5).split(" ");
                    else
                        args = [];
                    //console.log("args" + args+" s "+args.length);
                    if(args.length == 1)
                    {
                        correctInput(true);
                        Limg(args[0]);
                    }
                    else
                    {
                        correctInput(false);
                        console.log("Incorrect argument count "+args.length);
                    }
                }
                else if(input.startsWith("help"))
                {
                    if(input.length > 4)
                        args = input.substr(5).split(" ");
                    else
                        args = [];
                    if(args.length == 1)
                    {
                        correctInput(true);
                        switch(args[0]){
                            case "limg":
                            output.value="Read .gbf at arg0"
                            break;

                            case "gimg":
                            output.value="Generate image from arg0[, bw contrast arg1(0-255)]"
                            break;

                            case "help":
                            output.value="Shows info about arg0"
                            break;
                        }
                    }
                    else
                    {
                        correctInput(false);
                        console.log("Incorrect argument count "+args.length);
                    }
                }
                else
                {
                    console.log("Unrecognized command");
                    correctInput(false);
                }
        }
    }

/*
    function test(source, val=100){
        var payload = [];
        console.log(Gimg2(source, val));
        payload = func;

        /*
        var nl = (process.platform === 'win32' ? '\r\n' : '\n')
        var content = "<Generated blackWhite file>"+nl;
        for(var i=0; i < payload.bwImage.length; i++){
            content.concat(payload.bwImage[i]+",");
            if(i % (WIDTH*4) == 0)
                content.concat(nl);
        }
        content.concat(nl);
        var outTemp = {};
        while(payload.outlines.length > 0)
        {
            outTemp = payload.outlines.pop();
            content.concat("["+outTemp.x+","+outTemp.y+"],");
        }
        dialog.showSaveDialog({filters : [{name: 'Generated file(*.gbf)', extensions: ['gbf']}]}, (filename) => {
            if(filename == undefined)
            {
                return;
            }
            else
            {
                fs.writeFile(filename, content, (err) => {
                    if(err){
                        console.log(err.message);
                    }
                })
            }
        });*/
    //}

    async function Gimg2(source, val=100){
        var curDir = './'
        var nl = (process.platform === 'win32' ? '\r\n' : '\n')
        var something = {};
        newImg.src = curDir.concat(source);
        const test = () => new Promise(resolve => newImg.addEventListener('load', resolve,  { once: true }));
        await test();
        //console.log(guess);
        WIDTH = newImg.width;
        HEIGHT = newImg.height;
        img.canvas.width = WIDTH;
        img.canvas.height = HEIGHT;
        img.picStat.innerText = "("+WIDTH+","+HEIGHT+")";
        img.context.drawImage(newImg,0,0);
        orImgD = img.context.getImageData(0,0,WIDTH,HEIGHT);
        
        something = await blackWhite(val);

        //console.log("please?"+something.outlines);

        var counter = 0; //Counts the amount of duplicate pixels in the sequence, and groups them together
        var last = 0; //Last checked value, starting at black
        var buffStream;
        const test2 = () => new Promise(function(resolve){
            //length of the bw image is always a multiple of four, so no rounding is necessary
            var tempAr = [];

            //buffStream.writeInt32LE((something.bwImg.length/4));
            tempAr.push(WIDTH); //width image
            console.log("should be reading "+WIDTH);
            tempAr.push(HEIGHT); //height image
            if(WIDTH*HEIGHT !== (something.bwImg.length/4))
                console.log("ERROR PARSING FILE "+(WIDTH*HEIGHT)+" DOES NOT MATCH "+(something.bwImg.length/4));
            console.log("expected outcome of size "+(something.bwImg.length/4));
            for(var i=0; i < something.bwImg.length; i+=4){
                if(something.bwImg[i] == last)
                    counter++;
                else
                {
                    tempAr.push(counter);
                    counter = 1;
                }
                last = something.bwImg[i];
            }
            tempAr.push(counter);
            var outTemp = {};
            for(var i=0; i < something.outlines.length; i++)
            {
                while(something.outlines[i].length > 0)
                {
                    outTemp = something.outlines[i].pop();
                    tempAr.push(outTemp.x);
                    tempAr.push(outTemp.y);
                }
            }

            buffStream = Buffer.alloc(tempAr.length*2); //2 bytes for all entries. First two are the size
            var int16ar = Int16Array.from(tempAr); //Converts values to 16 bit unsigned integers
            //console.log("the array says "+int16ar[0]+" and "+int16ar[1] + "with typeof "+(typeof int16ar[0]));
            for(var i=0; i < int16ar.length; i++){
                buffStream.writeUInt16LE(int16ar[i], i*2); //Writes away the 16 bit uints to the buffer
            }
            //console.log("first entry is "+buffStream.readUInt16LE(0)+" and "+buffStream.readUInt16LE(2) +" should be "+tempAr[0] +" and "+tempAr[1])
            content = content + "<end>";
            resolve('done');
        });
        var yo =await test2();
        //const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));
        //while(!done)
        //    await timeoutPromise(1000);
        console.log(yo);
        //console.log("so ye");
        dialog.showSaveDialog({filters : [{name: 'Generated file(*.gbf)', extensions: ['gbf']}]}, (filename) => {
            if(filename == undefined)
            {
                return;
            }
            else
            {
                fs.writeFile(filename, buffStream, (err) => {
                    if(err){
                        console.log(err.message);
                    }
                })
            }
        });
    }


    function correctInput(correct){
        var target = document.getElementById("prefixc");
        target.readOnly = false;
        target.value = correct ? ">" : "X";
        target.readOnly = true;
    }

    //Searches an image starting at the current directory. May fail
    function Limg(source){
        var buffer;
        var curDir = './'
        var extension = '.gbf'
        curDir = curDir.concat(source)+extension;

        buffer = fs.readFileSync(curDir);
        var reconstruct;
        var loadData = [];
        var loadOutline = [];
        var temp;
        var width = buffer.readUInt16LE(0);
        var height = buffer.readUInt16LE(2);
        WIDTH = width;
        HEIGHT = height;
        img.canvas.width = width;
        img.canvas.height = height;
        img.picStat.innerText = "("+width+","+height+")";
        var pixCount = 0;
        console.log("this is the upperLimit "+(width*height));
        console.log("data pushed start"+loadData.length);
        //if i%4==0 then black, otherwise white
        for(var i=4; i < buffer.length; i+=2){
            if(pixCount < (width*height))
            {
                temp = buffer.readUInt16LE(i);
                if(i % 4 == 0) //Then black
                    {
                        for(var b=0; b < temp; b++)
                        {
                            pixCount++;
                            loadData.push(0); //Push four times because r,g,b,o
                            loadData.push(0);
                            loadData.push(0);
                            loadData.push(255);
                        }
                    }
                else
                    {
                        for(var b=0; b < temp; b++) //Then white
                        {
                            pixCount++;
                            loadData.push(255); //Push four times because r,g,b,o
                            loadData.push(255);
                            loadData.push(255);
                            loadData.push(0);
                        }
                        //console.log("at pixel "+i+" we have "+pixCount+" pixels")
                    }
            }
            else
            {
                var newEntry = {x:0, y:0};
                newEntry.x = buffer.readUInt16LE(i);
                i+=2;
                newEntry.y = buffer.readUInt16LE(i);
                loadOutline.push(newEntry);
            }
        }

        //console.log("data pushed "+loadData.length);
        reconstruct = new ImageData(Uint8ClampedArray.from(loadData), width, height);

        var outAr = createEmpty(loadData.length, true); //Empty array we write to of the size of the image

        var noutImg = new ImageData(Uint8ClampedArray.from(outAr), width, height);
        //window.setInterval(redraw, 1, noutImg); //Keep refreshing the image
        animator = window.setInterval(drawOutLineAnim, 1, loadOutline, noutImg, reconstruct, 2);
        //scr.drawCanvas();
        /*
        while(loadOutline.length > 0)
        {
            animator = null;
            animator = window.setInterval(drawOutLineAnim, 1, allOutlines.pop(), noutImg);
        }*/
        //img.context.putImageData(reconstruct, 0, 0);
        /*
        newImg.onload = function(){
            WIDTH = newImg.width;
            HEIGHT = newImg.height;
            img.canvas.width = WIDTH;
            img.canvas.height = HEIGHT;
            img.context.drawImage(newImg,0,0);
            img.picStat.innerText = "("+WIDTH+","+HEIGHT+")";
            orImgD = img.context.getImageData(0,0,WIDTH,HEIGHT);
            //blackWhite(val);
            }*/
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

    async function blackWhite(val){

        var allOutlines;

        var white = false;
        var outline = false;
        var thresh = val;
        //newImgD.data = orImgD.data.slice();
        var data = [];
        for(var i=0; i < orImgD.data.length; i+=4)
        {
            //Selects white casts it to white otherwise black
            white = !(orImgD.data[i] < thresh && orImgD.data[i + 1] < thresh && orImgD.data[i + 2] < thresh) || (orImgD.data[i+3] <= 100);
            data[i] = white ? 255 : 0;
            data[i + 1] = white ? 255 : 0;
            data[i + 2] = white ? 255 : 0;
            //data[i + 3] = 255;
            //data[i + 3] = orImgD.data[i + 3];
            data[i + 3] = !white ? 255 : 0;
        }
        var bwImage = new ImageData(Uint8ClampedArray.from(data), WIDTH, HEIGHT);
        img.context.clearRect(0, 0, WIDTH, HEIGHT);
        img.context.putImageData(bwImage, 0, 0);

        var outData = [];

        
        //If I'm a white pixel and I have a black neighbour(perfect joke setup right there)
        //Im part of the outline. 
        for(var x=0; x < data.length; x+=4){
            outline = (data[x] == 255) && hasBNeighbour(data, x);
            outData[x] = outline ? 255 : 0;
            outData[x + 1] = outline ? 255 : 0;
            outData[x + 2] = outline ? 255 : 0;
            outData[x + 3] = outline ? 255 : 0;
        }
        var totalOutlineEntries = 0; //Keeps track of all outline entries
        var whitePixels = getWhitePixels(outData); //Changes pixels to a dictionary with coordinates instead
        //console.log("whitepixels "+whitePixels.length);
        while(whitePixels.length > 0)
        {
            allOutlines = allOutlines == undefined ? [] : allOutlines;
            var startE = {};
            startE = whitePixels.pop();
            //console.log(startE);
            if(startE !== null)
            {
                var actualOutline = null;
                actualOutline = findOutline(whitePixels, outData, startE);
                totalOutlineEntries += actualOutline.length;
                allOutlines.push(actualOutline);
            }
        }
        //scr.drawCanvas();
        //console.log("outline "+actualOutline.length);
        //console.log("from bwhite "+returnSomething);

        return {outlines: allOutlines, bwImg: data, outCount: totalOutlineEntries};

        //animAr = createEmpty(outData.length, false);


        //var outAr = createEmpty(outData.length, true);
        /*
        animAr.length = outData.length;
        animAr.fill(0);
        for(var x=0; x < animAr.length; x+=4){
            animAr[x + 3] = 255;
        }*/
        //var clampedAnimAr = Uint8ClampedArray.from(animAr);
        //console.log(clampedAnimAr);

        //var outimg = new ImageData(Uint8ClampedArray.from(outData), WIDTH, HEIGHT);
        //var noutImg = new ImageData(Uint8ClampedArray.from(outAr), WIDTH, HEIGHT);

        //animator = setInterval(drawAnimation, 1, outimg);
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
        //console.log("first: "+outline[outline.length-1].x +","+outline[outline.length-1].y);
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
    
    function drawOutLineAnim(outline, target, fullimg, speed=1){
        if(!(outline.length > 0))
        {
            img.context.putImageData(fullimg, 0, 0);
            window.clearInterval(animator);
            return;
        }
        var tar = {};
        for(var i=0; i < speed; i++)
        {
            tar = outline.pop();
            target.data[tar.x*4 + WIDTH*4*tar.y + 0] = 0;
            target.data[tar.x*4 + WIDTH*4*tar.y + 1] = 0;
            target.data[tar.x*4 + WIDTH*4*tar.y + 2] = 0;
            target.data[tar.x*4 + WIDTH*4*tar.y + 3] = 255;
            animIndex++;
        }
        //Now draws pixel by pixel, and from top to bottom
        img.context.putImageData(target, 0, 0, 0, 0, WIDTH, animIndex);

    }

    function redraw(target){
        img.context.putImageData(target, 0, 0);
    }


