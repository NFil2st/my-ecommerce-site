const express = require('express');
const router = express.Router();
const path = require('path');

const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, '..','data','contact.db');
const db = new sqlite3.Database(dbPath);


db.run('CREATE TABLE IF NOT EXISTS contact (id INTEGER PRIMARY KEY, fname TEXT, lname TEXT, email TEXT, subject TEXT, message TEXT,submittedAt DATE)')

router.post('/', (req , res)=>{
    const {fname,lname,email,subject,message} = req.body;

    db.run('INSERT INTO contact(fname, lname, email, subject, message, submittedAt) VALUES (?,?,?,?,?,?)',[fname,lname,email,subject,message,new Date()])

    console.log('Content form submited', {fname,lname,email,subject,message});
    res.status(200).json({status:"Message Recieved"});
});

router.get('/:action', (req,res) => {
    const {action} = req.params;

    switch (action){
        case 'all':
            var sql = 'SELECT * FROM contact ORDER BY submittedAt DESC';
            db.all(sql,[], (err, rows) => {
            if(err){
                return res.status(500).json({error: 'Fail to fetch contact from DataBase!!'})
            }
            res.json(rows);
        })
        break;
        case 'last':
            var sql = 'SELECT * FROM contact ORDER BY submittedAt DESC LIMIT 1';
            // var sql = 'SELECT * FROM contact WHERE submittedAt = (SELECT max(submittedAt) FROM contact)'; //ใช้อันนี้หรือบนก็ได้
            db.all(sql,[], (err, rows) => {
            if(err){
                return res.status(500).json({error: 'Fail to fetch contact from DataBase!!'})
            }
            res.json(rows);
        })
        break;

        case 'deletelast':
            var sql = 'DELETE FROM contact WHERE id = (SELECT max(id) FROM contact)'; //ใช้อันนี้หรือบนก็ได้
            db.all(sql,[], (err, rows) => {
            if(err){
                return res.status(500).json({error: 'Fail to fetch contact from DataBase!!'})
            }
            res.json({message: 'Last contact is delete!!'});
        })
        break;
        default: res.status(200).json({error:'มันไม่ได้'});
        
    }
})

module.exports = router;