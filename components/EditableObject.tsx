import { Button, Fieldset, Input, Label, Stack, XStack, YStack, Paragraph, Spinner, Text, Dialog, H1, SizableText, StackProps } from "tamagui";
import { Pencil } from '@tamagui/lucide-icons';
import { AsyncView, usePendingEffect, API, Tinted, Notice, getPendingResult, SelectList, SimpleSlider } from 'protolib'
import React, { useEffect, useState } from "react";
import { getErrorMessage } from "@my/ui";
import { ProtoSchema } from "protolib/base";
import { Schema } from "../base";

type EditableObjectProps = {
    initialData?: any,
    sourceUrl: string,
    onSave: Function,
    model: any,
    mode: 'add' | 'edit' | 'view',
    icons?: any,
    extraFields?: any,
    numColumns?: number,
    initialContent: any,
    objectId?: string,
    title?: any,
    loadingText?: any,
    loadingTop?: number,
    spinnerSize?: number,
    name?: string
}

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

const FormElement = ({ ele, i, icon, children }) => {
    return <Fieldset ml={!i ? "$0" : "$5"} key={i} gap="$2" f={1}>
        <Label>
            <Tinted>
                <Stack mr="$2">{React.createElement(icon, { color: "var(--color9)", size: "$1", strokeWidth: 1 })}</Stack>
            </Tinted>
            {ele._def.label ?? ele.name}
        </Label>
        {children}
    </Fieldset>
}

