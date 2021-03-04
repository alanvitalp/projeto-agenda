const Login = require('../models/login.model');

exports.index = (req, res) => {
  console.log(req.session.user);
  // if (req.session.user) return res.render('login-logado');
  res.render('login');
};

exports.register = async function(req, res) {
  try {
    const login = new Login(req.body);
    await login.register();
  
    if(login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('back');
      })
      return;
    }

    req.flash('success', 'Usuário criado com sucesso'); 
    req.session.save(function () {
      return res.redirect('back');
    })
  } catch(err) {
    console.log(err);
    res.render('404'); 
  }
};

exports.login = async function(req, res) {
  try {
    const login = new Login(req.body);
    await login.login();
  
    if(login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('back');
      })
      return;
    }

    req.flash('success', 'Usuário logado com sucesso.'); 
    req.session.user = login.user;
    req.session.save(function () {
      return res.redirect('back');
    })
  } catch(err) {
    console.log(err);
    res.render('404'); 
  }
};

exports.logout = function(req, res) {
  req.session.destroy((err) => {
    res.redirect('/')
  })
};