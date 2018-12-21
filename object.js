
/*pos, name, tags, achor, zlevel*/
module.exports = class Obj{
    constructor(args)
    {
        this.offset = args.offset;
        this.name = args.name;
        this.tags = args.tags;
        this.anchor = args.anchor;
        this.zlevel = args.zlevel;
    }


    moveTo(mPos, mOffset, doSnapping=true){
        var targetx = mPos.x-mOffset.x;
        var targety = mPos.y-mOffset.y;
        if(doSnapping){
            scr.loopAnchors((anchor) =>{
                if(anchor == this.anchor){return;}
                if (Math.abs((mPos.x-mOffset.x) - (anchor.x)) < 20){
                    targetx = (anchor.x);
                }

                if (Math.abs((mPos.y-mOffset.y) - (anchor.y)) < 20){
                    targety = (anchor.y);
                }
            });
        }
        this.anchor.x = targetx;
        this.anchor.y = targety;
    }

    draw(ctx){throw new TypeError("Must override method");}
}