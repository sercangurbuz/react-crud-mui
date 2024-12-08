import { z } from 'zod';

const idNameSchema = z.object({
  id: z.number(),
  name: z.string().nullish(),
});

export default idNameSchema;
