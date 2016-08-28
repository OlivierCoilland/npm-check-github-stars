#!/usr/bin/env node

'use strict';

const LOG_LEVEL = 'warn';
const GITHUB_REPOSITORY_RE = /github\.com\/(.*?)(\.git)?$/;

const log = require('npmlog');
log.level = LOG_LEVEL;
const fs = require('fs');
const path = require('path');
const github = require('octonode');
const githubClient = github.client();
const RegClient = require('npm-registry-client');
const npmClient = new RegClient({
    log: log
});

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
        checkDependencie(dependencie);
    }
}

function checkDependencie(dependencie) {
    npmClient.get('https://registry.npmjs.org/' + dependencie, {}, (error, data) => {
        const repository = data.repository;
        if (!repository) {
            console.log(dependencie, 'No repository found');
            return;
        }

        const repositoryUrl = repository.url;
        const matches = repositoryUrl.match(GITHUB_REPOSITORY_RE);
        if (!matches) {
            console.log(dependencie, 'No GitHub repository found in', repositoryUrl);
            return;
        }

        const githubRepository = matches[1];
        githubClient.repo(githubRepository).info((error, data) => {
            console.log(dependencie, data.stargazers_count);
        });
    });
}
