'use strict';

const fs = require('fs');
const path = require('path');
const npmToGitHub = require('npm-to-github');

const rootPath = process.cwd();
const target = process.argv.slice(2)[0];
const packagePath = target ? path.resolve(target) : path.join(rootPath, 'package.json');
if (!fs.existsSync(packagePath)) {
    console.error('Sorry, no package.json found at %s', packagePath);
    process.exit(1);
}
const packageFile = require(packagePath);
const dependencies = packageFile.dependencies || {};
const devDependencies = packageFile.devDependencies || {};

checkDependencies(dependencies);
checkDependencies(devDependencies);

function checkDependencies(dependencies) {
    for (const dependencie in dependencies) {
        npmToGitHub.getRepository(dependencie)
        .then((data) => {
            console.log(dependencie, data.stargazers_count);
        })
        .catch((error) => {
            console.log(dependencie, error);
        });
    }
}
