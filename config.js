const mongoose = require('mongoose');
const CONSTANTS = require('./constants');

mongoose.connect(CONSTANTS.URL);