export const EditableObject = ({ name, initialData, loadingTop, spinnerSize, loadingText, title, sourceUrl=null, onSave, mode = 'view', model, icons = {}, extraFields, numColumns = 1, objectId, ...props }: EditableObjectProps & StackProps) => {
    const [originalData, setOriginalData] = useState(initialData ?? getPendingResult('pending'))
    const [data, setData] = useState(mode == 'add' ? {} : undefined)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>()

    usePendingEffect((s) => { mode != 'add' && API.get(sourceUrl, s) }, setOriginalData, initialData)
    useEffect(() => { originalData.data && setData(originalData.data) }, [originalData])

    const elementObj = model.load(data)

    const extraFieldsObject = ProtoSchema.load(Schema.object(extraFields))
    const formFields = elementObj.getObjectSchema().is('display').merge(extraFieldsObject).getLayout(numColumns)
    const getElement = (ele, icon, i, x, path = []) => {
        const elementDef = ele._def
   
        const setFormData = (key, value) => {
            console.log('set form data: ', key, value, path);
            console.log('before: ', data);

            const formData = { ...data };
            let target = formData;

            path.forEach((p) => {
                if (!target.hasOwnProperty(p)) {
                    target[p] = {};
                } 
                target = target[p];
            });

            target[key] = value;
        
            console.log('after: ', formData);
            setData(formData);
        }

        const getFormData = (key) => {
            let target = data ?? {};

            for (const p of path) {
                if ((typeof target === 'object' && target.hasOwnProperty(p)) ||
                    (Array.isArray(target) && target.length > p)) {
                    target = target[p];
                }
            }
            if(typeof target === 'string') {
                return target
            }
            // Retorna el valor de ele.name o un valor predeterminado.
            return target && target[key] ? target[key] : '';
        }

        if (elementDef.typeName == 'ZodUnion') {
            const _rawOptions = elementDef.options.map(o => o._def.value)
            const options = elementDef.displayOptions ? elementDef.displayOptions : elementDef.options.map(o => o._def.value)
            return <FormElement ele={ele} icon={icon} i={i}>
                <SelectList f={1} title={ele.name} elements={options} value={getFormData(ele.name)} setValue={(v) => setFormData(ele.name, _rawOptions[options.indexOf(v)])} />
            </FormElement>
        } else if (elementDef.typeName == 'ZodNumber') {
            if (elementDef.checks) {
                const min = elementDef.checks.find(c => c.kind == 'min')
                const max = elementDef.checks.find(c => c.kind == 'max')
                if (min && max) {
                    return <FormElement ele={ele} icon={icon} i={i}>
                        <Tinted>
                            <Stack f={1} mt="$4">
                                <SimpleSlider onValueChange={v => setFormData(ele.name, v)} value={[getFormData(ele.name) ?? min.value]} width={190} min={min.value} max={max.value} />
                            </Stack>
                        </Tinted>
                    </FormElement>
                }
            }
        } else if (elementDef.typeName == 'ZodObject') {
            return <YStack br="$3" bw={1} boc={"$gray6"} f={1} p={"$5"}>
                <Stack alignSelf="flex-start" backgroundColor={"$background"} px="$2" left={10} pos="absolute" top={-13}><SizableText >{typeof ele.name === "number"? '': ele.name}</SizableText></Stack>
                {Object.keys(ele._def.shape()).map((s, i) => {
                    const shape = ele._def.shape();
                    return <Stack mt={i?"$5":"$0"}>{getElement({ ...shape[s], name: s }, icon, 0, 0, [...path, ele.name])}</Stack>
                })}
            </YStack>
        } else if (elementDef.typeName == 'ZodArray') {
            // console.log('array ele: ', ele)
            const arrData = getFormData(ele.name) ? getFormData(ele.name) : []
            console.log('arr data: ', arrData);
            return <YStack br="$3" bw={1} boc={"$gray6"} f={1} p={"$5"}>
                <Stack alignSelf="flex-start" backgroundColor={"$background"} px="$2" left={-7} top={-37}>
                    <SizableText >{ele.name + ' (' + arrData.length + ')'}</SizableText>
                </Stack>
                
                {
                    arrData.map((d, i) => {
                        return <Stack top={-20} mt={i?"$5":0}>{getElement({ ...elementDef.type._def, _def:elementDef.type._def, name: i }, icon, 0, 0, [...path, ele.name, i])}</Stack>
                    })
                }
                
                <Button onPress={() => {
                    console.log('voy a agregar: ', ele.name, arrData)
                    setFormData(ele.name, [...arrData, {}])
                }}>Add {ele.name}</Button>
            </YStack>
        }

        return <FormElement ele={ele} icon={icon} i={i}>
            <Stack f={1}>
                <Input
                    focusStyle={{ outlineWidth: 1 }}
                    disabled={mode == 'edit' && ele._def.static}
                    secureTextEntry={ele._def.secret}
                    value={getFormData(ele.name)}
                    onChangeText={(t) => setFormData(ele.name, ele._def.typeName == 'ZodNumber' ? parseFloat(t) : t)}
                    placeholder={!data ? '' : ele._def.hint ?? ele._def.label ?? ele.name}
                    autoFocus={x == 0 && i == 0}>
                </Input>
            </Stack>
        </FormElement>
    }

    return <Stack {...props}>
        <AsyncView forceLoad={mode == 'add'} waitForLoading={1000} spinnerSize={spinnerSize} loadingText={loadingText ?? "Loading " + objectId} top={loadingTop ?? -30} atom={originalData}>
            {title ?? <Dialog.Title><Text><Tinted><Text color="$color9">{capitalize(mode)}</Text></Tinted><Text color="$color11"> {capitalize(name)}</Text></Text></Dialog.Title>}
            <YStack width="100%" f={1} mt={"$7"} ai="center" jc="center">
                {error && (
                    <Notice>
                        <Paragraph>{getErrorMessage(error.error)}</Paragraph>
                    </Notice>
                )}
                <YStack width="100%" f={1} jc="center">
                    {
                        formFields.map((row, x) => <XStack f={1} key={x} mb={x != formFields.length - 1 ? '$5' : '$0'}>
                            {
                                row.map((ele, i) => {
                                    const icon = icons[ele.name] ? icons[ele.name] : Pencil
                                    return getElement(ele, icon, i, x)
                                })
                            }
                        </XStack>)
                    }
                </YStack>
                <YStack mt="$8" p="$2" pt="$0" width="100%" f={1} alignSelf="center">
                    <Tinted>
                        <Button f={1} onPress={async () => {
                            console.log('final data: ', data)
                            setLoading(true)
                            try {
                                await onSave(originalData.data, data)
                            } catch (e) {
                                setError(e)
                                console.log('e: ', e)
                            }
                            setLoading(false)
                        }}>
                            {loading ? <Spinner /> : mode == 'add' ? 'Create' : 'Save'}
                        </Button>
                    </Tinted>
                </YStack>
            </YStack>
        </AsyncView>
    </Stack>
}