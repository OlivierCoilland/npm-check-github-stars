'use strict';

const output = require('../lib/output');

const dependencies = ['a', 'b', 'c', 'd', 'e', 'f'];
const values = [0, 1, 11, 101, 1001, 'a'];

output.print(dependencies, values);
