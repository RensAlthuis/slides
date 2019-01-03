module.exports = function (){
    return {
    "gimg":function gimg(cli, args){
        if(!(args.length == 1 || args.length == 2))
        {
            console.log("Incorrect argument count "+args.length);
            return false;
        }

        events.emit('generateImage', ...args);
        return true;
    },

    "limg":function limg(cli, args){
        if(args.length == 1)
        {
            events.emit('loadImage', ...args);
            return true;
        }

        console.log("Incorrect argument count "+args.length);
        return false;
    },

    "help":function help(cli, args){
        if(args.length == 1)
        {
            switch(args[0]){
                case "limg":
                    cli.value="Read .gbf at arg0"
                break;

                case "gimg":
                    cli.value="Generate image from arg0[, bw contrast arg1(0-255)]"
                break;

                case "help":
                    cli.value="Shows info about arg0"
                break;
            }
            return true;
        }

        console.log("Incorrect argument count "+args.length);
        return false;
    },

    "save":function help(cli, args){
        events.emit("save", ...args)
        return true;
    }
    };
};