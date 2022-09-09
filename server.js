require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const router = require('./routes/router');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8081;
const session = require('cookie-session');
const expressUpload = require('express-fileupload');

// static files 
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use(express.static(__dirname))
app.use(session({
  name: 'sid',
  resave: true,
  saveUninitialized: true,
  secret: 'psc',
  cookie: {
    expires: new Date(Date.now() + 360000 * 24),
    maxAge: Date.now() + 360000 * 24
  }
}));

app.use(expressUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
// set template enginea
app.use(expressLayouts)
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
const server = require("http").createServer(app);
app.use('/', router);

server.listen(PORT, () => {
  const port = server.address().port;
  console.log(`Express is working on port ${port}`);
});