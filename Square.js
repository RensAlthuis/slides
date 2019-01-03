var Obj = require("./Object.js");

module.exports = class Square extends Obj{
    constructor(args){
        super(args);
        this.w = args.w;
        this.h = args.h;
    }


    draw(ctx){
        var px = this.anchor.x - this.offset.x;
        var py = this.anchor.y - this.offset.y;
        ctx.strokeStyle = '#FFFFFF';
        ctx.rect(px, py, this.w, this.h);
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.anchor.x-2, this.anchor.y-2, 4, 4);
        ctx.stroke();

    }

    isClicked(x, y){
        var px = this.anchor.x - this.offset.x;
        var py = this.anchor.y - this.offset.y;
        if (x >= px &&
            x <= px + this.w &&
            y >= py &&
            y <= py + this.h)
        {
            return true;
        }
        return false;
    }
}
