
import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { PageModel } from '.'
import { DataView } from 'protolib'
import { DataTable2, Chip, API, InteractiveIcon } from 'protolib'
import { z } from 'zod'
import { Stack, XStack } from '@my/ui'
import { ExternalLink, Pencil, Layout } from '@tamagui/lucide-icons'
import { usePageParams } from '../../next';
const PageIcons = {}

export default {
    'admin/pages': {
        component: ({ pageState, sourceUrl, initialItems, pageSession, extraData }: any) => {
            const {replace} = usePageParams(pageState)

            return (<AdminPage title="Pages" pageSession={pageSession}>
                <DataView
                    rowIcon={Layout}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="page"
                    columns={DataTable2.columns(
                        DataTable2.column("", "lol", true, (row) => <a href={row.route.startsWith('/')?row.route:'/'+row.route} target='_blank'>
                            <InteractiveIcon Icon={ExternalLink}></InteractiveIcon>
                        </a>, true, '50px'),
                        DataTable2.column("name", "name", true),
                        DataTable2.column("route", "route", true),
                        DataTable2.column("visibility", "protected", true, row => !row.protected ? <Chip text={'public'} color={'$color5'} /> : <Chip text={'protected'} color={'$gray5'} />),
                        DataTable2.column("permissions", "permissions", true, row => row.permissions.map((p,k) => <XStack key={k} ml={k?10:0}><Chip text={p} color={'$gray5'} /></XStack>)),
                    )}
                    extraFieldsFormsAdd={{
                        template: z.union([z.literal("blank"), z.literal("default"), z.literal("admin")]).display().after("route"),
                        object: z.union([z.literal("without object"), ...extraData.objects.filter(o => o.api).map(o => z.literal(o.name))] as any).after('route').display(),
                    }}
                    extraMenuActions = {[
                        {
                            text:"Edit Page file", 
                            icon:Pencil, 
                            action: (element) => { replace('editFile', element.getDefaultFilePath()) },
                            isVisible: (data)=>true}
                    ]}
                    model={PageModel}
                    pageState={pageState}
                    icons={PageIcons}
                />
            </AdminPage>)
        },
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/pages', ['admin'], {}, async () => {
            const objects = await API.get('/adminapi/v1/objects?itemsPerPage=1000')
            return {
                objects: objects.isLoaded ? objects.data.items : []
            }
        })
    }
}