
/*
    var newImg = document.createElement('img');
    newImg.src = './input.png';

    newImg.onload = function(){
    scr.context.drawImage(newImg,10,10);
    let imageData = scr.context.getImageDta(0,0,300,150);
    }*/

const Square = require("./square.js");

var sq = new Square();
sq.zlevel = 0;

var sq2 = new Square(x=10, y=10);
sq2.zlevel = 1;

events.emit('addObject', sq2);
events.emit('addObject', sq);