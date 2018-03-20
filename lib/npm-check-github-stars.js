'use strict';

require('colors');
const fs = require('fs');
const path = require('path');
const npmToGitHub = require('npm-to-github');
const output = require('./output');

const rootPath = process.cwd();
const target = process.argv.slice(2)[0];
const packagePath = target ? path.resolve(target) : path.join(rootPath, 'package.json');
if (!fs.existsSync(packagePath)) {
    console.error('Sorry, no package.json found at %s', packagePath);
    process.exit(1);
}

const packageFile = require(packagePath);
const dependencies = Object.keys(packageFile.dependencies || {});
const devDependencies = Object.keys(packageFile.devDependencies || {});
const allDependencies = dependencies.concat(devDependencies);

const promises = [];
for (const dependencie of allDependencies) {
    promises.push(repositoryToStargazersPromise(dependencie));
}

Promise.all(promises)
.then((values) => {
    output.print(allDependencies, values);
});

function repositoryToStargazersPromise(dependencie) {
    return new Promise((resolve, reject) => {
        npmToGitHub.getRepository(dependencie)
        .then((data) => {
            resolve(data.stargazers_count);
        })
        .catch((error) => {
            resolve(error);
        });
    });
}
