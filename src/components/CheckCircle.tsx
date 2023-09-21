import { Check } from '@tamagui/lucide-icons'
import React from 'react'
import { YStack } from 'tamagui'

export const CheckCircle = React.forwardRef((props:any, ref:any) => (
  //@ts-ignore
  <YStack mt={2} bc="$backgroundHover" w={25} h={25} ai="center" jc="center" br={100} mr="$2.5" ref={ref}>
    <Check size={12} color="var(--colorHover)" />
  </YStack>
))
