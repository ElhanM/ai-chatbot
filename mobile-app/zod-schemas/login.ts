import * as z from 'zod';

export const schema = z.object({
  email: z.string().email('Please type in a valid email'),
  password: z.string(),
});
