const express = require('express');
const bodyParser = require('body-parser'); // to parse the JSON
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');

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

app.post('/signin', (req, res) => signin.handleSignin(req, res, bcrypt, db));

app.post('/register', (req, res) => register.handleRegister(req, res, bcrypt, db)); //dependency injection

app.get('/profile/:id', (req, res) => profile.handleProfileGet (req, res, db));

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