const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 12; // What are salt rounds?

const port = process.env.PORT || 8000;

const app = express();

//Users and Passwords
var users = [];

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send("<h1>Welcome to my website!</h1>");
});

app.get('/about', (req, res) => {
    var color = req.query.color;

    res.send("<h1 style='color:" + color + ";'>Marvin Sio</h1>");
});

app.get('/contact', (req, res) => {
    var missingEmail = req.query.missing;
    var html = `
        Email Address:
        <form action='/submitEmail' method='post'>
            <input name='email' type='text' placeholder='Email'>
            <button>Submit</button>
        </form>
    `;
    if (missingEmail) {
        html += "<h2 style='color:red;'>Please enter an email address</h2>";
    }
    res.send(html);
});

app.post('/submitEmail', (req, res) => {
    var email = req.body.email;
    if (!email) {
        res.redirect('/contact?missing=1');
    }
    else {
        res.send("Thank you for subscribning with your email: " + email);
    }
});


app.get('/createUser', (req, res) => {
    var html = `
    Create User
    <form action='/submitUser' method='post'>
    <input name='username' type='text' placeholder='username'>
    <input name='password' type='password' placeholder='password'>
    <button>Submit</button>
    </form>
    `;
    res.send(html);
});


app.get('/login', (req, res) => {
    var html = `
    Login
    <form action='/loggingin' method='post'>
    <input name='username' type='text' placeholder='username'>
    <input name='password' type='password' placeholder='password'>
    <button>Submit</button>
    </form>
    `;
    res.send(html);
});

app.post('/submitUser', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    var hashedPassword = bcrypt.hashSync(password, saltRounds);

    users.push({ username: username, password: hashedPassword });

    console.log(users);

    var usershtml = "";
    for (i = 0; i < users.length; i++) {
        usershtml += "<li>" + users[i].username + "</li>" + "<li>" + users[i].password + "</li>";
    }

    var html = "<ul>" + usershtml + "</ul>";
    res.send(html);
});

app.post('/loggingin', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;


    var usershtml = "";
    for (i = 0; i < users.length; i++) {
        if (users[i].username == username) {
            if (bcrypt.compareSync(password, users[i].password)) {
                res.redirect('/loggedIn');
                return;
            }
        }
    }

    //user and password combination not found
    res.redirect("/login");
});

app.get('/loggedIn', (req, res) => {
    var html = `
    You are logged in!
    `;
    res.send(html);
});

app.get('/cat/:id', (req, res) => {

    var cat = req.params.id;

    if (cat == 1) {
        res.send("Fluffy: <img src='/fluffy.gif' style='width:250px;'>");
    }
    else if (cat == 2) {
        res.send("Socks: <img src='/socks.gif' style='width:250px;'>");
    }
    else {
        res.send("Invalid cat id: " + cat);
    }
});

app.get("*", (req, res) => {
    res.status(404);
    res.send("Page not found - 404");
});

app.use(express.static(__dirname + "/public"));


app.listen(port, () => {
    console.log("Node application listening on port " + port);
});