export function changedUrls(current:Record<string,string>,previous:Record<string,string>){return Object.keys(current).filter(url=>current[url]!==previous[url]);}
export function validateUrls(urls:string[],allowed:Record<string,string>,origin:string){for(const url of urls){const parsed=new URL(url);if(parsed.origin!==origin||parsed.search||parsed.hash||!(url in allowed))throw Error('URL is not an indexable production URL: '+url);}return [...new Set(urls)];}
export function indexNowResponseAction(status:number,body:string):'accepted'|'verification-pending'|'retry'|'rejected' {
 if(status===200||status===202)return 'accepted';
 if(status===403){try{if(JSON.parse(body).errorCode==='SiteVerificationNotCompleted')return 'verification-pending';}catch{/* Other 403 responses remain permanent rejections. */}}
 return status===429||status>=500?'retry':'rejected';
}
