import * as bcrypt from 'bcrypt';
import {
  createSchema,
  ExtractDoc,
  ExtractProps,
  Type,
  typedModel,
} from 'ts-mongoose';

const ImageSchema = createSchema({
  image_data: Type.string(),
  imageName: Type.string({ required: false }),
});

const UserSchema = createSchema({
  behance: Type.string(),
  birthDate: Type.date(),
  city: Type.string(),
  email: Type.string({ index: true, unique: true }),
  facebook: Type.string(),
  fbId: Type.string({ index: true, unique: false }),
  googleId: Type.string({ index: true, unique: false }),
  img: Type.schema().of(ImageSchema),
  instagram: Type.string(),
  name: Type.string(),
  password: Type.string(),
  resetPasswordExpires: Type.number(),
  resetPasswordToken: Type.string(),
  website: Type.string(),
  ...({} as { comparePassword: typeof comparePassword }),
});

/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {Promise<boolean>}
 */
function comparePassword(this: UserDoc, password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
}

UserSchema.methods.comparePassword = comparePassword;

UserSchema.pre<UserDoc>('save', async function saveHook() {
  // proceed further only if the password is modified or the user is new
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

export const Image = typedModel('Image', ImageSchema);
export const User = typedModel('User', UserSchema);
export type UserDoc = ExtractDoc<typeof UserSchema>;
export type UserProps = ExtractProps<typeof UserSchema>;

declare global {
  namespace Express {
    type IUser = UserDoc;
  }
}
