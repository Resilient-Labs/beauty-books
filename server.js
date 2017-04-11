/**
 * Created by muigai on 2/23/17.
 * edit by CCF 4/1/17, for data services
 */

const conf = require('./conf.js');

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var moment = require('moment');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var striptags = require('striptags');

var app = express();

passport.use(new FacebookStrategy({
    clientID: conf.FB_APP.clientID, //process.env.CLIENT_ID,
    clientSecret: conf.FB_APP.clientSecret, //process.env.CLIENT_SECRET,
    callbackURL: conf.FB_APP.callbackURL, //'https://beautybooks.biz/login/facebook/return'
    //passReqToCallback: true,  // todo: understand what this does
    profileFields: ['id', 'emails', 'about', 'name', 'displayName']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("In fb passport strategy callback");
    //console.log(profile);
    return createOnAuth(accessToken, refreshToken, profile, cb, "Facebook");
  })
);

passport.use(new GoogleStrategy({
    clientID: conf.GOOG_APP.clientID,
    clientSecret: conf.GOOG_APP.clientSecret,
    callbackURL: conf.GOOG_APP.callbackURL
    //passReqToCallback: true,  // todo: understand what this does
    //profileFields: ['id', 'emails', 'about', 'name', 'displayName']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("In google passport strategy callback");
    //console.log(profile);
    return createOnAuth(accessToken, refreshToken, profile, cb, "Google");
  })
);

