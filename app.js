const express = require('express');
const sqlite3 = require('sqlite3');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001; 

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./db.db', (err) => {
    if(err) {
        console.error(err.message);
    }
    console.log('Успешное подключение к БД!');
});

function checkToken(token, res) {
    let id = 0
    if (!token) {
        return res.status(401).json({message: 'Не авторизован'})
    }

    jwt.verify(token, 'secret_key', (err, row) => {
        if (err) {
            return res.status(401).json({message: 'Неверный токен'})
        }
        id = row.userId
    })
    return id   
}

app.post('/register', (req, res) => {
    const {email, phone, license, password, full_name} = req.body

    db.get(`select * from users where email = ?`, [email], (err, row) => {
        if (row) {
            return res.status(500).json({message: 'Такой пользователь уже существует'})
        }

        db.run(`insert into users (email, phone, license, password, full_name) values (?, ?, ?, ?, ?)`, [email, phone, license, password, full_name], function(err) {
            if (err) {
                return res.status(500).json({message: 'Ошибка при создании пользователя'})
            }
            return res.status(200).json({message: 'Пользователь создан!'})
        })
    })
})

app.post('/auth', (req, res) => {
    const {email, password} = req.body

    db.get(`select * from users where email = ?`, [email], (err, row) => {
        if (err) {
            return res.status(500).json({message: err})
        } 
        if (!row) {
            return res.status(500).json({message: 'Такого пользователя не существует'})
        }
        if (row.password !== password) {
            return res.status(500).json({message: 'Неправильный пароль'})
        }

        const token = jwt.sign({ userId: row.id, email: row.email}, 'secret_key', {expiresIn: '1h'});
        res.json({token});
    })
})

app.post('/request', (req, res) => {
    const {date, car} = req.body

    const user_id = checkToken(req.headers.authorization?.split(' ')[1], res)

    db.get(`select * from users where id = ?`, [user_id], (err, row) => {
        if (err) {
            return res.status(500).json({message: err})
        } 
        if (!row) {
            return res.status(500).json({message: 'Такого пользователя не существует'})
        }
        
        const user = row

        db.run(`insert into requests (email, phone, fio, date, car, status) values (?, ?, ?, ?, ?, ?)`, [user.email, user.phone, user.full_name, date, car, 'Новая заявка'], function(err) {
            if (err) {
                return res.status(500).json({message: 'Ошибка при создании услуги'})
            }
            return res.status(200).json({message: 'Услуга создана!'})
        })
    })
})

app.post('/requests', (req, res) => {
    const {email} = req.body
    const user_id = checkToken(req.headers.authorization?.split(' ')[1], res)

    if (user_id === 2) {
        db.all(`select * from requests`, (err, row) => {
            if (err) {
                return res.status(500).json({message: err})
            } 
            return res.status(200).json({row})
        })
    } else {
        db.all(`select * from requests where email = ?`, [email], (err, row) => {
            if (err) {
                return res.status(500).json({message: err})
            } 
            if (!row) {
                return res.status(500).json({message: 'Такого пользователя не существует'})
            }
            return res.status(200).json({row})
        })
    }
})

app.post('/update', (req, res) => {
    const {status, id} = req.body

    db.get(`update requests set status = ? where id = ?`, [status, id], (err, row) => {
        if (err) {
            return res.status(500).json({message: err})
        }
        return res.status(200).json({message: `Статус изменен на "${status}"`})
    })
})


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});