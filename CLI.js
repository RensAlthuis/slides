
module.exports = class CLI{
    constructor(id, commands){
        this.commands = commands;

    }

    executeCommand(inputstring, target){
        var words = inputstring.split(" ");
        var input = words[0];
        var args = words.slice(1);

        if (input in this.commands)
            this.commands[input](target, args);
        else
            console.log("Unrecognized command");
    }
}