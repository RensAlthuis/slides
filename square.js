require("./object.js");

module.exports = class Square extends Object{
    constructor(x=0, y=0, w=100, h=100){
        super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    moveTo(){
        console.log("SQUARE");
    }

    draw(ctx){
        ctx.strokeStyle = '#FFFFFF';
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.stroke();
    }

    isClicked(x, y){
        if (x >= this.x &&
            x <= this.x + this.w &&
            y >= this.y &&
            y <= this.y + this.h)
        {
            return true;
        }
        return false;
    }
}
