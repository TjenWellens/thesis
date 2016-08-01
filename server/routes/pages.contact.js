var _ = require('underscore');

module.exports = function (app, config, model, sendMail) {
  var Contact = model.contact;

  app.post('/contact', postContact);

  function postContact (req, res, next) {
    var contactData = {
      user: req.user ? {id: req.user.id, name: req.user.name} : null,
      name: req.body.name,
      email: req.body.email,
      title: req.body.title,
      message: req.body.message,
      body: req.body,
    };

    new Contact(contactData)
      .save()
      .then(sendMailForContact)
      .then(function () {
        req.flash('about', 'Message sent');
        res.redirect(config.home);
      })
      .catch(function (err) {
        console.error('Error: something went wrong with contact data: ', err, contactData);
        req.flash('contact', 'Failed to send message, please try again or send a mail to tjen.wellens@gmail.com');
        res.redirect('/contact');
      });

    function sendMailForContact (data) {
      return sendMail({
        subject: 'Question: ' + data.title,
        from: '"' + data.name + '" <' + data.email + '>',
        text: data.message,
        html: data.message + '<br/><br/>----<br/><br/>' + JSON.stringify(data),
      });
    }
  }
};
