import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid';

initSchemaSystem()
export const Schema = z

const onEvent = (that, eventName: string, eventHandler: string, eventContext?: 'client' | 'server' | undefined, eventParams?: any) => {
    if (!that._def.events) {
        that._def.events = []
    }
    that._def.events.push({
        eventName: eventName,
        eventHandler,
        eventContext: eventContext ?? 'server',
        eventParams
    })
    return that
}

function extendZodTypePrototype(type: any) {
    type.prototype.label = function (caption: string) {
        this._def.label = caption;
        return this;
    };

    type.prototype.hint = function (hintText: string) {
        this._def.hint = hintText;
        return this;
    };

    type.prototype.name = function (key: string) {
        this._def.keyName = key;
        return this;
    };

    type.prototype.display = function (views: string[] | undefined) {
        this._def.display = !views ? ['*'] : views;
        return this;
    };

    type.prototype.generate = function (val, force?) {
        this._def.generate = { generator: val, force };
        return this;
    };

    type.prototype.before = function (val) {
        this._def.before = val;
        return this;
    };

    type.prototype.after = function (val) {
        this._def.after = val;
        return this;
    };

    type.prototype.dependsOn = function (field, value) {
        this._def.dependsOn = field
        this._def.dependsOnValue = value;
        return this;
    }

    type.prototype.help = function (val) {
        this._def.help = val
        return this;
    }

    type.prototype.generateOptions = function (call) {
        this._def.generateOptions = call
        return this;
    }

    type.prototype.choices = function () {
        this._def.choices = true
        return this;
    }

    type.prototype.displayOptions = function (options) {
        this._def.displayOptions = options;
        return this;
    };

    type.prototype.secret = function () {
        this._def.secret = true;
        return this;
    };

    type.prototype.static = function () {
        this._def.static = true;
        return this;
    };

    type.prototype.id = function () {
        this._def.id = true;
        return this;
    };

    type.prototype.search = function () {
        this._def.search = true;
        return this;
    };

    type.prototype.size = function (size) {
        this._def.size = size;
        return this;
    };

    type.prototype.group = function (group: number) {
        this._def.group = group;
        return this;
    };

    type.prototype.on = function (eventName: string, eventHandler: string, eventContext?: 'client' | 'server' | undefined, eventParams?: any) {
        return onEvent(this, eventName, eventHandler, eventContext, eventParams)
    }

    type.prototype.onList = function (eventHandler: string, eventContext?: 'client' | 'server' | undefined, eventParams?: any) {
        return onEvent(this, 'list', eventHandler, eventContext, eventParams)
    }

    type.prototype.onCreate = function (eventHandler: string, eventContext?: 'client' | 'server' | undefined, eventParams?: any) {
        return onEvent(this, 'create', eventHandler, eventContext, eventParams)
    };

    type.prototype.onRead = function (eventHandler: string, eventContext?: 'client' | 'server' | undefined, eventParams?: any) {
        return onEvent(this, 'read', eventHandler, eventContext, eventParams)
    }

    type.prototype.onUpdate = function (eventHandler: string, eventContext?: 'client' | 'server' | undefined, eventParams?: any) {
        return onEvent(this, 'update', eventHandler, eventContext, eventParams)
    }

    type.prototype.onDelete = function (eventHandler: string, eventContext?: 'client' | 'server' | undefined, eventParams?: any) {
        return onEvent(this, 'delete', eventHandler, eventContext, eventParams)
    }
}

// Extiende el prototipo general de todos los tipos de Zod
export function initSchemaSystem() {
    const zodTypes = [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray, z.ZodAny, z.ZodOptional, z.ZodArray, z.ZodUnion, z.ZodObject, z.ZodRecord];

    zodTypes.forEach(type => extendZodTypePrototype(type));
}

export const BaseSchema = Schema.object({
    id: z.string().generate(() => uuidv4()).id(),
    _deleted: z.boolean().optional(),
})

