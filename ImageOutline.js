
function findOutline(whitePixels, orImage, startElem) {

    function searchNeighbour(orImage, outline, x, y) {
        var num = getWhitePixel(orImage, outline[i].x + x, outline[i].y + y);
        var n = contains(whitePixels, num);
        if (n != null) {
            outline.push(num);
            //console.log("pushing value at x "+num.x+" y "+num.y);
            whitePixels[n] = null;
        }
    };

    function contains(list, elem) {
        if (elem == null) return null;

        for (var i = 0; i < list.length; i++) {
            if (JSON.stringify(list[i]) == JSON.stringify(elem)) return i;
        }
        return null;
    };


    function getWhitePixel(orImage, x, y) {
        var index = (x * 4 + y * WIDTH * 4);
        if (index < 0 || index >= orImage.length)
            return null;

        var num = orImage[index];
        if (num == 255) {
            return { x: x, y: y };
        }
        return null;
    };

    var outline = [];
    outline.push(startElem);
    //console.log("first: "+outline[outline.length-1].x +","+outline[outline.length-1].y);
    var i;
    for (i = 0; i < outline.length; i++) {
        searchNeighbour(orImage, outline, -1, -1);
        searchNeighbour(orImage, outline, -1, +1);
        searchNeighbour(orImage, outline, -1, 0);
        searchNeighbour(orImage, outline, 0, -1);
        searchNeighbour(orImage, outline, 0, +1);
        searchNeighbour(orImage, outline, +1, -1);
        searchNeighbour(orImage, outline, +1, +1);
        searchNeighbour(orImage, outline, +1, 0);
    }
    //console.log("ended after iteration "+(i+1));
    return outline;
}

function getWhitePixels(orAr) {
    var newAr = [];
    for (var i = 0; i < orAr.length; i += 4) {
        if (orAr[i] == 255)
            newAr.push({ x: (i / 4) % WIDTH, y: ~~((i / 4) / WIDTH) });
    }
    return newAr;
}

function drawOutLineAnim(outline, target, fullimg, speed = 1) {
    if (!(outline.length > 0)) {
        img.context.putImageData(fullimg, 0, 0);
        window.clearInterval(animator);
        return;
    }

    var tar = {};
    for (var i = 0; i < speed; i++) {
        tar = outline.pop();
        target.data[tar.x * 4 + WIDTH * 4 * tar.y + 0] = 0;
        target.data[tar.x * 4 + WIDTH * 4 * tar.y + 1] = 0;
        target.data[tar.x * 4 + WIDTH * 4 * tar.y + 2] = 0;
        target.data[tar.x * 4 + WIDTH * 4 * tar.y + 3] = 255;
        animIndex++;
    }
    //Now draws pixel by pixel, and from top to bottom
    img.context.putImageData(target, 0, 0, 0, 0, WIDTH, animIndex);

}