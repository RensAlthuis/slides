// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

class Screen{

    constructor(screenName){
        //variables
        this.anchors = [];
        this.canvas = document.getElementById(screenName);
        this.context = this.canvas.getContext('2d');
        this.gridSize = {"width":2, "height":2};
        this.objects = [];

        //bindings
        this.onResize = this.onResize.bind(this);
        this.drawCanvas = this.drawCanvas.bind(this);
        this.addObject = this.addObject.bind(this);

        //listeners

        window.addEventListener('resize', this.onResize);
        //window.addEventListener("mousedown", mousedown);

        events.on('addObject', this.addObject);

        //this.onResize();

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
        this.anchors.forEach(f);
    }

    mouseClicked(ev){

    }
}

scr = new Screen("myCanvas");
img = new Screen("picCanvas");