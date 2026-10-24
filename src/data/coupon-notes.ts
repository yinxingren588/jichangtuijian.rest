import raw from './coupon-notes.json';
export interface CouponNote {short:string;status:string;discount:string;conditions:string;validity:string;caution:string;checked:string;checkoutVerified:boolean;validityConfirmedBy:string;validityConfirmedAt:string}
export const couponNotes:Record<string,CouponNote>=raw;
