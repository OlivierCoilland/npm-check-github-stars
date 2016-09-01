'use strict';

function print(dependencies, values) {
    const maxLength = computeMaxLength(dependencies);
    const padding = Math.max(20, maxLength + 10);

    for (const index in dependencies) {
        const dependencie = dependencies[index];
        const stars = values[index].toLocaleString();
        const line = pad(dependencie, padding) + stars;
        console.log(line);
    }
}

function computeMaxLength(array) {
    const lengths = array.map((el) => {
        return el.length;
    });
    return Math.max.apply(null, lengths);
}

function pad(label, length) {
    for (let i = 0; i < length; i++) {
        label += ' ';
    }
    return label.substr(0, length);
}

module.exports.print = print;
