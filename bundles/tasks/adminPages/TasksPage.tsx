
import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { TaskModel } from '../models/Task'
import { DataView, DataTable2, Chip, API } from 'protolib'
import { useRouter } from "next/router"
import { Pencil, Zap, Play } from '@tamagui/lucide-icons';
import { usePageParams } from '../../../next';
import { Spinner } from 'tamagui';

export const TasksPage = {
    component: ({ pageState, sourceUrl, initialItems, pageSession }: any) => {
        const router = useRouter()

        const { replace } = usePageParams(pageState)
        return (<AdminPage title="Tasks" pageSession={pageSession}>
            <DataView
                integratedChat
                disableViews={['grid']}
                defaultView={'list'}
                sourceUrl={sourceUrl}
                initialItems={initialItems}
                numColumnsForm={1}
                openMode={"view"}
                name="task"
                rowIcon={Zap}
                columns={DataTable2.columns(
                    DataTable2.column("name", "name", true, undefined, true, '350px'),
                    DataTable2.column("api", "api", true, row => <Chip text={row.api ? 'yes' : 'no'} color={row.api ? '$color5' : '$gray5'} />, true),
                    DataTable2.column("api route", "apiRoute", true, undefined, true, '350px'),
                    DataTable2.column("num. executions", "numExecutions", true, undefined, true, '150px'),
                    DataTable2.column("status", "status", true, row => <Chip loading={row.status == 'running'} text={row.status + ((row.numRunning > 1 ? ' (' + row.numRunning + ')' : ''))} color={row.status == 'running' ? '$color5' : '$gray5'} />)
                    // DataTable2.column("type", "type", true, row => <Chip text={row.type.toUpperCase()} color={row.type == 'admin' ? '$color5':'$gray5'} />),
                    // DataTable2.column("from", "from", true, row => <Chip text={row.from?.toUpperCase()} color={row.from == 'cmd' ? '$blue5':'$gray5'} />),
                    // DataTable2.column("created", "createdAt", true, row => moment(row.createdAt).format(format)),
                    // DataTable2.column("last login", "lastLogin",true, row => row.lastLogin ? <Chip text={moment(row.lastLogin).format(format)} color={'$gray5'} /> : <Chip text={'NEVER'} color={'$yellow6'} /> )
                )}
                // hideAdd={true}
                extraMenuActions={[
                    {
                        text: "Run task",
                        icon: Play,
                        action: (element) => { alert("run!") },
                        isVisible: (data) => true
                    },
                    {
                        text: "Edit Task file",
                        icon: Pencil,
                        action: (element) => { replace('editFile', element.getDefaultFilePath()) },
                        isVisible: (data) => true
                    }

                ]}
                model={TaskModel}
                pageState={pageState}
                icons={{}}
            />
        </AdminPage>)
    },
    getServerSideProps: PaginatedDataSSR('/adminapi/v1/tasks', ['admin'], {
        orderBy: 'status',
        orderDirection: 'desc'
    })
}