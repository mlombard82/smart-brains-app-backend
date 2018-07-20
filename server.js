const express = require('express');
const bodyParser = require('body-parser'); // to parse the JSON
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const register = require('./controllers/register');
var cors = require('cors');

var db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'mauriciolombard',
      password : '',
      database : 'smart-brainy'
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=>{
    // res.send(database.users);
});

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email','=', req.body.email)
    .then(data => {
       const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
       if (isValid) {
          return db.select('*').from('users')
            .where('email','=', req.body.email)
            .then(user => {
                res.json(user[0]);
            })
            .catch(err => res.status(400).json('unable to get user'));
        } else {
            res.status(400).json('wrong password');
        }
    }).catch(err => res.status(400).json('wrong credentials'));
});

app.post('/register', (req, res) => register.handleRegister(req, res, bcrypt, db)); //dependency injection

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;

    db.select('*').from('users').where({id})
    .then(user => {
        if(user.length){
            res.json(user[0]);
        } else {
            res.status('404').json('not found');
        }
    })
    .catch(err => res.status('404').json('error getting user'));
});

app.put('/image', (req, res) => {
    
    const {id} = req.body;
    
    db('users').where({id})
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
});



app.listen(3000, () => {
    console.log('app is listening in port 3000');
});


/*
/ --> res --> this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user
*/