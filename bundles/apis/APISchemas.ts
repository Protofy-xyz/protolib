import { z } from "zod";
import { AutoModel, Schema } from 'protolib/base'

export const APISchema = Schema.object({
    name: Schema.string().id().static().display()
}) 

export type APIType = z.infer<typeof APISchema>;
export const APIModel = AutoModel.createDerived<APIType>("ObjectModel", APISchema);
