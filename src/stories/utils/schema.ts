import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().min(1),
  website: z.string().min(1),
  phone: z.string(),
  id: z.number().nullable(),
});

export type UserSchema = z.infer<typeof userSchema>;
