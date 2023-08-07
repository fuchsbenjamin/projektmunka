import { Coupon } from "./coupon";

export interface Order {
    code:string,
    name:string,
    inc: string,
    price:number,
    payed: boolean,
    ready: boolean,
    uid: string,
    userUid: string,
    couponCode: string
}
