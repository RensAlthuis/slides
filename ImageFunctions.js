// return true if pixel has a black pixel as neighbour
function hasBNeighbour(img, index) {
    var arr = img.data;    
    if (index - 4 >= 0 && arr[index - 4] == 0)
        return true;
    else if (index + 4 < arr.length && arr[index + 4] == 0)
        return true;
    else if (index - img.width * 4 >= 0 && arr[index - img.width * 4] == 0)
        return true;
    else if (index + img.width * 4 < arr.length && arr[index + img.width * 4] == 0)
        return true;

    return false;
}

// return a list of white pixels 
function getWhitePixels(img) {
    var result = [];
    for (var i = 0; i < img.data.length; i += 4) {
        if (img.data[i] == 255)
            result.push({ x: (i / 4) % img.width, y: ~~((i / 4) / img.width) });
    }
    return result;
}

// check if list containts element
function contains(list, elem) {
    if (elem == null) return null;

    for (var i = 0; i < list.length; i++) {
        if (JSON.stringify(list[i]) == JSON.stringify(elem)) return i;
    }
    return null;
};

// if pixel is white return {x,y} coordinate.
// else return null
function getWhitePixel(img, x, y) {
    var index = x * 4 + y * img.width* 4;
    if (index < 0 || index >= img.data.length) {
        console.log(img.data[index]);
        return null;
    }

    if (img.data[index] == 255) {
        return { x: x, y: y };
    }
    return null;
};

// find a single outline neighbour and add it to the outline array.
function searchNeighbour(i, whitePixels, img, outline, xoff, yoff) {
    var num = getWhitePixel(img, outline[i].x + xoff, outline[i].y + yoff);
    var n = contains(whitePixels, num);
    if (n == null) return;
    outline.push(num);
    whitePixels[n] = null;
};

// find a single outline, in the source image, starting frm startelem.
function findOutline(whitePixels, img, startElem) {
    var outline = [startElem];
    for (var i = 0; i < outline.length; i++) {
        searchNeighbour(i, whitePixels, img, outline, -1, -1);
        searchNeighbour(i, whitePixels, img, outline, -1, +1);
        searchNeighbour(i, whitePixels, img, outline, -1, 0);
        searchNeighbour(i, whitePixels, img, outline, 0, -1);
        searchNeighbour(i, whitePixels, img, outline, 0, +1);
        searchNeighbour(i, whitePixels, img, outline, +1, -1);
        searchNeighbour(i, whitePixels, img, outline, +1, +1);
        searchNeighbour(i, whitePixels, img, outline, +1, 0);
    }
    return outline;
}

module.exports = function () {
    var module = {}

    module.toBlackWhite = function (original, width, height, thresh) {
        var white = false;
        var result = [];
        for (var i = 0; i < original.data.length; i += 4) {
            white = !(original.data[i] < thresh && original.data[i + 1] < thresh && original.data[i + 2] < thresh) || (original.data[i + 3] <= 100);
            result[i + 0] = white ? 255 : 0;
            result[i + 1] = white ? 255 : 0;
            result[i + 2] = white ? 255 : 0;
            result[i + 3] = white ? 255 : 0;
        }

        var bwImage = new ImageData(Uint8ClampedArray.from(result), width, height);
        return bwImage;
    }
    module.toOutlineImage = function (bwImage) {
        var result = [];
        //If I'm a white pixel and I have a black neighbour(perfect joke setup right there)
        //Im part of the outline. 
        for (var x = 0; x < bwImage.data.length; x += 4) {
            var outline = (bwImage.data[x] == 255) && hasBNeighbour(bwImage, x);
            result[x] = outline ? 255 : 0;
            result[x + 1] = outline ? 255 : 0;
            result[x + 2] = outline ? 255 : 0;
            result[x + 3] = outline ? 255 : 0;
        }
        var outlineImage = new ImageData(Uint8ClampedArray.from(result), bwImage.width, bwImage.height);
        return outlineImage;
    }

    module.getOutlinesFromImage = function (outlineImage) {
        var outlines = [];
        var totalOutlineEntries = 0; //Keeps track of all outline entries
        var whitePixels = getWhitePixels(outlineImage); //Changes pixels to a dictionary with coordinates instead

        while (whitePixels.length > 0) {
            var startE = whitePixels.pop();
            if (startE != null) {
                var actualOutline = findOutline(whitePixels, outlineImage, startE);
                totalOutlineEntries += actualOutline.length;
                outlines.push(actualOutline);
            }
        }

        return { outlines: outlines, outCount: totalOutlineEntries };
    }

    return module;
};