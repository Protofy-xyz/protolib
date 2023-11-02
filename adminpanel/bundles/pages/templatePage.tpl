import { z } from "zod";
import { Protofy, AutoModel, Schema, BaseSchema } from 'protolib/base'
import moment from "moment";

export const Base{{name}}Schema = Schema.object(Protofy("schema", {}))

export const {{name}}Schema = Schema.object({
    ...BaseSchema.shape,
    ...Base{{name}}Schema.shape
});

export type {{name}}Type = z.infer<typeof {{name}}Schema>;
export const {{name}}Model = AutoModel.createDerived<{{name}}Type>("{{name}}Model", {{name}}Schema);