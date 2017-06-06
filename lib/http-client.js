const http = require('http');

module.exports = class HttpClient {

    static request(urlObject, action = 'GET', saveResponse=true) {
        if ('object' === typeof urlObject) {
            const options = {
                hostname: urlObject.hostname,
                port: 80,
                path: urlObject.pathname,
                method: action
            };

            const req = http.request(options, (res) => {
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    if(saveResponse) {
                        
                    }
                });

                res.on('end', () => {

                });
            });

            req.on('error', (e) => {
                console.log(e);
            });
        }
    }
}