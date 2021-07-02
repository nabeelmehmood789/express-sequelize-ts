import {Router} from 'express';
import {Schedule} from "../models/Schedule";

export const schedule = Router();
schedule.post('/',async (req,res)=>{
    try {
        if(!req.body.from || !req.body.to || !req.body.weekdays){
            return res.status(422).json({"message":"All fields are required."})
        }
        const schedule: Schedule[] = await Schedule.findAll({attributes:["availableSlots","bookedSlots"],where:{weekdays:req.body.weekdays}});
        const availableTimeSlots = excludeTimeSlots(schedule[0].availableSlots.timeSlots,req.body.from,req.body.to);
        if(!availableTimeSlots){
            return res.status(404).json('Data not found')
        }
        const bookedTimeSlots: string[] = BookTimeSlots(schedule[0].bookedSlots,req.body.from,req.body.to);
         return await Schedule.update({availableSlots:{"timeSlots":availableTimeSlots},bookedSlots:bookedTimeSlots},{where:{weekdays:req.body.weekdays}});
        // return res.json(200).json(await Schedule.findAll());
    } catch(err){
        return res.status(500).json(err)
    }

});

schedule.get('', async (req, res, next) => {
    try {
        const schedules: Schedule[] =  await Schedule.findAll();
        return res.status(200).json(schedules);
    } catch (e) {
        return next(e);
    }
});



const excludeTimeSlots = (timeSlots:string[],from,to) =>{
    try {
        const busySlots: string[] = [];
        const startTimeIndex:number = timeSlots.indexOf(from);
        const endTimeIndex:number = timeSlots.indexOf(to);
        if(startTimeIndex == -1 ||  endTimeIndex == -1){
            return false;
        }
        let freeTimeSlots: string[] = [];
        if(startTimeIndex < endTimeIndex){
            for(let startTimeSlot:number = startTimeIndex; startTimeSlot <= endTimeIndex; startTimeSlot++){
                busySlots.push(timeSlots[startTimeSlot]);
            }
            freeTimeSlots = timeSlots.filter((timeSlot) => !busySlots.includes(timeSlot));
        } else {
            for(let startTimeSlot:number = startTimeIndex; startTimeSlot < timeSlots.length; startTimeSlot++){
                busySlots.push(timeSlots[startTimeSlot]);
            }

            let lastIndexOfTimeSlot:number = timeSlots.indexOf(to);
            for(lastIndexOfTimeSlot; lastIndexOfTimeSlot >= 0; lastIndexOfTimeSlot--){
                busySlots.push(timeSlots[lastIndexOfTimeSlot]);
            }
            freeTimeSlots = timeSlots.filter((timeSlot) => !busySlots.includes(timeSlot));
        }
        return freeTimeSlots;
    } catch(e) {
        console.log(e)
    }



}
const BookTimeSlots = (bookedSlots,from,to) => {
    if(!bookedSlots){
        let bookedSlots: string[] = [];
        bookedSlots.push(`${from}-${to}`)
    }else {
        bookedSlots.push(`${from}-${to}`)
    }
    return bookedSlots;

}
