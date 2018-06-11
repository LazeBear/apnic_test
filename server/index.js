const express = require('express');
const fs = require('fs');
const PromiseFtp = require('promise-ftp');
const db = require('./db');
db.connect();

var app = express();
var ftp = new PromiseFtp();

// middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const now = new Date().toString();
    const log = `${now}: ${req.method} | ${req.url}`;
    console.log(log);

    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});


var lineReader = require('line-reader');
var commented = false;
var numOfRecord = 0;
// db.deleteAll('data');
// importData();
db.checkDataExist('data').then((res) => {
    if (res) {
        console.log("data has already been imported");
    } else {
        importData();
    }
}).catch(err => {
    console.error(err);
})

// var countDeleteMe = 0;
function importData() {
    db.deleteAll('data').then(() => {
        lineReader.eachLine('file.local-copy', (line, last) => {
            if (!line) {
                return;
            }
            // ignore comment line
            if (line[0] === '#') {
                commented = true;
                return;
            }
            // ignore the file header for now
            if (commented) {
                commented = false;
                return;
            }
            arr = line.split('|');
            // ignore summary data
            if (arr[arr.length - 1] === 'summary') {
                return;
            }

            // conver the array to an object
            obj = parseArrayToObject(arr);

            // insert data to db
            db.insert('data', obj).then(() => {
                numOfRecord++;
                // console.log(line);

                if (last) {
                    console.log(`finished reading, ${numOfRecord} inserted`);
                    return false; // stop reading
                }
            }).catch(err => { console.error(err) });
        });
    }).catch(err => {
        console.error(err);
    })
}


function parseArrayToObject(arr) {
    let obj = {};
    arr.forEach((i, index) => {
        switch (index) {
            case 0: // registry
                obj['registry'] = i;
                break;
            case 1: // cc
                obj['cc'] = i;
                break;
            case 2: // type
                obj['type'] = i;
                break;
            case 3: // start
                obj['start'] = i;
                break;
            case 4: // value
                obj['value'] = i;
                break;
            case 5: // date
                obj['date'] = i;
                break;
            case 6: // status
                obj['status'] = i;
                break;
            case 7: // opaque-id
                obj['opaque-id'] = i;
                break;
            case 8: // extensions
                obj['extensions'] = i;
                break;
            default:
                console.error('invalid record');
        }
    });
    return obj;
}
// var Client = require('ftp');

// var c = new Client();
// c.on('ready', function () {
//     c.get('foo.txt', function (err, stream) {
//         if (err) throw err;
//         stream.once('close', function () { c.end(); });
//         stream.pipe(fs.createWriteStream('foo.local-copy.txt'));
//     });
// });
// // connect to localhost:21 as anonymous
// c.connect({ host: 'ftp.apnic.net' });

// try download the file 
//ftp://ftp.apnic.net/public/apnic/stats/apnic/delegated-apnic-latest
const host = 'ftp.apnic.net';
// ftp.connect({ host: host })
//     .then(function (serverMessage) {
//         console.log("hello");
//         return ftp.get('/public/apnic/stats/apnic/delegated-apnic-latest');
//     }).then(function (stream) {
//         return new Promise(function (resolve, reject) {
//             stream.once('close', resolve);
//             stream.once('error', reject);
//             stream.pipe(fs.createWriteStream('file.local-copy'));
//         });
//     }).then(function () {
//         return ftp.end();
//     });


// controllers
// app.get('/api/asn/2016/:cc', (req, res) => {
//     const cc = req.params.cc;
//     if (!cc) {
//         res.sendStatus(404);
//     }
//     db.selectWithCondition('data', `cc='${cc}' AND year(date)='2016'`).then(result => {
//         // console.log(result);
//         queryRes = result[0];
//         obj = { 'Economy': cc, 'Resource': 'ASN', 'Year': 2016, ...queryRes };
//         res.send(obj);
//     }).catch(err => {
//         res.send(err);
//     })
// });

app.get('/api/asn/:year/:cc', (req, res) => {
    const cc = req.params.cc;
    const year = req.params.year;
    if (!cc || !year) {
        res.sendStatus(404);
    }
    db.getSumWithCountryAndYear('data', cc, year).then(result => {
        let obj = {};
        // check if single country or all contry
        if (cc === 'ALL') {
            // console.log(result);
            obj = result.map(i => {
                return { ...i, 'Resource': 'ASN', 'Year': year };
            })
        } else {
            queryRes = result[0];
            if (!queryRes['Total']) {
                res.status(404).send(`There is no result with country ${cc} and year ${year}!`);
                return;
            }
            obj = { 'Economy': cc, 'Resource': 'ASN', 'Year': year, ...queryRes };
        }
        res.send(obj);
    }).catch(err => {
        console.error(err);
        res.send(err);
    })
});

app.get('/api/years', (req, res) => {
    db.selectDistinct('data', 'year(date)').then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err);
    })
});

app.get('/api/countries', (req, res) => {
    db.selectDistinct('data', 'cc').then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err);
    })
});
// // create a new quality file
// app.post('/qualityFile/:key/:name', (req, res) => {
//     // const key = req.param('key');
//     const key = environment.test.qualityFileKey;
//     const name = req.params.name;
//     request.post(`/qualityprofiles/copy?fromKey=${key}&toName=${name}`, res);
// })

// // delete a quality file
// app.delete('/qualityFile/:key', (req, res) => {
//     const key = req.params.key;
//     request.deleteQF(`/qualityprofiles/delete?profile=${key}`).then((response) => {
//         res.send(JSON.parse(response.body));
//     }).catch((err) => {
//         if (err.body === undefined) {
//             res.sendStatus(200);
//         } else {
//             res.send(err.body);
//         }
//     })
// })

app.listen(4201);