// passport strategy callback. create user (pro) record if it doesn't exist
function createOnAuth(accessToken, refreshToken, profile, cb, oauthProviderName) {
  console.log("In createOnAuth");
  var db = mysql.createConnection(conf.DB_OPTIONS);
  // todo: check email instead of or in addition to ID, in case someone tries to do BOTH FB and Goog auth.
  db.query("SELECT pro_id FROM pro WHERE oauth_id = ?", [profile.id], function(err, rows) {
    if(err) { console.log(err); return cb(err, profile); }
    if(rows.length == 0) {   // new registration
      db.query('INSERT INTO pro SET ?',
               { create_date: moment().format('YYYY-MM-DD H:mm:ss'), oauth_id: profile.id,
                 firstname: profile.name.givenName, lastname: profile.name.familyName,
                 email: profile.emails[0].value, oauth_provider: oauthProviderName },
      function(err, result) {
        if(err) { console.log(err); return cb(err, profile); }
        // todo: better error handling
      });
    }
  });
  return cb(null, profile);
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

app.use(bodyParser.json());
app.use(urlencodedParser = bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

passport.deserializeUser(function(user, done) {
  var db = mysql.createConnection(conf.DB_OPTIONS);
  db.query("SELECT * FROM pro WHERE oauth_id = ?", [user.id], function(err, rows) {
    if(err) { done(err, null); return; }
    if(rows.length == 0) {
      // we could just create the record here if it's not found.
      done("Record for pro_id " + user.id + " not found.", null);
      return;
    }
    done(null, rows[0]);
  });
});

app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: '58sajklfbxcbval5972kdjhfguiy5hhhf', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

// route for basic testing 
app.get('/app', function (req, res) {
  res.send({foo:"bar"});
})

// optional route for mailing list signups (from placeholder landing page)
app.post('/app/mailsignup', urlencodedParser, function (req, res) {
  console.log(req.body);
  var db = mysql.createConnection(conf.DB_OPTIONS);
  db.query("INSERT INTO prospect SET ?", { name: req.body.name, email: req.body.email }, function(err, resp) {
    if(err) {
      console.log(err);
    } else {
      //console.log("DB response: ", resp);
    }
  });
  //console.log(req.params);
  //console.log(req.query);
  res.send({ status: "OK" });
});

// routes for oauth
app.get('/login/facebook',
  passport.authenticate('facebook', { scope: 'email' }));
app.get('/login/facebook/return',
  passport.authenticate('facebook', { scope: 'email', failureRedirect: '/' }),  // fixme: redirect to an error page if user doesn't authorize
  function(req, res) {
    console.log(req.user);
    res.redirect('/');
});

app.get('/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/login/google/return',
  passport.authenticate('google', { scope: 'email', failureRedirect: '/' }),
  function(req, res) {
    console.log(req.user);
    res.redirect('/');
});

// universal redirect for not-logged-in case
app.get('/noauth-json', function(req, res) {
  res.send({error: "Not logged in", status: -1});
});

// CREATE (POST) services
app.post('/api/appointment',
  require('connect-ensure-login').ensureLoggedIn('/noauth-json'),
  function(req, res) {
    var db = mysql.createConnection(conf.DB_OPTIONS);
    var record = {pro_id: req.user.pro_id, appt_date: moment(req.body.appt_date).format('YYYY-MM-DD HH:mm:ss'),
                  amount: Number(req.body.amount.replace(/\$/, '')), note: striptags(req.body.note)};
    db.query("INSERT INTO appt SET ?", record, function(err, result) {
      if(err) {
        console.log(err);
        res.send(conf.defaultFailResponse);
      } else {
        record.id = result.insertId;
        res.send(record);
      }
    });
  });
// todo: handle image file upload
app.post('/api/expense',
  require('connect-ensure-login').ensureLoggedIn('/noauth-json'),
  function(req, res) {
    var db = mysql.createConnection(conf.DB_OPTIONS);
    var record = {pro_id: req.user.pro_id, expense_date: moment(req.body.expense_date).format('YYYY-MM-DD HH:mm:ss'),
                  amount: Number(req.body.amount.replace(/\$/, '')), note: striptags(req.body.note)};
    db.query("INSERT INTO expense SET ?", record, function(err, result) {
      if(err) {
        console.log(err);
        res.send(conf.defaultFailResponse);
      } else {
        record.id = result.insertId;
        res.send(record);
      }
    });
  });

// UPDATE (PUT) services
app.put('/api/appointment/:id',
  require('connect-ensure-login').ensureLoggedIn('/noauth-json'),
  function(req, res) {
    var db = mysql.createConnection(conf.DB_OPTIONS);
    var record = {id: req.params.id, pro_id: req.user.pro_id, appt_date: moment(req.body.appt_date).format('YYYY-MM-DD HH:mm:ss'),
                  amount: Number(req.body.amount.replace(/\$/, '')), note: striptags(req.body.note)};
    db.query("UPDATE appt SET appt_date = ?, amount = ?, note = ? WHERE appt_id = ? AND pro_id = ?", [record.appt_date, record.amount, record.note, req.params.id, req.user.pro_id], function(err, result) {
      if(err) {
        console.log(err);
        res.send(conf.defaultFailResponse);
      } else {
        res.send(record);
      }
    });
  });
// todo: handle image file upload here as well
app.put('/api/expense/:id',
  require('connect-ensure-login').ensureLoggedIn('/noauth-json'),
  function(req, res) {
    var db = mysql.createConnection(conf.DB_OPTIONS);
    var record = {id: req.params.id, pro_id: req.user.pro_id, expense_date: moment(req.body.appt_date).format('YYYY-MM-DD HH:mm:ss'),
                  amount: Number(req.body.amount.replace(/\$/, '')), note: striptags(req.body.note)};
    db.query("UPDATE expense SET expense_date = ?, amount = ?, note = ? WHERE expense_id = ? AND pro_id = ?", [record.expense_date, record.amount, record.note, req.params.id, req.user.pro_id], function(err, result) {
      if(err) {
        console.log(err);
        res.send(conf.defaultFailResponse);
      } else {
        res.send(record);
      }
    });
  });
app.put('/api/user',
  require('connect-ensure-login').ensureLoggedIn('/noauth-json'),
  function(req, res) {
    var db = mysql.createConnection(conf.DB_OPTIONS);
    var record = {id: req.user.pro_id, pro_id: req.user.pro_id, firstname: striptags(req.body.firstname), 
                  lastname: striptags(req.body.lastname), email: striptags(req.body.email), mobile: striptags(req.body.mobile)};
    db.query("UPDATE pro SET firstname = ?, lastname = ?, email = ?, mobile = ? WHERE pro_id = ?", [record.firstname, record.lastname, record.email, req.mobile, req.user.pro_id], function(err, result) {
      if(err) {
        console.log(err);
        res.send(conf.defaultFailResponse);
      } else {
        res.send(record);
      }
    });
  });

// DELETE (DELETE) services
app.delete('/api/appointment/:id',
  require('connect-ensure-login').ensureLoggedIn('/noauth-json'),
  function(req, res) {
    var db = mysql.createConnection(conf.DB_OPTIONS);
    var record = {id: req.params.id, pro_id: req.user.pro_id};
    db.query("DELETE FROM appt WHERE appt_id = ? AND pro_id = ?", [req.params.id, req.user.pro_id], function(err, result) {
      if(err) {
        console.log(err);
        res.send(conf.defaultFailResponse);
      } else {
        res.send(record);
      }
    });
  });
app.delete('/api/expense/:id',
  require('connect-ensure-login').ensureLoggedIn('/noauth-json'),
  function(req, res) {
    var db = mysql.createConnection(conf.DB_OPTIONS);
    var record = {id: req.params.id, pro_id: req.user.pro_id};
    db.query("DELETE FROM expense WHERE expense_id = ? AND pro_id = ?", [req.params.id, req.user.pro_id], function(err, result) {
      if(err) {
        console.log(err);
        res.send(conf.defaultFailResponse);
      } else {
        res.send(record);
      }
    });
  });

// READ (GET) services
app.get('/api/appointment',
  require('connect-ensure-login').ensureLoggedIn('/noauth-json'),
  function(req, res) {
    var db = mysql.createConnection(conf.DB_OPTIONS);
    db.query("SELECT * FROM appt WHERE pro_id = ?", [req.user.pro_id], function(err, rows) {
      if(err) {
        console.log(err);
        res.send(conf.defaultFailResponse);
      } else {
        var ret = [];
        for(var i in rows) {
          var appt = rows[i];
          ret.push({ id: appt.appt_id, pro_id: req.user.pro_id, appt_date: appt.appt_date, amount: appt.amount, note: appt.note });
        }
        res.send({ records: ret });
      } 
    });
  });
app.get('/api/appointment/:id',
  require('connect-ensure-login').ensureLoggedIn('/noauth-json'),
  function(req, res) {
    var db = mysql.createConnection(conf.DB_OPTIONS);
    db.query("SELECT * FROM appt WHERE appt_id = ? AND pro_id = ?", [req.params.id, req.user.pro_id], function(err, rows) {
      if(err) {
        console.log(err);
        res.send(conf.defaultFailResponse);
      } else if(rows.length) {
        appt = rows[0];
        res.send({ id: appt.appt_id, pro_id: req.user.pro_id, appt_date: appt.appt_date, amount: appt.amount, note: appt.note });
      } else {
        res.send({ error: "Appointment not found", status: -1 }); // 404?
      }
    });
  });
app.get('/api/expense',
  require('connect-ensure-login').ensureLoggedIn('/noauth-json'),
  function(req, res) {
    var db = mysql.createConnection(conf.DB_OPTIONS);
    db.query("SELECT * FROM expense WHERE pro_id = ?", [req.user.pro_id], function(err, rows) {
      if(err) {
        console.log(err);
        res.send(conf.defaultFailResponse);
      } else {
        var ret = [];
        for(var i in rows) {
          exp = rows[0];
          ret.push({ id: exp.expense_id, pro_id: req.user.pro_id, expense_date: exp.expense_date, amount: exp.amount, note: exp.note });
        }
        res.send({ records: ret });
      }
    });
  });
app.get('/api/expense/:id',
  require('connect-ensure-login').ensureLoggedIn('/noauth-json'),
  function(req, res) {
    var db = mysql.createConnection(conf.DB_OPTIONS);
    db.query("SELECT * FROM expense WHERE expense_id = ? AND pro_id = ?", [req.params.id, req.user.pro_id], function(err, rows) {
      if(err) {
        console.log(err);
        res.send(conf.defaultFailResponse);
      } else if(rows.length) {
        exp = rows[0];
        res.send({ id: exp.expense_id, pro_id: req.user.pro_id, expense_date: exp.expense_date, amount: exp.amount, note: exp.note });
      } else {
        res.send({ error: "Expense not found", status: -1 }); // 404?
      }
    });
  });
app.get('/api/user',
  require('connect-ensure-login').ensureLoggedIn('/noauth-json'),
  function(req, res) {
    var db = mysql.createConnection(conf.DB_OPTIONS);
    db.query("SELECT * FROM pro WHERE pro_id = ?", [req.user.pro_id], function(err, rows) {
      if(err) {
        console.log(err);
        res.send(conf.defaultFailResponse);
      } else if(rows.length) {
        pro = rows[0];
        res.send({ id: pro.pro_id, pro_id: req.user.pro_id, firstname: pro.firstname, lastname: pro.lastname, email: pro.email, mobile: pro.mobile, email: pro.email, create_date: pro.create_date });
      } else {
        res.send({ error: "User not found", status: -1 }); // 404?
      }
    });
});

app.listen(conf.port);
