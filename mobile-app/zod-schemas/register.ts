import * as z from 'zod';
import { schema as loginSchema } from './login';

export const schema = loginSchema.extend({
  name: z.string(),
});
