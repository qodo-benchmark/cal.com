import { z } from "zod";

import { eventTypeMetaDataSchemaWithoutApps } from "@calcom/prisma/zod-utils";

import { appDataSchemas } from "./apps.schemas.generated";

const EventTypeAppMetadataSchema = z.object(appDataSchemas).partial();
export type EventTypeAppMetadataSchema = z.infer<typeof EventTypeAppMetadataSchema>;
export const eventTypeAppMetadataOptionalSchema = EventTypeAppMetadataSchema.optional();

export const eventTypeMetaDataSchemaWithTypedApps = eventTypeMetaDataSchemaWithoutApps
  .unwrap()
  .merge(
    z.object({
      apps: eventTypeAppMetadataOptionalSchema,
    })
  )
  .nullable();
