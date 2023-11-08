import { z } from "zod";
import { Protofy } from 'protolib/base'
import { Schema, BaseSchema } from 'protolib/base'
import moment from "moment";
import { AutoModel } from 'protolib/base'

export const BaseEventSchema = z.object(Protofy("schema", {
    path: z.string().search().display(), //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
    from: z.string().search().display(), // system entity where the event was generated (next, api, cmd...)
    user: z.string().generate((obj) => 'me').search(), // the original user that generates the action, 'system' if the event originated in the system itself
    payload: z.record(z.string(), z.any()).search().display(), // event payload, event-specific data
    created: z.string().generate((obj) => moment().toISOString()).search(), // event date (iso)
}))

export const EventSchema = z.object({
    ...BaseSchema.shape,
    ...BaseEventSchema.shape
});

export type EventType = z.infer<typeof EventSchema>;
export const EventModel = AutoModel.createDerived<EventType>("EventModel", EventSchema);
