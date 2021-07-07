import {Schedule} from "../models/Schedule";
import {scheduleUpdateValidation} from "../validations/scheduleUpdateValidation";
import {TIME_FORMAT} from "../constants/constants";
interface iScheduleServices {
    getScheduleLists(req,res):Promise<Schedule[]>;
    updateTimeSlot(req,res):Promise<Schedule[] | undefined>;
    excludeTimeSlots(timeSlots:string[],from,to,res): string[] | undefined;
    bookTimeSlots(bookedSlots,from,to):string[];
    fetchEndTimeSlot(req,res)
}
export class scheduleServices implements iScheduleServices{

    async getScheduleLists(req,res){
        try {
            const schedule: Schedule[] =  await Schedule.findAll();
             return res.status(500).send({
                status:"success",
                statusCode:200,
                message:"",
                data:schedule
            });

        } catch(e){
            return res.status(500).send({
                status:"error",
                statusCode:500,
                message:e.message,
                data:[]
            });
        }
    }

    async updateTimeSlot(req,res){
        try {
            scheduleUpdateValidation(req,res);
            const schedule: Schedule[] = await Schedule.findAll({attributes:["availableSlots","bookedSlots"],where:{weekdays:req.body.weekdays}});
            const availableTimeSlots   = this.excludeTimeSlots(schedule[0].availableSlots.timeSlots,req.body.from,req.body.to,res);
            const bookedTimeSlots = this.bookTimeSlots(schedule[0].bookedSlots,req.body.from,req.body.to);
            if(!availableTimeSlots){
                return;
            }
            if(!bookedTimeSlots){
                res.send({
                    status:"error",
                    statusCode:422,
                    message:"Time slots are not available",
                    data:[]
                });
                return;
            }
            await Schedule.update({availableSlots:{"timeSlots":availableTimeSlots},bookedSlots:bookedTimeSlots},{where:{weekdays:req.body.weekdays}});
            await this.getScheduleLists(req,res);
        } catch(e){
            return res.status(500).send({
                status:"error",
                statusCode:500,
                message:e.message,
                data:[]
            });
        }

    }

    excludeTimeSlots = (timeSlots:string[],from,to,res) =>{

        const userSelectedSlots: string[] = [];
        if(!timeSlots){
            res.send({
                status:"error",
                statusCode:422,
                message:"Time slots are not available",
                data:[]
            });
            return;
        }
        const startTimeIndex:number = timeSlots.indexOf(from);
        const endTimeIndex:number = timeSlots.indexOf(to);
        if(startTimeIndex == -1 ||  endTimeIndex == -1){
            res.send({
                status:"error",
                statusCode:422,
                message:"Time slots are not available",
                data:[]
            });
           return;
        }
        let freeTimeSlots: string[] = [];
        if(startTimeIndex > endTimeIndex){
            for(let startTimeSlot:number = startTimeIndex + 1; startTimeSlot < timeSlots.length; startTimeSlot++){
                userSelectedSlots.push(timeSlots[startTimeSlot]);
            }
            for(let endTimeSlot:number = endTimeIndex - 1; endTimeSlot >= 0; endTimeSlot--){
                console.log(endTimeIndex)
                userSelectedSlots.push(timeSlots[endTimeSlot]);
            }
            console.log(userSelectedSlots);
            freeTimeSlots = timeSlots.filter((timeSlot) => !userSelectedSlots.includes(timeSlot));

        } else {
            for(let startTimeSlot:number = startTimeIndex + 1; startTimeSlot < endTimeIndex; startTimeSlot++){
                userSelectedSlots.push(timeSlots[startTimeSlot]);
            }
            freeTimeSlots = timeSlots.filter((timeSlot) => !userSelectedSlots.includes(timeSlot));
        }
        return freeTimeSlots;
    }
    bookTimeSlots = (bookedSlots,from,to) => {
        const  busySlots = (bookedSlots != null ? bookedSlots : []);
        if(busySlots.includes(`${from}-${to}`)){
           return null;
        }
        busySlots.push(`${from}-${to}`);
        return busySlots;

    }
    async fetchEndTimeSlot(req,res){
        const schedule: Schedule[] = await Schedule.findAll({attributes:["availableSlots","bookedSlots"],where:{weekdays:req.body.day}});
        // @ts-ignore
        // console.log(schedule[0].bookedSlots);
        // @ts-ignore
        if(schedule[0]?.bookedSlots.length < 0){
            res.send({
                status:"error",
                statusCode:422,
                message:"",
                data:schedule[0].availableSlots.timeSlots
            });
            return;
        }

        const bookedStartTimeSlot: string[] = [];
        const bookedEndTimeSlot: string[] = [];
        // @ts-ignore
        schedule[0]?.bookedSlots.forEach((bookedSlot) => {
            bookedStartTimeSlot.push(bookedSlot.split("-")[0]);
            bookedEndTimeSlot.push(bookedSlot.split("-")[1]);
        });
        if(bookedStartTimeSlot.includes(req.body.startTime)){
            res.send({
                status:"error",
                statusCode:422,
                message:"",
                data:[]
            });
            return;
        }


        const startTimeIndex = TIME_FORMAT.indexOf(req.body.startTime);
        const availableEndTimeSlots: string[] = [];
        let isAntiClockDateExit: boolean = false;
        for(let startTime = startTimeIndex + 1; startTime < TIME_FORMAT.length; startTime++){
            // @ts-ignore
            if(bookedStartTimeSlot.includes(TIME_FORMAT[startTime])){
                availableEndTimeSlots.push(TIME_FORMAT[startTime]);
                res.send({
                    status:"error",
                    statusCode:422,
                    message:"",
                    data:availableEndTimeSlots
                });
                return;

            } else {
                isAntiClockDateExit = true;
                availableEndTimeSlots.push(TIME_FORMAT[startTime]);
            }

        }
        if(isAntiClockDateExit){
            console.log("BOOKED TIME SLOT",bookedStartTimeSlot[1]);
            for(let startTime = 0; startTime < TIME_FORMAT.length; startTime++){
                console.log("TIME SLOT",TIME_FORMAT[startTime]);
                // @ts-ignore
                if(bookedStartTimeSlot.includes(TIME_FORMAT[startTime])){
                    console.log(TIME_FORMAT[startTime]);
                    availableEndTimeSlots.push(TIME_FORMAT[startTime]);
                    res.send({
                        status:"error",
                        statusCode:422,
                        message:"",
                        data:availableEndTimeSlots
                    });
                    return;

                } else {
                    // console.log(TIME_FORMAT[startTime]);
                    availableEndTimeSlots.push(TIME_FORMAT[startTime]);
                }

            }
        }
        res.send({
            status:"error",
            statusCode:422,
            message:"",
            data:availableEndTimeSlots
        });
        return;


    }



}

