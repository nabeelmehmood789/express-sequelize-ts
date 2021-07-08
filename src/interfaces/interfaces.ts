import {Schedule} from "../models/Schedule";

export interface iScheduleLists {
    status: string;
    statusCode: number;
    message: string;
    data: Schedule[] | string[]

}