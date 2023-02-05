const pug = require('pug');
// inline css for older email services
const juice = require('juice');
// for people who view emails in a terminal for example...
const { htmlToText } = require('html-to-text');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// pug -> html
const generateHTML = (filename, options = {}) => {
  // __dirname (special variable) is the current directory that we are running this file from. renderFile folder in a different folder...?
  // options includes reset var and users email address
  const html = pug.renderFile(
    `${__dirname}/../views/email/${filename}.pug`,
    options
  );
  // inline css for older email services
  const inlined = juice(html);
  return inlined;
};

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText(html, {
    wordwrap: 130,
  });

  const msg = {
    to: options.userEmail,
    from: 'pptcreatecontact@gmail.com',
    subject: options.subject,
    text,
    html,
  };

  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  })();
};
