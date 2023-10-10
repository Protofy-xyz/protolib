import { z } from "zod";
import {BaseSchema} from 'protolib/base'

const statusSchema = z.union([
    z.literal("running"),
    z.literal("error"),
    z.literal("done"),
    z.literal("pending")
]);

export const BaseEventSchema = z.object({
    path: z.string(), //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
    from: z.string(), // system entity where the event was generated (next, api, cmd...)
    user: z.string(), // the original user that generates the action, 'system' if the event originated in the system itself
    payload: z.any(), // event payload, event-specific data
    created: z.string(), // event date (iso)
    status: statusSchema,
    lastUpdated: z.string() //last event date (iso), the same as created if no updates were made
}) 

export const EventSchema = z.object({
    ...BaseSchema.shape,
    ...BaseEventSchema.shape
});

export type EventType = z.infer<typeof EventSchema>;
