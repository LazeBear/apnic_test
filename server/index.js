const express = require('express');
const fs = require('fs');
const path = require('path');
const PromiseFtp = require('promise-ftp');
const db = require('./db');
const lineReader = require('line-reader');

const app = express();
const ftp = new PromiseFtp();

let processingData = false;

db.connect();

// host the angular file
app.use(express.static(path.join(__dirname, '/public')));
app.get('/graph', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

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

    if (processingData) {
        console.log('reject request, data processing');
        res.status(404).send('Server is processing data, please wait a couple minutes and try again!');
    } else {
        next();
    }
});

// db.deleteAll('data');
// check if the data already exist in the database
db.checkDataExist('data').then((res) => {
    if (res) {
        console.log("data has already been imported");
    } else {
        downloadFile();
    }
}).catch(err => {
    console.error(err);
})


function importData() {
    var commented = false;
    var numOfRecord = 0;
    console.log('importing data to database');
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
                if (numOfRecord++ % 1000 === 0) {
                    console.log('importing progress: ' + numOfRecord);
                }

                if (last) {
                    console.log(`importing finished, ${numOfRecord} inserted`);
                    processingData = false;
                    return false; // stop reading
                }
            }).catch(err => { console.error(err) });
        });
    }).catch(err => {
        console.error(err);
    })
}

function downloadFile() {
    //ftp://ftp.apnic.net/public/apnic/stats/apnic/delegated-apnic-latest
    const host = 'ftp.apnic.net';
    processingData = true;
    ftp.connect({ host: host })
        .then(function (serverMessage) {
            console.log("downloading file");
            return ftp.get('/public/apnic/stats/apnic/delegated-apnic-latest');
        }).then(function (stream) {
            return new Promise(function (resolve, reject) {
                stream.once('close', resolve);
                stream.once('error', reject);
                stream.pipe(fs.createWriteStream('file.local-copy'));
            });
        }).then(function () {
            console.log("download finished");
            ftp.end();
            importData();
        });
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

app.listen(4201);
