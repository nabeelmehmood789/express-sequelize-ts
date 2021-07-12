import {Schedule} from "../models/Schedule";
// import {TIME_FORMAT} from "../constants/constants";
// import {errorHandle, iScheduleLists, responseHandle} from "../interfaces/interfaces";

interface iScheduleServices {
    getScheduleLists():Promise<Schedule[]>;
    // updateTimeSlots(req:Express.Request):any;
    // // excludeTimeSlots(timeSlots:string[],from:string,to:string): string[] | boolean;
    // bookTimeSlots(bookedSlots: string[] | undefined, from: string, to: string):string[] | boolean;
    // // fetchEndTimeSlot(req):Promise<iScheduleLists>
    getTimeSlots(req:Express.Request):Promise<Schedule[]>
}

export default new class scheduleServices implements iScheduleServices{

     getScheduleLists(){
        return Schedule.findAll()
    }


    // async updateTimeSlots(req){
    //     // try {
    //     //
    //     //     const schedule: Schedule[]  = await Schedule.findAll({attributes:["availableSlots","bookedSlots"],where:{weekdays:req.body.weekdays}});
    //     //     const availableTimeSlots    = this.excludeTimeSlots(schedule[0].availableSlots.timeSlots,req.body.from,req.body.to);
    //     //     const bookedTimeSlots       = this.bookTimeSlots(schedule[0]?.bookedSlots,req.body.from,req.body.to);
    //     //     if(!availableTimeSlots){
    //     //         return {
    //     //             status:"error",
    //     //             statusCode:422,
    //     //             message:"Time slots are not available",
    //     //             data:[]
    //     //         };
    //     //     }
    //     //     if(!bookedTimeSlots){
    //     //       return  {
    //     //             status:"error",
    //     //             statusCode:422,
    //     //             message:"Time slots already booked.",
    //     //             data:[]
    //     //         };
    //     //     }
    //     //     await Schedule.update({availableSlots:{"timeSlots":availableTimeSlots},bookedSlots:bookedTimeSlots},{where:{weekdays:req.body.weekdays}});
    //     //     return await this.getScheduleLists();
    //     //
    //     //     } catch(e){
    //     //         return {
    //     //             status:"error",
    //     //             statusCode:500,
    //     //             message:e.message,
    //     //             data:[]
    //     //         };
    //     // }
    //
    // }
    async getTimeSlots(req){
        const schedule: Schedule[]  = await Schedule.findAll({attributes:["availableSlots","bookedSlots"],where:{weekdays:req.body.weekdays}});
        return schedule;
    }
    //
    // // excludeTimeSlots = (timeSlots:string[],from:string,to:string): responseHandle =>{
    // //     const startTimeIndex:number = this.getTimeIndex(timeSlots,from);
    // //     const endTimeIndex:number = this.getTimeIndex(timeSlots,to);
    // //     if(!this.isValidTimeSlots(startTimeIndex,endTimeIndex)){
    // //         return {
    // //             status:"error",
    // //             statusCode:422,
    // //             message:"Time Slots are not available",
    // //             data:[]
    // //         }
    // //     }
    // //     // if(!this.isValidTimeSlots(startTimeIndex,endTimeIndex)) return {statusCode:422,message:"Time Slots are not available"}
    // //     const freeTimeSlots : string[] = this.getFreeTimeSlots(timeSlots,startTimeIndex,endTimeIndex);
    // //     return {
    // //         status:"error",
    // //         statusCode:422,
    // //         message:"Time Slots are not available",
    // //         data:freeTimeSlots
    // //     }
    // // }
    //
    // getTimeIndex = (timeSlots,time):number => {
    //      return timeSlots.indexOf(time)
    // }
    // isValidTimeSlots = (startTimeIndex,endTimeIndex):boolean => {
    //     if (startTimeIndex == -1 || endTimeIndex == -1) {
    //         return false
    //     }
    //        return true
    // }
    // getFreeTimeSlots = (timeSlots:string[],startTimeIndex:number,endTimeIndex:number): string[] => {
    //     const userSelectedSlots: string[] = [];
    //     let freeTimeSlots: string[] = [];
    //     if(startTimeIndex > endTimeIndex){
    //         for(let startTimeSlot:number = startTimeIndex + 1; startTimeSlot < timeSlots.length; startTimeSlot++){
    //             userSelectedSlots.push(timeSlots[startTimeSlot]);
    //         }
    //         for(let endTimeSlot:number = endTimeIndex - 1; endTimeSlot >= 0; endTimeSlot--){
    //             userSelectedSlots.push(timeSlots[endTimeSlot]);
    //         }
    //
    //         freeTimeSlots = timeSlots.filter((timeSlot) => !userSelectedSlots.includes(timeSlot));
    //     } else {
    //         for(let startTimeSlot:number = startTimeIndex + 1; startTimeSlot < endTimeIndex; startTimeSlot++){
    //             userSelectedSlots.push(timeSlots[startTimeSlot]);
    //         }
    //         freeTimeSlots = timeSlots.filter((timeSlot) => !userSelectedSlots.includes(timeSlot));
    //     }
    //     return freeTimeSlots;
    // }
    // bookTimeSlots = (bookedSlots: string[] | undefined, from: string, to: string): string[] | boolean => {
    //     const  busySlots: string[] = (bookedSlots != null ? bookedSlots : []);
    //     if(busySlots.includes(`${from}-${to}`)){
    //        return false;
    //     }
    //     busySlots.push(`${from}-${to}`);
    //     return busySlots;
    //
    // }
    //
    // async fetchEndTimeSlot(req){
    //     const schedules: Schedule[] = await Schedule.findAll({attributes:["availableSlots","bookedSlots"],where:{weekdays:req.body.day}});
    //
    //     if(schedules[0] && schedules[0]?.bookedSlots?.length){
    //         return {
    //             status:"success",
    //             statusCode:200,
    //             message:"",
    //             data:schedules[0].availableSlots.timeSlots
    //         };
    //     }
    //
    //     const bookedStartTimeSlot: string[] = [];
    //     const bookedEndTimeSlot: string[] = [];
    //     schedules[0]?.bookedSlots?.forEach((bookedSlot) => {
    //         bookedStartTimeSlot.push(bookedSlot.split("-")[0]);
    //         bookedEndTimeSlot.push(bookedSlot.split("-")[1]);
    //     });
    //
    //     if(bookedStartTimeSlot.includes(req.body.startTime)){
    //        return {
    //             status:"error",
    //             statusCode:422,
    //             message:"",
    //             data:[]
    //         }
    //     }
    //     const startTimeIndex: number = TIME_FORMAT.indexOf(req.body.startTime);
    //     const availableEndTimeSlots: string[] = [];
    //     let isAntiClockDateExit: boolean = false;
    //     for(let startTime = startTimeIndex + 1; startTime < TIME_FORMAT.length; startTime++){
    //         if(bookedStartTimeSlot.includes(TIME_FORMAT[startTime])){
    //             availableEndTimeSlots.push(TIME_FORMAT[startTime]);
    //             return {
    //                 status:"error",
    //                 statusCode:422,
    //                 message:"",
    //                 data:availableEndTimeSlots
    //             };
    //
    //         } else {
    //             isAntiClockDateExit = true;
    //             availableEndTimeSlots.push(TIME_FORMAT[startTime]);
    //         }
    //
    //     }
    //     if(isAntiClockDateExit){
    //         for(let startTime = 0; startTime < TIME_FORMAT.length; startTime++){
    //             if(bookedStartTimeSlot.includes(TIME_FORMAT[startTime])){
    //                 availableEndTimeSlots.push(TIME_FORMAT[startTime]);
    //                 return {
    //                     status:"error",
    //                     statusCode:422,
    //                     message:"",
    //                     data:availableEndTimeSlots
    //                 }
    //
    //             } else {
    //                 availableEndTimeSlots.push(TIME_FORMAT[startTime]);
    //             }
    //
    //         }
    //     }
    //     return {
    //         status:"success",
    //         statusCode:422,
    //         message:"",
    //         data:availableEndTimeSlots
    //     }
    //
    //
    // }



}

