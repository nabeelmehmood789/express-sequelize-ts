import {Schedule} from "../models/Schedule";
import {scheduleUpdateValidation} from "../validations/scheduleUpdateValidation";
import {TIME_FORMAT} from "../constants/constants";
import {iScheduleLists} from "../interfaces/interfaces";

interface iScheduleServices {
    getScheduleLists():Promise<iScheduleLists>;
    updateTimeSlots(req:Express.Request):Promise<iScheduleLists>;
    excludeTimeSlots(timeSlots:string[],from:string,to:string): string[] | boolean;

    bookTimeSlots(bookedSlots: string[] | undefined, from: string, to: string):string[] | boolean;
    fetchEndTimeSlot(req):Promise<iScheduleLists>
}

export class scheduleServices implements iScheduleServices{

    async getScheduleLists(){
        try {
            const schedules = await Schedule.findAll();
            return {
                status:"success",
                statusCode:200,
                message:"",
                data:schedules
            }
        } catch (error) {
            return {
                status:"error",
                statusCode:500,
                message:error.message,
                data:[]

            }
        }

    }


    async updateTimeSlots(req){
        try {
            const isDataValid = scheduleUpdateValidation(req);
            if(!isDataValid){
                return {
                    status:"error",
                    statusCode:422,
                    message:"Invalid Data",
                    data:[]

                }
            }
            const schedule: Schedule[]  = await Schedule.findAll({attributes:["availableSlots","bookedSlots"],where:{weekdays:req.body.weekdays}});
            const availableTimeSlots    = this.excludeTimeSlots(schedule[0].availableSlots.timeSlots,req.body.from,req.body.to);
            const bookedTimeSlots       = this.bookTimeSlots(schedule[0]?.bookedSlots,req.body.from,req.body.to);
            if(!availableTimeSlots){
                return {
                    status:"error",
                    statusCode:422,
                    message:"Time slots are not available",
                    data:[]
                };
            }
            if(!bookedTimeSlots){
              return  {
                    status:"error",
                    statusCode:422,
                    message:"Time slots already booked.",
                    data:[]
                };
            }
            await Schedule.update({availableSlots:{"timeSlots":availableTimeSlots},bookedSlots:bookedTimeSlots},{where:{weekdays:req.body.weekdays}});
            return this.getScheduleLists();

            } catch(e){
                return {
                    status:"error",
                    statusCode:500,
                    message:e.message,
                    data:[]
                };
        }

    }

    excludeTimeSlots = (timeSlots:string[],from:string,to:string) =>{
        const userSelectedSlots: string[] = [];
        if(!timeSlots){
            return false;
        }
        const startTimeIndex:number = timeSlots.indexOf(from);
        const endTimeIndex:number = timeSlots.indexOf(to);
        if(startTimeIndex == -1 ||  endTimeIndex == -1){
            return false;
        }
        let freeTimeSlots: string[] = [];

        if(startTimeIndex > endTimeIndex){
            for(let startTimeSlot:number = startTimeIndex + 1; startTimeSlot < timeSlots.length; startTimeSlot++){
                userSelectedSlots.push(timeSlots[startTimeSlot]);
            }
            for(let endTimeSlot:number = endTimeIndex - 1; endTimeSlot >= 0; endTimeSlot--){
                userSelectedSlots.push(timeSlots[endTimeSlot]);
            }
            freeTimeSlots = timeSlots.filter((timeSlot) => !userSelectedSlots.includes(timeSlot));

        } else {
            for(let startTimeSlot:number = startTimeIndex + 1; startTimeSlot < endTimeIndex; startTimeSlot++){
                userSelectedSlots.push(timeSlots[startTimeSlot]);
            }
            freeTimeSlots = timeSlots.filter((timeSlot) => !userSelectedSlots.includes(timeSlot));
        }
        return freeTimeSlots;
    }

    bookTimeSlots = (bookedSlots: string[] | undefined, from: string, to: string): string[] | boolean => {
        const  busySlots: string[] = (bookedSlots != null ? bookedSlots : []);
        if(busySlots.includes(`${from}-${to}`)){
           return false;
        }
        busySlots.push(`${from}-${to}`);
        return busySlots;

    }

    async fetchEndTimeSlot(req){
        const schedules: Schedule[] = await Schedule.findAll({attributes:["availableSlots","bookedSlots"],where:{weekdays:req.body.day}});

        if(schedules[0] && schedules[0]?.bookedSlots?.length){
            return {
                status:"success",
                statusCode:200,
                message:"",
                data:schedules[0].availableSlots.timeSlots
            };
        }

        const bookedStartTimeSlot: string[] = [];
        const bookedEndTimeSlot: string[] = [];
        schedules[0]?.bookedSlots?.forEach((bookedSlot) => {
            bookedStartTimeSlot.push(bookedSlot.split("-")[0]);
            bookedEndTimeSlot.push(bookedSlot.split("-")[1]);
        });

        if(bookedStartTimeSlot.includes(req.body.startTime)){
           return {
                status:"error",
                statusCode:422,
                message:"",
                data:[]
            }
        }
        const startTimeIndex: number = TIME_FORMAT.indexOf(req.body.startTime);
        const availableEndTimeSlots: string[] = [];
        let isAntiClockDateExit: boolean = false;
        for(let startTime = startTimeIndex + 1; startTime < TIME_FORMAT.length; startTime++){
            if(bookedStartTimeSlot.includes(TIME_FORMAT[startTime])){
                availableEndTimeSlots.push(TIME_FORMAT[startTime]);
                return {
                    status:"error",
                    statusCode:422,
                    message:"",
                    data:availableEndTimeSlots
                };

            } else {
                isAntiClockDateExit = true;
                availableEndTimeSlots.push(TIME_FORMAT[startTime]);
            }

        }
        if(isAntiClockDateExit){
            for(let startTime = 0; startTime < TIME_FORMAT.length; startTime++){
                if(bookedStartTimeSlot.includes(TIME_FORMAT[startTime])){
                    availableEndTimeSlots.push(TIME_FORMAT[startTime]);
                    return {
                        status:"error",
                        statusCode:422,
                        message:"",
                        data:availableEndTimeSlots
                    }

                } else {
                    availableEndTimeSlots.push(TIME_FORMAT[startTime]);
                }

            }
        }
        return {
            status:"success",
            statusCode:422,
            message:"",
            data:availableEndTimeSlots
        }


    }



}

