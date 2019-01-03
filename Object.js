module.exports = class Object{
    constructor(name = "new object",
                tags = {},
                anchor = {x:0, y:0})
    {
        this.name = name;
        this.tags = tags;
        this.anchor = anchor;
        this.zlevel = 0;
    }

    moveTo(x, y){ throw new TypeError("Must override method");}
    draw(ctx){throw new TypeError("Must override method");}
}