const url = require('url');
const http = require('http');
const fs = require('fs');
const Constant = require('../util/constant');

module.exports = class Reader {

    static start() {
        let toi = Constant.URL;
        let fileToSave = `${new Date().getTime()}.file`;
        let writeStream = fs.createWriteStream(fileToSave);
        let request = http.get(toi, (response) => {
            // Saves the URL content into a file
            response.pipe(writeStream);
        });
    }
}