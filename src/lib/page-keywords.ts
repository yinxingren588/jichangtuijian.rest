// Use the page's own subject, rather than repeating the site's core terms everywhere.
export function subjectKeywords(title:string,tags:readonly string[]=[]):string[] {
 const phrases=title.split(/[｜|：:，,、？?·]/u).map(value=>value.trim()).filter(value=>value.length>=2&&!/^第\s*\d+\s*页$/u.test(value)&&!/^(怎样|如何|应该|为什么|是否|怎么).{0,6}$/u.test(value));
 const candidates=[...phrases,...tags];
 const seen=new Set<string>();
 return candidates.filter(value=>{const key=value.toLowerCase().replace(/\s+/g,'');if(!key||seen.has(key))return false;seen.add(key);return true;}).slice(0,6);
}
