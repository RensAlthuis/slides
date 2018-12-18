
/*
    var newImg = document.createElement('img');
    newImg.src = './input.png';

    newImg.onload = function(){
    scr.context.drawImage(newImg,10,10);
    let imageData = scr.context.getImageDta(0,0,300,150);
    }*/

const Square = require("./square.js");
var sq = new Square();
events.emit('addObject', sq);


function mousedown(ev){
    console.log(sq.isClicked(ev.clientX, ev.clientY));
}