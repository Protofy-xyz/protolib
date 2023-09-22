import ActiveGroup from '../components/ActiveGroup'
import ActiveGroupButton from '../components/ActiveGroupButton'
import ActiveRender from '../components/ActiveRender'
import AnounceBubble from '../components/AnounceBubble'
import AsyncView from '../components/AsyncView'
import BackgroundGradient from '../components/BackgroundGradient'
import BarChart from '../components/BarChart'
import BigTitle from '../components/BigTitle'
import BlockTitle from '../components/BlockTitle'
import ButtonGroup from '../components/ButtonGroup'
import ButtonSimple from '../components/ButtonSimple'
import Center from '../components/Center'
import { CheckCircle } from '../components/CheckCircle'
import { Code, CodeInline } from '../components/Code'
import { ColorToggleButton } from '../components/ColorToggleButton'
import { Container, ContainerLarge, ContainerXL } from '../components/Container'
import { CopyBubble } from '../components/CopyBubble'
import { DataCard } from '../components/DataCard'
import { DataTable } from '../components/DataTable'
import EditableText from '../components/EditableText'
import ElevatedArea from '../components/ElevatedArea'
//import { ErrorBoundary } from '../components/ErrorBoundary'
import ErrorMessage from '../components/ErrorMessage'
import FeatureItem from '../components/FeatureItem'
import { FancyCard } from '../components/FancyCard'
import { Grid } from '../components/Grid'
import GridElement from '../components/GridElement'
import { Head1 } from '../components/Head1'
import { Head2 } from '../components/Head2'
import { Head3 } from '../components/Head3'
import { HeaderLink } from '../components/HeaderLink'
import HorizontalBox from '../components/HorizontalBox'
import { HR } from '../components/HR'
import { IconStack } from '../components/IconStack'
import { ItemCard } from '../components/ItemCard'
import { ButtonLink, Link, ParagraphLink } from '../components/Link'
import { LinkGroup, LinkGroupItem } from '../components/LinkGroup'
import { Logo } from '../components/Logo'
import { LogoIcon } from '../components/LogoIcon'
import MainButton from '../components/MainButton'
import { NextLink } from '../components/NextLink'
import { Notice } from '../components/Notice'
import OverlayCard from '../components/OverlayCard'
import OverlayCardBasic from '../components/OverlayCardBasic'
import Page from '../components/Page'
import { PageGlow } from '../components/PageGlow'
import { PanelMenuItem } from '../components/PanelMenuItem'
import { Pre } from '../components/Pre'
import RainbowText from '../components/RainbowText'
import { Search } from '../components/Search'
import Section from '../components/Section'
import SectionBlock, { TitleLink } from '../components/SectionBlock'
import SideBySide from '../components/SideBySide'
import SpotLight from '../components/SpotLight'
import { SubTitle } from '../components/SubTitle'
import TabGroup from '../components/TabGroup'
import { TamaCard } from '../components/TamaCard'
import { ThemeToggle } from '../components/ThemeToggle'
import { TintSection, HomeSection, useTintSectionIndex } from '../components/TintSection'
import TooltipContainer from '../components/TooltipContainer'
import { UL } from '../components/UL'
//import { unwrapText } from '../components/unwrapText'
import XCenterStack from '../components/XCenterStack'
import { getComponentWrapper, BasicPlaceHolder } from './visualuiWrapper'

const cw = getComponentWrapper({
  moduleSpecifier: 'protolib',
  namedImports: [{ alias: undefined }]
  // defaultImport: componentName
})

