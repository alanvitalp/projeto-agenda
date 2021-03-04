const mongoose = require('mongoose');
// const validator = require('validator');
const empty = require('is-empty');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login () {
    this.valida();
    if(this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push('usuário inválido.');
      return;
    }

    if(bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }
  }

  async register() {
    this.valida();
    if(this.errors.length > 0) return;


    await this.usuarioExistente();

    if(this.errors.length > 0) return;
    
    
    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);
    
    this.user = await LoginModel.create(this.body);
  }

  async usuarioExistente () {
    const user = await LoginModel.findOne({ email: this.body.email });

    if (user) this.errors.push('Usuário já existe');
  }

  valida() {
    this.cleanUp();
    this.validator(this.body.email);

    // if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido!');
  
    if(this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
    }
  }

  cleanUp() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }

  validator (mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
      return (true)
    }
    this.errors.push('E-mail inválido.');
    return (false);
  }
}

module.exports = Login;