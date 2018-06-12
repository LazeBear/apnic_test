const mysql = require('mysql');
let db = null;

module.exports = {
    connect: () => {
        return new Promise((res, rej) => {
            db = mysql.createConnection({
                host: 'db',
                user: 'apnic',
                password: 'apnic',
                database: 'apnic'
            });
            console.log('waiting for db connection ...');
            db.connect((err) => {
                if (err) rej(err);
                res();
            });
        });
    },

    insert: (tableName, obj) => {
        return new Promise((res, rej) => {
            if (db == null) {
                console.error('db is null');
            }
            var query = db.query(`INSERT INTO ${tableName} SET ?`, obj, (err, result) => {
                if (err) {
                    rej(err);
                }
                res();
            });
        });
    },

    checkDataExist: (tableName) => {
        return new Promise((res, rej) => {

            db.query(`SELECT * FROM ${tableName} LIMIT 1`, (err, result) => {
                if (err) {
                    rej(err);
                };
                if (result.length === 1) {
                    res(true);
                } else {
                    res(false);
                }
            });
        });
    },

    getSumWithCountryAndYear: (tableName, country, year) => {
        let queryString = `SELECT SUM(value) as Total FROM ${tableName} 
        WHERE cc='${country}' AND year(date)='${year}' AND type='asn'`;
        if (country === 'ALL') {
            queryString = `SELECT SUM(value) as Total, cc as Economy FROM ${tableName} 
            WHERE year(date)='${year}' AND type='asn' GROUP BY cc`;
        }
        return new Promise((res, rej) => {
            var query = db.query(queryString, (err, result) => {
                if (err) {
                    rej(err);
                };
                // console.log(result);
                res(result);
            });
            // console.log(query.sql);
        });
    },

    selectDistinct: (tableName, columnName) => {
        return new Promise((res, rej) => {
            var query = db.query(`SELECT distinct(${columnName}) FROM ${tableName} ORDER BY ${columnName}`, (err, result) => {
                if (err) {
                    rej(err);
                };
                // console.log(result);
                res(result);
            });
            // console.log(query.sql);
        });
    },

    deleteAll: (tableName) => {
        return new Promise((res, rej) => {
            db.query(`DELETE FROM ${tableName}`, function (err, result) {
                if (err) {
                    rej(err);
                };
                // console.log(result);
                res(result);
            });
        });
    }
}