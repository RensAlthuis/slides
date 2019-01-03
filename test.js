var Screen = require("./Screen.js");
var GBF = require("./GBF.js");

var CLI = require("./CLI.js");
var scr = new Screen("mainCanvas");



var consoleCommands = require("./ConsoleCommands.js")();
var cli = new CLI("console", consoleCommands);
window.onkeyup = async function (event) {
    var key = event.key;
    if (key == "Enter") {
        var cons = document.getElementById("console");
        cli.executeCommand(cons.value, cons);
    }
}

class ImgCanvas{
    constructor(canvasId, stat) {
        this.canvas = document.getElementById(canvasId);
        this.picStat = (stat == "") ? null : document.getElementById(stat);
        this.context = this.canvas.getContext('2d');
    }

    clear(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
let imgCanvas = new ImgCanvas("picCanvas", "picStat");

events.on('generateImage', Gimg2);
events.on('loadImage', Limg);
var image;

events.on('save', () =>{image.save();});

async function Gimg2(source, thresh = 100) {
    //TODO: you were moving this function to GBF
    //TODO: next step is to finish a the save function

    image = new GBF();
    await image.generate(source, thresh);

    console.log('done');
    imgCanvas.context.putImageData(image.outlineImg, 0, 0);
}



//Searches an image starting at the current directory. May fail
async function Limg(path){
    imgCanvas.clear();
    var image = new GBF(path);
    image.animate(imgCanvas);
}