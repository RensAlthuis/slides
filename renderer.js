// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

class Screen{

    constructor(){
        //variables
        this.anchors = [];
        this.canvas = document.getElementById("myCanvas");
        this.context = this.canvas.getContext('2d');
        this.gridSize = {"width":2, "height":2};
        this.objects = [];
        this.curClickedObj = null;

        //bindings
        this.onResize = this.onResize.bind(this);
        this.drawCanvas = this.drawCanvas.bind(this);
        this.addObject = this.addObject.bind(this);
        this.mouseClicked = this.mouseClicked.bind(this);
        this.mouseDragged = this.mouseDragged.bind(this);

        //listeners
        window.addEventListener('resize', this.onResize);
        window.addEventListener("mousedown", this.mouseClicked);
        window.addEventListener("mousemove", this.mouseDragged);
        events.on('addObject', this.addObject);

        this.onResize();
    }

    addObject(obj){
        this.objects.push(obj);
        this.drawCanvas();
    }

    drawBackground(){
        this.context.fillStyle = '#000000';
        this.context.fillRect(0,0, window.innerWidth, window.innerHeight);
    };

    drawGrid(){
        var ctx = this.context;

        ctx.strokeStyle = '#FFFFFF';

        var dashLength = 10;
        ctx.setLineDash([dashLength]);
        for(var x = 1; x < this.gridSize.width; x++){
            if(x == this.gridSize.width/2)
                ctx.setLineDash([]);
            else
                ctx.setLineDash([dashLength]);

            ctx.beginPath();
            var delta = window.innerWidth/this.gridSize.width;
            ctx.moveTo(delta*x, 0);
            ctx.lineTo(delta*x, window.innerHeight);
            ctx.stroke();
        }

        for(var y = 1; y < this.gridSize.height; y++){
            if(y == this.gridSize.height/2)
                ctx.setLineDash([]);
            else
                ctx.setLineDash([dashLength]);
            ctx.beginPath();
            var delta = window.innerHeight/this.gridSize.height;
            ctx.moveTo(0, delta*y);
            ctx.lineTo(window.innerWidth, delta*y);
            ctx.stroke();
        }
        ctx.setLineDash([]);
    };

    drawObjects(){
        this.objects.forEach((obj) =>{
            obj.draw(this.context);
        });
    };

    drawCanvas(){
        this.drawBackground();
        this.drawGrid();
        this.drawObjects();
    };

    onResize(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.drawCanvas();
    };

    addanchor(x,y){
        this.anchors.push({'x':x,'y':y});
    }

    loopAnchors(f){

        //Object anchors
        this.objects.forEach((obj) => {
            f(obj.anchor);
        });

        //Grid anchors X
        for(var x = 1; x < this.gridSize.width; x++){
            var delta = window.innerWidth/this.gridSize.width;
            f({x:delta*x, y:0});
            f({x:delta*x, y:window.innerHeight});
        }

        //Grid anchors Y
        for(var y = 1; y < this.gridSize.height; y++){
            var delta = window.innerHeight/this.gridSize.height;
            f({x:0, y:delta*y});
            f({x:window.innerWidth, y:delta*y});
        }
    }

    mouseClicked(ev){
        this.curClickedObj = null;
        this.objects.forEach( (obj) =>{
            if(obj.isClicked(ev.clientX, ev.clientY) && this.curClickedObj == null ||
               obj.isClicked(ev.clientX, ev.clientY) && this.curClickedObj.zlevel < obj.zlevel)
                this.curClickedObj = {obj:obj, offset:{x:ev.clientX- obj.anchor.x, y:ev.clientY-obj.anchor.y}};
        });

    }

    mouseDragged(ev){
        //dragging only left button
        if (ev.buttons == 1){
            if(this.curClickedObj != null){
                this.curClickedObj.obj.moveTo({x:ev.clientX, y:ev.clientY}, this.curClickedObj.offset, !ev.shiftKey);
                this.drawCanvas();
            }
        }
    }
}

scr = new Screen();