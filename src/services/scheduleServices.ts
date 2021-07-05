import {Schedule} from "../models/Schedule";
import {scheduleUpdateValidation} from "../validations/scheduleUpdateValidation";
export class scheduleServices {

    async getScheduleLists(req,res){
        try {
            const schedule: Schedule[] =  await Schedule.findAll();
             res.status(500).send({
                status:"success",
                statusCode:200,
                message:"",
                data:schedule
            });
             return;

        } catch(e){
            res.status(500).send({
                status:"error",
                statusCode:500,
                message:e.message,
                data:[]
            });
            return;
        }
    }

    async updateTimeSlot(req,res){
        try {
            scheduleUpdateValidation(req,res);
            const schedule: Schedule[] = await Schedule.findAll({attributes:["availableSlots","bookedSlots"],where:{weekdays:req.body.weekdays}});
            const availableTimeSlots   = this.excludeTimeSlots(schedule[0].availableSlots.timeSlots,req.body.from,req.body.to,res);
            const bookedTimeSlots = this.BookTimeSlots(schedule[0].bookedSlots,req.body.from,req.body.to);
            if(typeof availableTimeSlots === "undefined"){
                return;
            }
            await Schedule.update({availableSlots:{"timeSlots":availableTimeSlots},bookedSlots:bookedTimeSlots},{where:{weekdays:req.body.weekdays}});
            await this.getScheduleLists(req,res);
        } catch(e){
             res.status(500).send({
                status:"error",
                statusCode:500,
                message:e.message,
                data:[]
            });
             return;
        }

    }

    excludeTimeSlots = (timeSlots:string[],from,to,res) =>{

        const busySlots: string[] = [];
        if(typeof timeSlots === "undefined"){
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
            res.status(422).send({
                status:"error",
                statusCode:422,
                message:"Start time must be less than end time",
                data:[]
            });
            return;
        } else {
            for(let startTimeSlot:number = startTimeIndex; startTimeSlot <= endTimeIndex; startTimeSlot++){
                busySlots.push(timeSlots[startTimeSlot]);
            }
            freeTimeSlots = timeSlots.filter((timeSlot) => !busySlots.includes(timeSlot));
        }
        return freeTimeSlots;
    }
     BookTimeSlots = (bookedSlots,from,to) => {
        const  busySlots = (bookedSlots != null ? bookedSlots : []);
        busySlots.push(`${from}-${to}`);
        return busySlots;

    }

}
