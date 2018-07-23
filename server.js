const express = require('express');
const bodyParser = require('body-parser'); // to parse the JSON
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


var cors = require('cors');

var db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,  //heroku specific
        ssl: true,
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=>{ res.send('it is working!')});

app.post('/signin', (req, res) => signin.handleSignin(req, res, bcrypt, db));
app.post('/register', (req, res) => register.handleRegister(req, res, bcrypt, db)); //dependency injection
app.get('/profile/:id', (req, res) => profile.handleProfileGet (req, res, db));
app.put('/image', (req, res) => { image.handleImage (req, res, db)});
app.post('/imageUrl', (req, res) => { image.handleApiCall (req, res)});

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
    console.log(`app is listening in port ${PORT}`);
});


/*
/ --> res --> this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user
*/