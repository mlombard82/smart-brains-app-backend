const express = require('express');
const bodyParser = require('body-parser'); // to parse the JSON
const bcrypt = require('bcrypt-nodejs');

const app = express();

app.use(bodyParser.json());

const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Sally",
            email: "sally@gmail.com",
            entries: 0,
            joined: new Date()
        },
    ],

    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res)=>{
    res.send(database.users);
});

app.post('/signin', (req, res) => {
        // Load hash from your password DB.
    bcrypt.compare("soupy", '$2a$10$2oeu/EhZSVUbqA099cRAKum1m5SY0qNKb3JsDrPRKmVMuC4jsvvLG', function(err, res) {
        console.log('first guess', res);
    });
    bcrypt.compare("veggies", '$2a$10$2oeu/EhZSVUbqA099cRAKum1m5SY0qNKb3JsDrPRKmVMuC4jsvvLG', function(err, res) {
        console.log('second guess', res);
    });

    if(req.body.name === database.users[0].name && req.body.password === database.users[0].password){
        res.json('success');
    } else {
        res.status('400').json('error logging in');
    }
});

app.post('/register', (req, res) => {

    const {name, email, password} = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
    console.log(hash);
    });

    database.users.push({
        id: "126",
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    }); 

    res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;

    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            res.json(user);
        } 
    });

    if(!found) {
        res.status('404').json('no user around');
    }
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