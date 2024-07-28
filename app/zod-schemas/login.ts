import * as z from 'zod';

export const schema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});
