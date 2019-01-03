const fs = require("fs");
var getpixels = require("get-pixels");
var BlackWhite = require("./ImageFunctions.js")();
const {dialog} = require("electron").remote;

function drawOutLineAnim(canvas, outline, target, fullImg, animator, speed = 1) {
    if (!(outline.length > 0)) {
        canvas.context.putImageData(fullImg, 0, 0);
        window.clearInterval(animator);
        return;
    }

    var tar = {};
    for (var i = 0; i < speed; i++) {
        tar = outline.pop();
        target.data[tar.x * 4 + fullImg.width * 4 * tar.y + 0] = 255;
        target.data[tar.x * 4 + fullImg.width * 4 * tar.y + 1] = 255;
        target.data[tar.x * 4 + fullImg.width * 4 * tar.y + 2] = 255;
        target.data[tar.x * 4 + fullImg.width * 4 * tar.y + 3] = 255;
        this.animIndex++;
    }

    canvas.context.putImageData(target, 0, 0);
}

module.exports = class GBF {

    constructor(path) {
        this.img;
        this.outlines;
        this.width;
        this.height;
        if(path != undefined)
            this.load(path);
    }

    //Creates an empty black RGB array of length length, either transparent or not
    createEmpty(length, transparent) {
        var newAr = [];
        newAr.length = length;
        newAr.fill(0);
        for (var x = 0; x < newAr.length; x += 4) {
            newAr[x + 3] = transparent ? 0 : 255;
        }
        return newAr;
    }

    async generate(source, thresh){
        // var newImg = document.createElement('img');
        // newImg.src = './'.concat(source);

        // const test = () => new Promise(resolve => newImg.addEventListener('load', resolve, { once: true }));
        // await test();
        // this.width = newImg.width;
        // this.height = newImg.height;
        // imgCanvas.canvas.width = this.width;
        // imgCanvas.canvas.height = this.height;
        // imgCanvas.picStat.innerText = "(" + this.width + "," + this.height + ")";
        // imgCanvas.context.drawImage(newImg, 0, 0);
        // orImgD = img.context.getImageData(0, 0, this.width, this.height);
        return new Promise((resolve) => getpixels(source, (err, pixels) => {
            this.width = pixels.shape[0];
            this.height = pixels.shape[1];
            var orImgD = new ImageData(Uint8ClampedArray.from(pixels.data), this.width, this.height);
            this.img = BlackWhite.toBlackWhite(orImgD, this.width, this.height, thresh);
            this.outlineImg = BlackWhite.toOutlineImage(this.img);
            this.outlines = BlackWhite.getOutlinesFromImage(this.outlineImg);
            resolve("ok");
        }));
    }

    async save(){
        var counter = 0; //Counts the amount of duplicate pixels in the sequence, and groups them together
        var last = 0; //Last checked value, starting at black
        var tempAr = [this.width, this.height];
        //compress bwimg 
        for (var i = 0; i < this.img.data.length; i += 4) {
            if (this.img.data[i] == last)
                counter++;
            else {
                tempAr.push(counter);
                counter = 1;
            }
            last = this.img.data[i];
        }
        tempAr.push(counter);

        //add outlines
        for (var i = 0; i < this.outlines.length; i++) {
            while (this.outlines[i].length > 0) {
                var outTemp = this.outlines[i].pop();
                tempAr.push(outTemp.x);
                tempAr.push(outTemp.y);
            }
        }

        var buffStream = Buffer.alloc(tempAr.length * 2); //2 bytes for all entries. First two are the size
        var int16ar = Uint16Array.from(tempAr); //Converts values to 16 bit unsigned integers
        for (var i = 0; i < int16ar.length; i++) {
            buffStream.writeUInt16LE(int16ar[i], i * 2); //Writes away the 16 bit uints to the buffer
        }

        dialog.showSaveDialog({ filters: [{ name: 'Generated file(*.gbf)', extensions: ['gbf'] }] }, (filename) => {
            if (filename == undefined) {
                return;
            }
            else {
                fs.writeFile(filename, buffStream, (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                })
            }
        });
    }

    load(path) {
        var curDir = './' + path + '.gbf';
        var buffer = fs.readFileSync(curDir);
        this.img = [];
        this.outlines = [];

        this.width = buffer.readUInt16LE(0);
        this.height = buffer.readUInt16LE(2);

        var i;
        var pixCount = 0;
        for (i = 4; pixCount < (this.width * this.height); i += 2) {
            var temp = buffer.readUInt16LE(i);
            for (var b = 0; b < temp; b++) {
                pixCount++;
                var col = 255;
                if (i % 4 == 0) // black
                    col = 0;

                this.img.push(col); // Push four times because r,g,b,a
                this.img.push(col);
                this.img.push(col);
                this.img.push(255);
            }
        }

        for (i; i < buffer.length; i += 4) {
            var newEntry = {};
            newEntry.x = buffer.readUInt16LE(i);
            newEntry.y = buffer.readUInt16LE(i + 2);
            this.outlines.push(newEntry);
        }
    }

    animate(canvas) {
        this.animIndex = 0; //Line height animator is at
        canvas.canvas.width = this.width;
        canvas.canvas.height = this.height;
        canvas.picStat.innerText = "(" + this.width+ "," + this.height + ")";
        var noutImg = new ImageData(Uint8ClampedArray.from(this.createEmpty(this.img.length, true)),
            this.width,
            this.height);
        var fullimg = new ImageData(Uint8ClampedArray.from(this.img), this.width, this.height);
        this.animator = window.setInterval(drawOutLineAnim, 1, canvas, this.outlines, noutImg, fullimg, 1);
    }
}