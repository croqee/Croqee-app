import { Router } from 'express';
import { User, UserProps } from '../db/models/user';

export const router = Router();

const croqeeBodyParser = <T>(body: T): T => {
  let reqBody = {} as T;
  for (const key in body) {
    reqBody = JSON.parse(key);
  }
  return reqBody;
};

router.get('/getuser', (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

//find a user by their id
router.get<{ id: string }>('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).exec();
  if (!user) return res.status(400).send('user not found');

  const editeduser = {
    behance: user.behance,
    birthDate: user.birthDate,
    city: user.city,
    email: user.email,
    facebook: user.facebook,
    image_data: user.img?.image_data,
    instagram: user.instagram,
    name: user.name,
    website: user.website,
  };
  res.status(200).json(editeduser);
});

router.post<{ id: string }, any, Partial<UserProps>>(
  '/updateuser/:id',
  async (req, res) => {
    const userId = req.params.id;
    const update = croqeeBodyParser(req.body);
    await User.findOneAndUpdate({ id: userId }, update).exec();
    res.status(204).json({ success: 'updated' });
  },
);

router.get('/password', async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).exec();
  res.status(200).json(user.password == null);
});

function validatePasswordForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (
    !payload ||
    typeof payload.currentPassword !== 'string' ||
    payload.currentPassword.trim().length === 0
  ) {
    isFormValid = false;
    errors.currentPassword = 'Please provide your current password.';
  }

  if (
    !payload ||
    typeof payload.newPassword !== 'string' ||
    payload.newPassword.trim().length === 0
  ) {
    isFormValid = false;
    errors.newPassword = 'Please provide your new password.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    errors,
    message,
    success: isFormValid,
  };
}
router.post('/password', async (req, res) => {
  req.body = croqeeBodyParser(req.body);
  const validationResult = validatePasswordForm(req.body);
  const { currentPassword, newPassword } = req.body;

  if (!validationResult.success) {
    return res.status(400).json({
      errors: validationResult.errors,
      message: validationResult.message,
      success: false,
    });
  }

  const user = await User.findById(req.user.id).exec();
  if (!user) throw new Error('Incorrect email or password');

  // check if a hashed user's password is equal to a value saved in the database
  try {
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      const error = new Error('Incorrect password');
      console.error(error);
      return res.status(400).json({ error: 'Incorrect Password' });
    }
    user.password = newPassword.trim();
    await user.save().catch((err) => res.status(400).json(err));
    res.status(200).json({ msg: 'success' });
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
});

router.delete('/account', async (req, res) => {
  const userId = req.user.id;
  await User.findOneAndDelete({ id: userId }).exec();
  res.status(204).end();
});
