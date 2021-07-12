import {Schedule} from "../models/Schedule";

export interface responseHandle {
    status: string;
    statusCode: number;
    message: string;
    data:Schedule[]

}
