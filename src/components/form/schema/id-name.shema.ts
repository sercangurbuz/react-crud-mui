import { z } from 'zod';

const idNameSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export default idNameSchema;
