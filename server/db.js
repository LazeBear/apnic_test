const mysql = require('mysql');
let db = null;

module.exports = {
    connect: () => {
        db = mysql.createConnection({
            host: 'localhost',
            user: 'apnic',
            password: 'apnic',
            database: 'apnic'
        });
        console.log('db inited');
        db.connect((err) => {
            if (err) throw err;
            console.log('db connected');
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
    }

    // update: (tableName, obj, key) => {
    //     return new Promise((res, rej) => {
    //         if (db == null) {
    //             throw 'db is null';
    //         }
    //         var query = db.query(`UPDATE ${tableName} SET ? WHERE ${key}`, obj, function (err, result) {
    //             if (err) throw err;
    //             console.log("1 record updated");
    //             res();
    //         });
    //         console.log(query.sql);
    //     });
    // },

    // selectAll: (tableName) => {
    //     return new Promise((res, rej) => {

    //         db.query(`SELECT * FROM ${tableName}`, function (err, result, fields) {
    //             if (err) {
    //                 rej(err);
    //             };
    //             res(result);
    //         });
    //     });
    // },

    // selectOne: (tableName, key) => {
    //     return new Promise((res, rej) => {
    //         db.query(`SELECT * FROM ${tableName} WHERE ID='${key}'`, function (err, result, fields) {
    //             if (err) {
    //                 rej(err);
    //             };
    //             res(result);
    //         });
    //     });
    // },

    // delete: (tableName, key) => {
    //     db.query(`DELETE FROM ${tableName} WHERE ID='${key}'`, function (err, result) {
    //         if (err) {
    //             throw err;
    //         };
    //     });
    // },

    // deleteAll: (tableName) => {
    //     return new Promise((res, rej) => {
    //         db.query(`DELETE FROM ${tableName}`, function (err, result) {
    //             if (err) {
    //                 rej(err);
    //             };
    //             console.log(result);
    //             res(result);
    //         });
    //     });
    // },

    // customQuery: (query) => {
    //     return new Promise((res, rej) => {
    //         db.query(query, function (err, result, fields) {
    //             if (err) {
    //                 rej(err);
    //             };
    //             res(result);
    //         });
    //     });
    // },

}