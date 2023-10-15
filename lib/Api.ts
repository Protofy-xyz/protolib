import { PendingAtomResult, getPendingResult } from "./createApiAtom";

const SERVER = process?.env?.API_URL ?? 'http://localhost:8080'

class ApiError extends Error {
    apiError: any;

    constructor(message: string, { data }: { data: any }) {
        super(message);
        this.apiError = data
    }
}

const _fetch = async (urlOrData, data?, update?, plain?):Promise<PendingAtomResult | undefined> => {
    let realUrl;

    if (typeof urlOrData === 'string') {
      realUrl = typeof window === 'undefined' ? (!urlOrData.startsWith('https://') && !urlOrData.startsWith('http://') ? SERVER : '') + urlOrData : urlOrData;
    } else if (typeof urlOrData === 'object' && urlOrData.url) {
      const baseUrl = typeof window === 'undefined' ? (!urlOrData.url.startsWith('https://') && !urlOrData.url.startsWith('http://') ? SERVER : '') + urlOrData.url : urlOrData.url;
      const params = new URLSearchParams();
  
      for (let key in urlOrData) {
        if (key !== 'url') {
          params.append(key, urlOrData[key]);
        }
      }
  
      realUrl = `${baseUrl}?${params.toString()}`;
    } else {
      throw new Error("Invalid params for API");
    }
    const fn = async () => {
        update ? update(getPendingResult('loading')) : null
        try {
            const res = await fetch(realUrl, data? {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) 
            }:undefined);

            
            const resData = !plain ? await res.json() : await res.text()
            if (!res.ok) {
                const err = getPendingResult('error', null, resData)
                if (update) {
                    update(err)
                } else {
                    return err
                }
                return;
            }
            const response = getPendingResult('loaded', resData);
            if (update) {
                update(response)
            } else {
                return response
            }
        } catch (e: any) {
            let errStr = e.apiError ?? e.toString()
            if (e instanceof SyntaxError) {
                console.error(e)
                errStr = 'Server error. Check configuration and network connection.'
            }
            const err = getPendingResult('error', null, errStr)
            if (update) {
                update(err)
            } else {
                return err
            }
        }
    }
    if (update) {
        fn()
    } else {
        return fn()
    }

}
export const API = {
    fetch: _fetch,
    //@ts-ignore
    get: (url, update?, plain?):Promise<PendingAtomResult> => _fetch(url, null, update, plain),
    //@ts-ignore
    post: (url, data, update?, plain?):Promise<PendingAtomResult> => _fetch(url, data, update, plain)
}