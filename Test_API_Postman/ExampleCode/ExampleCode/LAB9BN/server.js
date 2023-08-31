const express = require('express')
const app = express()
const cors = require('cors')
const port = 3001
const mysql = require('mysql2')

app.use(cors())
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "64107899",
    database: "user_db"
})

db.connect((err) => {
    if (err) { err }
    console.log("MySQL connected")
})

app.get('/', (req, res) => {
    res.send('Hello Backend ')
})

app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`)
})

app.get('/getUsers', (req, res) => {
    let message = "";
    db.query("SELECT * FROM users", (error, results, fields) => {
        if (error)
            console.log(error);
        if (results.length == 0 || results === undefined)
            message = "Table users is empty !";
        else
            message = "Get users succesfuly.";
        res.status(200).send({ error: false, data: results, msg: message })
    })
})

app.post('/getUserByID', (req, res) => {
    let object = req.body;
    console.log(object);
    db.query(
        'SELECT * FROM users WHERE userID = ?', [object.userID],
        function(err, results) {
            if (err)
                console.log(err);

            if (results.length == 0 || results === undefined) {
                message = "Selected";
            } else {
                message = "Not have user";
            }
            res.status(200).send({ error: false, data: results, msg: message });
        }
    );
})

app.post('/checkUsername', (req, res) => {
    let object = req.body;
    db.query(
        'SELECT * FROM users WHERE username = ?', [object.username],
        function(err, results) {
            if (err)
                console.log(err);

            console.log(results);
            if (results.length == 0 || results === undefined) {
                message = "CanUse";
            } else {
                message = "CannotUse";
            }
            res.status(200).send({ error: false, data: req.body, msg: message });
        }
    );
})

app.post('/newuser', (req, res) => {
    let object = req.body;
    db.query(
        'INSERT INTO users (userID, username, password, fname, lname, authority, activeflag) VALUES (?,?,?,?,?,?,?)', [null,
            object.username,
            object.password,
            object.firstname,
            object.lastname,
            object.authority,
            1
        ],
        function(err, results) {
            if (err)
                console.log(err);

            // console.log(results);
            if (results) {
                message = "inserted";
            } else {
                message = "CannotInsert";
            }
            res.status(200).send({ error: false, data: results, msg: message });
        }
    );
})

app.put('/updateuser', (req, res) => {
    let object = req.body;
    db.query(
        'UPDATE users SET fname=?, lname=?, authority=?, activeflag=? WHERE userID = ? ', [
            object.firstname,
            object.lastname,
            object.authority,
            object.activeflag,
            object.userID
        ],
        function(err, results) {
            if (err)
                console.log(err);

            if (results) {
                message = "updated";
            } else {
                message = "CannotUpdate";
            }
            res.status(200).send({ error: false, data: results, msg: message });
        }
    );
})

app.delete('/deleteuser', (req, res) => {
    let object = req.body;
    db.query(
        'DELETE FROM users WHERE userID = ? ', [
            object.userID
        ],
        function(err, results) {
            if (err)
                console.log(err);

            if (results) {
                message = "Deleted";
            } else {
                message = "CannotDeleted";
            }
            res.status(200).send({ error: false, data: results, msg: message });
        }
    );
})