export default {
  ...cw(ActiveGroup, 'EyeOff', 'ActiveGroup', {}, {}, { children: <BasicPlaceHolder /> }),
  ...cw(ActiveGroupButton, 'EyeOff', 'ActiveGroupButton'),
  ...cw(ActiveRender, 'EyeOff', 'ActiveRender'),
  ...cw(AnounceBubble, 'Tv2', 'AnounceBubble', { href: "/hello", children: "hello" }),
  ...cw(AsyncView, 'EyeOff', 'AsyncView'),
  ...cw(BackgroundGradient, 'Scroll', 'BackgroundGradient'),
  ...cw(BarChart, 'BarChartHorizontalBig', 'BarChart', {
    data: [
      { color: '$pink9', name: 'one', value: 0.12 },
      { color: '$purple9', name: 'two', value: 0.063 },
      { color: '$blue9', name: 'three', value: 0.108 },
      { color: '$orange9', name: 'four', value: 0.73 }
    ],
    large: true,
    animatedEnter: false,
    selectedElement: 'two'
  }),
  ...cw(BigTitle, 'Type', 'BigTitle', { children: "hello" }),
  ...cw(BlockTitle, 'Text', 'BlockTitle', { title: "hello", subtitle: "world" }),
  ...cw(ButtonGroup, 'EyeOff', 'ButtonGroup', {}, {}, { children: <BasicPlaceHolder /> }),
  ...cw(ButtonLink, 'ExternalLink', 'ButtonLink', { href: "/hello", children: "hello" }),
  ...cw(ButtonSimple, 'MousePointerSquare', 'ButtonSimple', { children: "hello" }),
  ...cw(Center, 'AlignVerticalSpaceAround', 'Center', {}, {}, { children: <BasicPlaceHolder /> }),
  ...cw(CheckCircle, 'Check', 'CheckCircle'),
  ...cw(Code, 'Code', 'Code', { children: "helloworld" }),
  ...cw(CodeInline, 'Terminal', 'CodeInLine', { children: "helloworld" }),
  ...cw(ColorToggleButton, 'ToggleRight', 'ColorToggleButton'),
  ...cw(Container, 'Box', 'Container'),
  ...cw(ContainerLarge, 'Package', 'ContainerLarge'),
  ...cw(ContainerXL, 'Container', 'ContainerXL'),
  ...cw(CopyBubble, 'Copy', 'CopyBubble', { text: "copy" }),
  ...cw(DataCard, 'CreditCard', 'DataCard', { name: "hello title", maxWidth: "300px", json: { "name": "hello", "surname": "world" } }),
  ...cw(DataTable, 'Table2', 'DataTable', { title: "hello", rows: [['hello', 'world'], ['world', 'hello']] }),
  ...cw(EditableText, 'PencilLine', 'EditableText', { description: "hello", text: "world" }),
  ...cw(ElevatedArea, 'GalleryThumbnails', 'ElevatedArea'),
  ...cw(ErrorMessage, 'AlertTriangle', 'ErrorMessage'),
  ...cw(FeatureItem, 'CheckCircle2', 'FeatureItem', { label: "hello", children: "world" }),
  ...cw(FancyCard, 'SquareAsterisk', 'FancyCard'),
  ...cw(Grid, 'LayoutGrid', 'Grid'),
  ...cw(GridElement, 'LayoutGrid', 'GridElement', { title: "hello", children: "world" }),
  ...cw(Head1, 'Heading1', 'Head1', { children: "hello" }),
  ...cw(Head2, 'Heading2', 'Head2', { children: "hello" }),
  ...cw(Head3, 'Heading3', 'Head3', { children: "hello" }),
  ...cw(HeaderLink, 'Link2', 'HeaderLink', { href: "/hello", children: "hello" }),
  ...cw(HorizontalBox, 'RectangleHorizontal', 'HorizontalBox'),
  ...cw(HR, 'MinusSquare', 'HR'),
  ...cw(IconStack, 'SquareStack', 'IconStack'),
  ...cw(ItemCard, 'CreditCard', 'ItemCard', { children: "hello world!" }),
  ...cw(Link, 'Link', 'Link', { href: "/hello", children: "hello" }),
  ...cw(LinkGroup, 'Group', 'LinkGroup', { href: "/hello", children: "hello" }),
  ...cw(LinkGroupItem, 'Puzzle', 'LinkGroupItem', { href: "/hello", children: "hello" }),
  ...cw(ParagraphLink, 'Link', 'ParagraphLink', { href: "/hello", children: "hello" }),
  ...cw(Logo, 'Cherry', 'Logo', { text: "protofy" }),
  ...cw(LogoIcon, 'Hexagon', 'LogoIcon', { children: "hello world!" }),
  ...cw(MainButton, 'MousePointerSquare', 'MainButton', { children: "hello world!" }),
  ...cw(NextLink, 'EyeOff', 'NextLink', { href: "/hello", children: "hello" }),
  ...cw(Notice, 'Globe2', 'Notice', { children: "Hello world!" }),
  ...cw(OverlayCard, 'CreditCard', 'OverlayCard', {}, {}, { children: <BasicPlaceHolder /> }),
  ...cw(OverlayCardBasic, 'CreditCard', 'OverlayCardBasic', {
    title: "Hello",
    subtitle: "Hello World!",
    caption: "go",
    href: "http://google.com"
  }),
  ...cw(Page, 'EyeOff', 'Page', {}, {
    canDrag: () => false
  }, { children: <BasicPlaceHolder /> }),
  ...cw(PageGlow, 'EyeOff', 'PageGlow'),
  ...cw(PanelMenuItem, 'Puzzle', 'PanelMenuItem', { text: "hello world" }),
  ...cw(Pre, 'EyeOff', 'Pre'),
  ...cw(RainbowText, 'Rainbow', 'RainbowText', { children: "hello world" }),
  ...cw(Search, 'Search', 'Search'),
  ...cw(Section, 'EyeOff', 'Section'),
  ...cw(SectionBlock, 'BoxSelect', 'SectionBlock'),
  ...cw(TitleLink, 'Link', 'TitleLink', { href: "/hello", children: "hello" }),
  ...cw(SideBySide, 'PanelLeftInactive', 'SideBySide'),
  ...cw(SpotLight, 'Sun', 'SpotLight'),
  ...cw(SubTitle, 'Type', 'SubTitle', { children: "hello world" }),
  ...cw(TabGroup, 'Group', 'TabGroup', { title: "hello" }),
  ...cw(TamaCard, 'CreditCard', 'TamaCard', {
    title: "hello title",
    description: "description",
    children: "Lorem ipsum dolor sit amet"
  }),
  ...cw(ThemeToggle, 'Palette', 'ThemeToggle', { chromeless: true }),
  ...cw(TintSection, 'BoxSelect', 'TintSection'),
  ...cw(HomeSection, 'BoxSelect', 'HomeSection'),
  ...cw(TooltipContainer, 'BoxSelect', 'TooltipContainer', { tooltipText: "Hello" }),
  ...cw(UL, 'MessageCircle', 'UL', { children: "hello world" }),
  ...cw(XCenterStack, 'AlignVerticalSpaceAround', 'XCenterStack')
}

