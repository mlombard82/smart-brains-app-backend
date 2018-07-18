const express = require('express');
const bodyParser = require('body-parser'); // to parse the JSON
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
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


const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Sally",
            email: "sally@gmail.com",
            password: "bananas",
            entries: 0,
            joined: new Date()
        },
    ]

    // login: [
    //     {
    //         id: '987',
    //         hash: '',
    //         email: 'john@gmail.com'
    //     }
    // ]
}

app.get('/', (req, res)=>{
    res.send(database.users);
});

app.post('/signin', (req, res) => {
        // Load hash from your password DB.
    // bcrypt.compare("soupy", '$2a$10$2oeu/EhZSVUbqA099cRAKum1m5SY0qNKb3JsDrPRKmVMuC4jsvvLG', function(err, res) {
    //     console.log('first guess', res);
    // });
    // bcrypt.compare("veggies", '$2a$10$2oeu/EhZSVUbqA099cRAKum1m5SY0qNKb3JsDrPRKmVMuC4jsvvLG', function(err, res) {
    //     console.log('second guess', res);
    // });

    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
    } else {
        res.status('400').json('error logging in');
    }
});

app.post('/register', (req, res) => {

    const {name, email, password} = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
    console.log(hash);
    });

    db('users')
        .returning('*')
        .insert({
            name: name,
            email: email,
            joined: new Date()
        })
        .then(user => res.json(user[0]))
        .catch(err => res.status('400').json('unable to register'));
});

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
    let found = false;

    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            user.entries++;
            res.json(user.entries);
        } 
    });

    if(!found) {
        res.status('404').json('no user around');
    }
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