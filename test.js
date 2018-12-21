
/*
    var newImg = document.createElement('img');
    newImg.src = './input.png';

    newImg.onload = function(){
    scr.context.drawImage(newImg,10,10);
    let imageData = scr.context.getImageDta(0,0,300,150);
    }*/

const Square = require("./square.js");

var sq = new Square({name:"sq", tags:{}, anchor:{x:10,y:10}, zlevel:0, w:100, h:100, offset:{x:50,y:50}});
sq.zlevel = 0;

/*pos, name, tags, achor, zlevel*/
var sq2 = new Square({name:"sq2", tags:{}, anchor:{x:50,y:50}, zlevel:0, w:100, h:100, offset:{x:50,y:50}});
sq2.zlevel = 1;

events.emit('addObject', sq2);
events.emit('addObject', sq);