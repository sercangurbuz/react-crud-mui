import { z } from 'zod';

export const IdNameSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
});

export const userSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().min(1, { message: 'Email is missing' }),
  website: z.string().min(1, { message: 'Website is missing' }),
  phone: z.string(),
  id: z.number().nullable(),
  isActive: z.boolean().nullish(),
  address: z
    .object({
      street: z.string(),
      suite: z.string(),
      city: z.string(),
      zipcode: z.string(),
    })
    .nullable(),
});

export type UserSchema = z.infer<typeof userSchema>;
export type IdNameSchema = z.infer<typeof IdNameSchema>;
