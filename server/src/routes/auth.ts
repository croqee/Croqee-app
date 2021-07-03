import { randomBytes } from 'crypto';
import { transformAndValidate } from 'class-transformer-validator';
import { Router } from 'express';
// import graph from 'fbgraph';
import { google } from 'googleapis';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import passport from 'passport';
import * as config from '../config';
import { LoginDto, SignUpDto } from '../controllers/drawing-competition/dtos';
import { User } from '../db/models/user';
import { getIdFromToken } from '../lib/jwt';

export const router = Router();

// const croqeeBodyParser = (body: any) => {
//   var reqBody = {};
//   for (var key in body) {
//     reqBody = JSON.parse(key);
//   }
//   return reqBody;
// };

// /**
//  * Validate the sign up form
//  *
//  * @param {object} payload - the HTTP body message
//  * @returns {object} The result of validation. Object contains a boolean validation result,
//  *                   errors tips, and a global message for the whole form.
//  */
// function validateSignupForm(payload) {
//   const errors: any = {};
//   let isFormValid = true;
//   let message = '';

//   if (
//     !payload ||
//     typeof payload.email !== 'string' ||
//     !validator.isEmail(payload.email)
//   ) {
//     isFormValid = false;
//     errors.email = 'Please provide a correct email address.';
//   }

//   if (
//     !payload ||
//     typeof payload.password !== 'string' ||
//     payload.password.trim().length < 8
//   ) {
//     isFormValid = false;
//     errors.password = 'Password must have at least 8 characters.';
//   }

//   if (
//     !payload ||
//     typeof payload.name !== 'string' ||
//     payload.name.trim().length === 0
//   ) {
//     isFormValid = false;
//     errors.name = 'Please provide your name.';
//   }

//   if (!isFormValid) {
//     message = 'Check the form for errors.';
//   }

//   return {
//     errors,
//     message,
//     success: isFormValid,
//   };
// }

// /**
//  * Validate the login form
//  *
//  * @param {object} payload - the HTTP body message
//  * @returns {object} The result of validation. Object contains a boolean validation result,
//  *                   errors tips, and a global message for the whole form.
//  */
// function validateLoginForm(payload) {
//   const errors = {};
//   let isFormValid = true;
//   let message = '';

//   if (
//     !payload ||
//     typeof payload.email !== 'string' ||
//     payload.email.trim().length === 0
//   ) {
//     isFormValid = false;
//     errors.email = 'Please provide your email address.';
//   }

//   if (
//     !payload ||
//     typeof payload.password !== 'string' ||
//     payload.password.trim().length === 0
//   ) {
//     isFormValid = false;
//     errors.password = 'Please provide your password.';
//   }

//   if (!isFormValid) {
//     message = 'Check the form for errors.';
//   }

//   return {
//     success: isFormValid,
//     message,
//     errors,
//   };
// }

router.post('/signup', async (req, res, next) => {
  // req.body = croqeeBodyParser(req.body);
  // await transformAndValidate(SignUpDto, req.body).catch(next);

  return passport.authenticate('local-signup', (err) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          errors: {
            email: 'This email is already taken.',
          },
          message: 'Check the form for errors.',
          success: false,
        });
      }

      return res.status(400).json({
        message: 'Could not process the form.',
        success: false,
      });
    }

    return res.status(200).json({
      message:
        'You have successfully signed up! Now you should be able to log in.',
      success: true,
    });
  })(req, res, next);
});

router.post('/login', async (req, res, next) => {
  // req.body = croqeeBodyParser(req.body)
  // await transformAndValidate(LoginDto, req.body).catch(next);
  console.log(req.body)
  return passport.authenticate('local-login', async (err, tokenData: any) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          message: err.message,
          success: false,
        });
      }

      return res.status(400).json({
        message: 'Could not process the form.',
        success: false,
      });
    }
    const { token } = tokenData;
    console.log(tokenData)

    console.log(tokenData)
    const userId = await getIdFromToken(token);
    const user = await User.findById(userId).exec();
    return res.json({
      message: 'You have successfully logged in!',
      success: true,
      token,
      user,
    });
  })(req, res, next);
});

