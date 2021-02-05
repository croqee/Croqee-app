import { createSchema, Type, typedModel } from 'ts-mongoose';

const ScoreSchema = createSchema({
  date: Type.date(),
  modelId: Type.string(),
  score: Type.number(),
  userId: Type.string(),
});

export const Score = typedModel('Score', ScoreSchema);
