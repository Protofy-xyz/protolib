import { YStack, ScrollView, Theme, XStack } from 'tamagui'
import {AppBar, useTint} from 'protolib'
import { useThemeSetting } from '@tamagui/next-theme'

export const PanelLayout = ({panelBgColor=undefined, menuContent, children, SideMenu, Layout, headerContents, HeaderMenu}) => {
    const appBarHeight = 55
    const { tint, setNextTint } = useTint()
    const { resolvedTheme } = useThemeSetting()
    const isDark = resolvedTheme == 'dark'
    const bgPanels = '$gray2'//isDark ? '$color1': '$'+tint+'2'
    const _panelBgColor = isDark ? '$color2' : '$color1'
    console.log('bgpanels: ', bgPanels)
    return (
      <Layout
        header={
          <AppBar 
            height={appBarHeight} 
            fullscreen={true} 
            dettached={false} 
            translucid={false} 
            position="top"
            backgroundColor={bgPanels}
          >
            {headerContents}
          </AppBar>
        } 
        sideMenu={<SideMenu mt={appBarHeight} sideBarColor={bgPanels}>{menuContent}</SideMenu>}
        footer={
          null
          // <AppBar dettached={false} translucid={false} position="bottom">
          //   <HeaderContents menuPlacement={"top"} />
          // </AppBar>
        }>
        {/* <Theme name={tint as any}> */}
        <XStack f={1} p="$3" bc={bgPanels}>
          <XStack bc={bgPanels} elevation={3} br={"$6"} mt={appBarHeight} f={1} height={'calc(100vh - '+(appBarHeight+30)+'px)'}>
            <ScrollView $sm={{br:"$0"}} height={'calc(100vh - '+(appBarHeight+30)+'px)'}>
              {/* <Tinted> */}
                <YStack br={"$6"} bc={panelBgColor ?? _panelBgColor} f={1} minHeight={'calc(100vh - '+(appBarHeight+30)+'px)'} flex={1}>
                  {/* <Theme reset> */}
                    {children}
                  {/* </Theme> */}

                </YStack>
              {/* </Tinted> */}
            </ScrollView>
          </XStack>
        {/* </Theme> */}
        </XStack>
      </Layout>
    )
}
