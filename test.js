var Screen = require("./Screen.js");
var GBF = require("./GBF.js");
var CLI = require("./CLI.js");
var scr = new Screen("mainCanvas");
var Obj = require("./Object.js");
var Square = require("./Square.js");
var consoleCommands = require("./ConsoleCommands.js")();

var cli = new CLI("console", consoleCommands);
window.onkeyup = async function (event) {
    if (event.key == "Enter") {
        var prefix = document.getElementById("consolePrefix")
        var cons = document.getElementById("console");
        if (cli.executeCommand(cons.value, cons)){
            prefix.innerHTML = '>';
        }
        else{
            prefix.innerHTML = 'X';
        }
    }
}

class ImgCanvas extends Obj{
    constructor(obj, canvasId, stat) {
        super(obj);
        this.canvas = document.createElement("canvas", );
        this.canvas.id = canvasId;
        this.canvas.width = 100;
        this.canvas.height = 100;
        this.picStat = (stat == "") ? null : document.getElementById(stat);
        this.context = this.canvas.getContext('2d');
        var cv = this.canvas;
    }

    clear(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    draw(ctx){
        ctx.drawImage(this.canvas, this.anchor.x-this.offset.x, this.anchor.y-this.offset.y);
    }

    isClicked(x, y){
        var px = this.anchor.x - this.offset.x;
        var py = this.anchor.y - this.offset.y;
        if (x >= px &&
            x <= px + this.canvas.width &&
            y >= py &&
            y <= py + this.canvas.height)
        {
            console.log("hi");
            return true;
        }
        return false;
    }
}


var sq = new Square({name:"sq", tags:{}, anchor:{x:10,y:10}, zlevel:0, w:100, h:100, offset:{x:50,y:50}});
var sq2 = new Square({name:"sq2", tags:{}, anchor:{x:50,y:50}, zlevel:0, w:100, h:100, offset:{x:50,y:50}});
let imgCanvas = new ImgCanvas({name:"img", tags:{}, anchor:{x:50,y:50}, offset:{x:0, y:0}}, "picCanvas", "picStat");
events.emit('addObject', sq2);
events.emit('addObject', sq);
events.emit('addObject', imgCanvas);

events.on('generateImage', Gimg2);
events.on('loadImage', Limg);
events.on('save', () =>{image.save();});

var image;
async function Gimg2(source, thresh = 100) {
    image = new GBF();
    await image.generate(source, thresh);
    imgCanvas.context.putImageData(image.outlineImg, 0, 0);
}

//Searches an image starting at the current directory. May fail
async function Limg(path){
    imgCanvas.clear();
    var image = new GBF(path);
    image.animate(scr.context, imgCanvas);
}
