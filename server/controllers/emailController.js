const fs = require('fs');
const path = require('path');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

exports.SendWelcomeEmail = catchAsync(async (empEmail, empName, resetURL) => {
  const html = fs.readFileSync(
    path.join(__dirname, '..', 'views', 'emails', 'welcome_email.html'),
    'utf-8'
  );

  //path.join: to construct file paths platform-independent,reliable, relative to the current file's directory, making the code more maintainable.

  //__dirname: The __dirname is a global variable that holds the path to the current directory.

  await sendEmail({
    email: empEmail,
    from: 'donotreply@tgo-orangeHRM.com',
    subject: 'Welcome to our Rooster Management System',
    message: `Hi ${empName}, Welcome to our Rooster Management System. Please click on the link below to set your password. ${resetURL}`,

    html: html
      .replace('{{Employee Name}}', empName)
      .replace('{{Reset_URL}}', resetURL),
  });
});

exports.SendPasswordResetEmail = catchAsync(
  async (empEmail, empName, resetURL) => {
    const html = fs.readFileSync(
      path.join(
        __dirname,
        '..',
        'views',
        'emails',
        'reset_password_email.html'
      ),
      'utf-8'
    );

    await sendEmail({
      email: empEmail,
      from: 'donotreply@tgo-orangeHRM.com',
      subject: 'Your password reset token (valid for 10 minutes)',
      message: `Hi ${empName}, Please click on the link below to reset your password. ${resetURL}`,

      html: html
        .replace('{{Employee Name}}', empName)
        .replace('{{Reset_URL}}', resetURL),
    });
  }
);
