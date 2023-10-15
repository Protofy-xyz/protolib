export * from './AdminPage'
import {SSR as _SSR} from 'app/conf' 
import { NextPageContext } from 'next'
import { API, withSession } from 'protolib'

export function DataSSR(sourceUrl, allowdUserTypes=['admin'], props={}) {
    return _SSR(async (context:NextPageContext) => {
        return withSession(context, allowdUserTypes, {
          workspace: await API.get('/adminapi/v1/workspaces'),
          pageState: {
            sourceUrl,
            initialItems: await API.get({url: sourceUrl, ...props}),
            ...props,
          }
        })
    })
}

export function PaginatedDataSSR(sourceUrl: string|Function,allowdUserTypes=['admin'], props:any={}) {
  return _SSR(async (context:NextPageContext) => {
    const dataProps = {
      itemsPerPage: parseInt(context.query.itemsPerPage as string) ? parseInt(context.query.itemsPerPage as string) : 25,
      page: parseInt(context.query.page as string, 10) ? parseInt(context.query.page as string, 10) : 0,
      search: context.query.search ?? '',
      orderBy: context.query.orderBy ?? '',
      orderDirection: context.query.orderDirection ?? '',
      view: context.query.view?? 'list',
      item: context.query.item?? '',
      ...(typeof props === "function"? await props() : props),
    }
    const _sourceUrl = typeof sourceUrl === 'function' ? sourceUrl(context) : sourceUrl
    return withSession(context, allowdUserTypes, {
      workspace: await API.get('/adminapi/v1/workspaces'),
      sourceUrl: _sourceUrl,
      initialItems: await API.get({url: _sourceUrl, ...dataProps}),
      itemData: context.query.item ? await API.get(_sourceUrl+'/'+context.query.item) : '',
      route: context.query.name,
      pageState: {
        ...dataProps,
      }
    })
  })
}