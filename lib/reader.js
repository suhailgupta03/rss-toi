const url = require('url');
const http = require('http');
const fs = require('fs');
const parseString = require('xml2js').parseString;
const Constant = require('../util/constant');
const request = require('request');
const path = require('path');
const SQL = require('./sql');

global.Promise = require('bluebird');

module.exports = class Reader {

	/**
	 * Init function
	 */
    static start() {
        let toi = Constant.URL;
        let fileToSave = `${new Date().getTime()}.file`;
        let writeStream = fs.createWriteStream(fileToSave);
        let data ='';
        let request = http.get(toi, (response) => {

        	response.on('data', (_data) => {
        		data += _data.toString();
        	})

        	response.on('end', () => {

        		return Promise.coroutine(function* () {
        			try {
        				let xmlObj = yield Reader.parseXml(data);
	        			let srcList = Reader.getImageSrc(xmlObj);
	        			let downloaded = yield Reader.downloadImages(srcList);
	        			yield SQL.insert('rss',['data'], JSON.stringify(xmlObj));
        			}catch(err) {console.log(err)}
        			

        		})()
        		.then(r => console.log('All done!!'))
        		.catch(e => console.log(e));
        	});

            // Saves the URL content into a file
            response.pipe(writeStream);
        });
    }

    /**
     * Parses XML and returns the javascript object
     */
    static parseXml(xml) {
    	return new Promise((resolve, reject) => {
    		parseString(xml, function (err, result) {
    			if(result)
    				resolve(result);
    			else
    				reject(err);
			});
    	})
    }

    /**
     * Accumulates all the image url(s) used later 
     * to download files
     */
    static getImageSrc(xmlObj) {

    	let channelList = xmlObj['rss']['channel'];
    	let srcList = [];
    	for(let channel of channelList) {
    		let itemList = channel['item'];
    		let regex = /<img.*?src="(.*?)"/;
    		for(let item of itemList) {
    			let {description} = item;
    			if(description[0]){ 
	    			srcList.push(description[0].match(/<img.*?src="(.*?)"/)[1]);
    			}
    		}
    		let imageList = channel['image'];
    		for(let image of imageList) {
    			let {url} = image;
    			if(url[0])
    				srcList.push(url[0]);
    		}
    	}
    	return srcList;
    }

    /**
     * Downloads the images and stores inside the 'images' directory
     */
    static downloadImages(srcList) {

    	return Promise.map(srcList, src => new Promise((resolve, reject) => {
    			let imgPath = path.join(__dirname, `../images/${new Date().getTime()}.img`);
			    request(src).on('error', reject).pipe(fs.createWriteStream(imgPath)).on('finish', () => {
			        resolve();
			    });
			}), {
			    concurrency: Math.floor(srcList.length/2)
			}).then(() => {
			    return true;
			}).catch(err => {
			    console.error('Failed: ' + err.message);
			    return false;
			});
    }
}