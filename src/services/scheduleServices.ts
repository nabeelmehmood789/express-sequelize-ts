import {Schedule} from "../models/Schedule";
import {scheduleUpdateValidation} from "../validations/scheduleUpdateValidation";
interface iScheduleServices {
    getScheduleLists(req,res):Promise<Schedule[]>;
    updateTimeSlot(req,res):Promise<Schedule[] | undefined>;
    excludeTimeSlots(timeSlots:string[],from,to,res): string[] | undefined;
    bookTimeSlots(bookedSlots,from,to):string[];
    fetchEndTimeSlot(req,res):Promise<Schedule[]>
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
            if(typeof availableTimeSlots === "undefined"){
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
            console.log("START TIME INDEX",startTimeIndex);
            console.log("END TIME INDEX",endTimeIndex)
            for(let startTimeSlot:number = startTimeIndex; startTimeSlot < timeSlots.length; startTimeSlot++){
                userSelectedSlots.push(timeSlots[startTimeSlot]);
            }
            for(let endTimeSlot:number = endTimeIndex - 1; endTimeSlot >= 0; endTimeSlot--){
                console.log(endTimeIndex)
                userSelectedSlots.push(timeSlots[endTimeSlot]);
            }
            console.log(userSelectedSlots);
            freeTimeSlots = timeSlots.filter((timeSlot) => !userSelectedSlots.includes(timeSlot));

        } else {
            for(let startTimeSlot:number = startTimeIndex; startTimeSlot < endTimeIndex; startTimeSlot++){
                userSelectedSlots.push(timeSlots[startTimeSlot]);
            }
            freeTimeSlots = timeSlots.filter((timeSlot) => !userSelectedSlots.includes(timeSlot));
        }
        return freeTimeSlots;
    }
    bookTimeSlots = (bookedSlots,from,to) => {
        const  busySlots = (bookedSlots != null ? bookedSlots : []);
        busySlots.push(`${from}-${to}`);
        return busySlots;

    }
    fetchEndTimeSlot(req,res){
        const schedule: Schedule[] = await Schedule.findAll({attributes:["availableSlots","bookedSlots"],where:{weekdays:req.body.weekdays}});
        return schedule;
    }



}

