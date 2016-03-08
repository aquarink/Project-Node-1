var User = require('../model/user');
var Config = require('../../config');
var SecretKey = Config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {
  var token = jsonwebtoken.sign({
    _id: user._id,
    name: user.name,
    username: user.username
  }.SecretKey, {
    expiresInMinutes: 1440
  });

  return token;
}

module.exports = function(app, express) {
  var api = express.Router();

  // Route Signup
  api.post('/signup', function(req, res) {
    var user = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    });

    // Save user data
    user.save(function(err){
      if(err) {
        res.send(err);
        return;
      }
      res.json({ message: 'Save ok'});
    });
  });

  // Route ambil semua data
  api.get('/users', function(req, res) {
    User.find({}, function(err, users) {
      if(err) {
        res.send(err);
        return;
      }
      res.json(users)
    });
  });

  // Route Login
  api.post('/login', function(req, res) {
    User.findOne({
      username: req.body.username
    }).select('password').exec(function(err, user) {
      if(err) throw err;

      // User tidak ada dengan validasi username dan Password
      if(!user) {
        res.send({ message: 'User tidak ada' });
      } else if(user) {
        var validPassword = user.comparePassword(req.body.password);

        // Jika username ada tetapi Password salah
        if(!validPassword) {
          res.send({ message: 'Password salag' });
        } else {
          // token
          var tokennya = createToken(user);

          res.json({
            success: true,
            message: 'Login sukses',
            token: tokennya
          });
        }
      }
    });
  });

  //returnof api
  return api
}
