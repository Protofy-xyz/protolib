import { Popover, Stack, XStack, YStack, Text } from "tamagui"
import { AlertDialog, API } from 'protolib'
import { useState } from "react";
import { Tinted } from "./Tinted";
import { MoreVertical, Trash2 } from '@tamagui/lucide-icons'


export const ItemMenu = ({sourceUrl, onDelete}) => {
    const [menuOpened, setMenuOpened] = useState(false)
    const [open, setOpen] = useState(false)

    return <>
        <AlertDialog
            acceptCaption="Delete"
            setOpen={setOpen}
            open={open}
            onAccept={async (setOpen) => {
                await API.get(sourceUrl + '/delete')
                await onDelete(sourceUrl)
                setOpen(false)
            }}
            title={'Delete '}
            description={"Are you sure want to delete this item?"}
            w={280}
        >
            <YStack f={1} jc="center" ai="center">
                
            </YStack>
        </AlertDialog>
        <Popover onOpenChange={setMenuOpened} open={menuOpened} placement="bottom">
            <Popover.Trigger>
                <XStack cursor="pointer" onPress={(e) => {e.stopPropagation();setMenuOpened(true)}}>
                    <Stack ml={"$3"}
                        o={0.5}
                        br={"$5"} p={"$2"}
                        als="flex-start" cursor='pointer'
                        pressStyle={{ o: 0.7 }}
                        hoverStyle={{ o: 1, bc: "$color5" }}>
                        <MoreVertical size={18} color={'var(--color9)'} strokeWidth={2}></MoreVertical>
                    </Stack>
                </XStack>
            </Popover.Trigger>
            <Popover.Content padding={0} space={0} left={"$7"} top={"$2"} bw={1} boc="$borderColor" bc={"$color1"} >
                <Tinted>
                    <YStack alignItems="center" justifyContent="center" padding={"$3"} paddingVertical={"$3"}>
                        <XStack>
                            <XStack ml={"$1"} o={1} br={"$5"} p={"$3"} als="flex-start" cursor='pointer' pressStyle={{ o: 0.7 }} hoverStyle={{ bc: "$color5" }}
                                onPress={(e) => { e.stopPropagation(); setOpen(true); setMenuOpened(false) }}>
                                <Text mr={"$3"} >Delete</Text>
                                <Trash2 size={"$1"} color="var(--color9)" strokeWidth={2} />
                            </XStack>
                        </XStack>
                    </YStack>
                </Tinted>
            </Popover.Content>
        </Popover>
    </>
}