//google authentications
router.post('/googleauth', async (req, res) => {
  const googleCode = req.body.googleCode;
  const oauth2Client = new google.auth.OAuth2(
    '701118539942-qhfj5072bdipbp3gj12ki3ol6hg5mhme.apps.googleusercontent.com',
    'iSUe2zKU12P8H1u8TE5O0B4Y',
    'postmessage',
  );
  google.options({ auth: oauth2Client });
  const { tokens } = await oauth2Client.getToken(googleCode);
  oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: 'v2' });
  const userData = await oauth2.userinfo.get();
  const googleId = userData.data.id;
  const googleMail = userData.data.email;
  //check if user has already logged in with their google id before
  const user =
    (await User.findOne({ email: googleMail }).exec()) ??
    (await User.findOne({ googleId }).exec()) ??
    (await User.create({
      email: googleMail,
      googleId,
      name: userData.data.name,
    } as any));

  //log the user in there
  const token = jwt.sign(user.id, config.jwtSecret);
  res.json({
    message: 'You have successfully logged in!',
    success: true,
    token,
    user: {
      name: user.name,
    },
  });
});

// //facebook Authentication
// router.post('/facebookauth', (req, res) => {
//   graph.authorize(
//     {
//       code: req.body.facebookCode,
//       client_id: '641364966683591',
//       client_secret: '1dc9cc0665cd8f6c0a4dd0a4ede05d0f',
//       redirect_uri: '',
//     },
//     function (err, facebookRes) {
//       if (facebookRes) {
//         graph.get('/me?fields=email,id,name', (err, userData) => {
//           if (userData) {
//             const fbId = userData.id;
//             const fbmail = userData.email;
//             User.findOne({ email: fbmail }, (err, userByEmail) => {
//               if (userByEmail) {
//                 //log the user in there
//                 const token = jwt.sign(userByEmail.id, config.jwtSecret);
//                 res.json({
//                   success: true,
//                   message: 'You have successfully logged in!',
//                   token,
//                   user: {
//                     name: userByEmail.name,
//                   },
//                 });
//               } else {
//                 User.findOne({ fbId }, (error, userById) => {
//                   if (userById) {
//                     //log the user in there
//                     const token = jwt.sign(userById.id, config.jwtSecret);
//                     res.status(200).json({
//                       success: true,
//                       message: 'You have successfully logged in!',
//                       token,
//                       user: { name: userById.name },
//                     });
//                   } else {
//                     //create a new account
//                     const userInfo = {
//                       name: userData.name,
//                       email: fbmail,
//                       fbId,
//                     };
//                     const newUser = new User(userInfo);
//                     newUser.save((err) => {
//                       if (err) {
//                         //send err msg
//                         res.json({
//                           success: false,
//                           message: 'There was an issue with your google login!',
//                         });
//                       } else {
//                         const token = jwt.sign(newUser.id, config.jwtSecret);
//                         res.json({
//                           success: true,
//                           message: 'You have successfully logged in!',
//                           token,
//                           user: {
//                             name: newUser.name,
//                           },
//                         });
//                       }
//                     });
//                   }
//                 });
//               }
//             });
//           }
//         });
//       }
//     },
//   );
// });

//forgot password get link
router.post('/account', async (req:any, res: any) => {
  // req.body = croqeeBodyParser(req.body);
  const { email } = req.body;
  if (email === '') {
    res.status(400).send('email required');
  }
  const user = await User.findOne({ email }).exec();
  // console.log("to check the email:" + user.email);
  if (user == null) {
    return res.status(403).send('email not in db');
  }
  const token = randomBytes(20).toString('hex');
  const expiryTime = Date.now() + 360000;
  user.resetPasswordToken = token;
  user.resetPasswordExpires = expiryTime;
  try {
    await user.save();
  } catch (error) {
    return res.status(500).json({ error });
  }
  const transporter = nodemailer.createTransport({
    auth: {
      pass: 'bncmztxpzyqefavk',
      user: 'croqee@gmail.com',
    },
    service: 'Gmail',
  });
  const mailOptions = {
    from: 'croqee@gmail.com',
    subject: 'Link To Reset Password',
    text:
      'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
      `http://localhost:3000/reset/${token}\n\n` +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    to: `${user.email}`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json('recovery email sent');
    }
  });
});

router.get('/reset-token-check', async (req, res) => {
  const user = await User.findOne({
    resetPasswordExpires: { $gt: Date.now() },
    resetPasswordToken: req.query.resetPasswordToken as string,
  });

  if (!user) {
    return res
      .status(400)
      .json('password reset link is invalid or has expired');
  }

  res.status(200).send({
    email: user.email,
    message: 'password reset link a-ok',
  });
});

router.put('/reset-pass', async (req, res) => {
  // req.body = croqeeBodyParser(req.body);
  const user = await User.findOne({
    email: req.body.email,
    resetPasswordExpires: { $gt: Date.now() },
    resetPasswordToken: req.body.resetPasswordToken,
  });

  if (!user) {
    return res
      .status(400)
      .json('password reset link is invalid or has expired');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.status(200).send({
    message: 'password successfully updated',
  });
});
