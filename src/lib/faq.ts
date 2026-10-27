export interface FaqItem {id?:string;question:string;answer:string;links?:{title:string;url:string}[];category?:string}
export function faqSchema(items:FaqItem[]) {
 if(!items.length||new Set(items.map(q=>q.question)).size!==items.length||items.some(q=>!q.question.trim()||!q.answer.trim()))throw Error('FAQ needs distinct complete visible questions and answers');
 return {'@type':'FAQPage',mainEntity:items.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))};
}
