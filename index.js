const express = require('express');
const session = require('express-session');


const app = express();
const port = process.env.PORT || 8000;

const node_session_secret = '19e00136-e324-11ed-b5ea-0242ac120002'; // Link to env secret

const expireTime = 24 * 60 * 60 * 1000; // 24 hours

app.use(session({
    secret: node_session_secret,
    //store: mongoStore, //default is memory store
    saveUninitialized: false,
    resave: true
}
));

app.get('/', (req, res) => {
    res.send('Welcome to my home page!');
    // if (req.session.numPageHits == null) {
    //     req.session.numPageHits = 0;
    // } else {
    //     req.session.numPageHits++;
    // }
    // // numPageHits++;
    // res.send('You have visited this page ' + req.session.numPageHits + ' times!');
})

// Add nosql injection

app.get('/about', (req, res) => {
    var color = req.query.color;

    res.send("<h1 style='color:" + color + "'>Marvin Sio</h1>");
})

app.get('/contact', (req, res) => {
    var missingEmail = req.query.missing;
    var html = `
    Email Address:
    <form action='/submitEmail' method='post'>
        <input name='email' type='text' placeholder='email'>
        <button>Submit</button>
    </form>
    `;
    if (missingEmail) {
        html += "<br> email is required";
    }
    res.send(html);
});

app.post('/submitEmail', (req, res) => {
    var email = req.body.email;
    if (!email) {
        res.redirect('/contact?missing=1');
    } else {
        res.send("Thanks for subscribing with email " + email);
    }
});

app.get('/createUser', (req, res) => {
    var html = `
    create user
    <form action='/submitUser' method='post'>
    <input name='password' type='password' placeholder='password'>
    <button>Submit</button>
    </form>
    `;
    res.send(html);
});

app.get('/login', (req, res) => {
    var html = `
    Login
    <form action='/logginin' method='post'>
    <input name='username' type='text' placeholder='username'>
    <input name='password' type='password' placeholder='password'>
    <button>Submit</button>
    </form>
    `;
    res.send(html);
});

app.get("*", (req, res) => {
    res.status(404);
    res.send("Page not found - 404");
})

app.listen(port, () => {
    console.log("Node application listening on port " + port);
});