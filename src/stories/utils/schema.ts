import { z } from 'zod';

export const IdNameSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
});

export const userSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().min(1),
  website: z.string().min(1),
  phone: z.string(),
  id: z.number().nullable(),
  isActive: z.boolean(),
  selUser: IdNameSchema,
});

export type UserSchema = z.infer<typeof userSchema>;
export type IdNameSchema = z.infer<typeof IdNameSchema>;
