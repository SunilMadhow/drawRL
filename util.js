function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function normalize(f) {
    pos = (f[0] + 1.2) / (1.8); // pos \in [-1.2, .6]
    vel = (f[1] + .7) / (1.4); //vel \in [-.7, .7]
    return [pos, vel];

}

function dot(a, b) {
    r = 0;
    for (let i = 0; i < a.length; i ++) {
        r += a[i]*b[i]
    }
    return r;
}

function argmax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function scalarMult(k, a) {
    for (let i = 0; i < a.length; i ++) {
        a[i] = k*a[i];
    }
    return a;
}

function vectorSum(a, b) {
    c = []
    for (let i = 0; i < a.length; i ++) {
        c[i] = a[i] + b[i];
    }
    return c;
}