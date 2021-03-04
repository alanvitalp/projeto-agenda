const Contato = require('../models/contatoModel');

exports.index = (req, res) => {
  res.render('contato');
}

exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body); 
    await contato.register();
  
    if(contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(function () {
        return res.redirect('back');
      })
      return;
    }

    req.flash('success', 'Contato criado com sucesso'); 
    req.session.save(function () {
      res.redirect(`/contato/index/${contato.contato._id}`);
    });
    return;
  } catch(e) {
    console.log(e);
  }
}; 

exports.edit = async (req, res) => {
  if (!req.params.id) return res.render('404');

  const contato = await Contato.buscaPorId(req.params.id);
  if(!contato) return res.render('404');

  res.render('contato');
};