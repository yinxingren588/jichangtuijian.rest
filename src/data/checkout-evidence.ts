import raw from './checkout-evidence.json';
export interface CheckoutEvidence {status:'awaiting-evidence'|'recorded';checkedAt:string|null;planName:string|null;billingPeriod:string|null;currency:string|null;originalAmount:number|null;finalAmount:number|null;appliedCoupon:string|null;renewalAmount:number|null;conditions:string|null;image:string|null;sourceUrl:string|null}
export const checkoutEvidence=raw as Record<string,CheckoutEvidence>;
export function validateCheckoutEvidence(record:CheckoutEvidence,slug:string):CheckoutEvidence {
 if(record.status==='recorded'&&(!record.checkedAt||!record.planName||!record.billingPeriod||!record.currency||record.originalAmount===null||record.finalAmount===null||!record.image||!record.conditions))throw Error('Incomplete checkout evidence: '+slug);
 if(record.image&&!record.image.startsWith('/checkout-evidence/'))throw Error('Checkout image must use the reviewed local evidence directory');
 if(record.image&&(record.image.includes('..')||!/^\/checkout-evidence\/[a-zA-Z0-9_/-]+\.(png|webp|jpg|jpeg)$/.test(record.image)))throw Error('Invalid checkout evidence image path');
 for(const value of [record.originalAmount,record.finalAmount,record.renewalAmount])if(value!==null&&(!Number.isFinite(value)||value<0))throw Error('Invalid checkout amount');
 if(record.checkedAt&&(!/^\d{4}-\d{2}-\d{2}$/.test(record.checkedAt)||!Number.isFinite(Date.parse(record.checkedAt))||new Date(record.checkedAt).toISOString().slice(0,10)!==record.checkedAt))throw Error('Invalid checkout date');
 if(record.currency&&!/^[A-Z]{3}$/.test(record.currency))throw Error('Invalid checkout currency');
 if(record.sourceUrl){const url=new URL(record.sourceUrl);if(url.protocol!=='https:'||url.username||url.password)throw Error('Invalid checkout source URL');}
 return record;
}
export function checkoutForBrand(slug:string):CheckoutEvidence {
 const record=checkoutEvidence[slug];if(!record)throw Error('Missing checkout record: '+slug);
 return validateCheckoutEvidence(record,slug);
}
