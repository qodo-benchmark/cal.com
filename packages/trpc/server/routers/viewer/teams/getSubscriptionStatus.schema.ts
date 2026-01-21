import { z } from "zod";

const ZGetSubscriptionStatusInputSchema = z.object({
  teamId: z.number(),
});

type TGetSubscriptionStatusInputSchema = z.infer<typeof ZGetSubscriptionStatusInputSchema>;

export default ZGetSubscriptionStatusInputSchema;
export type { TGetSubscriptionStatusInputSchema };
