import {Router} from 'express';
import {scheduleController}  from "../controllers/scheduleController";
import {handleResponse} from "../responseHandling/response";
import {Schedule} from "../models/Schedule";
export const scheduleRoute = Router();

scheduleRoute.get('/', (async (req, res) => {
    try {
        const scheduleLists: Schedule[] =  await scheduleController.scheduleLists();
        handleResponse({"status":"success","statusCode":200,"message":"","data":scheduleLists},res)
    } catch(error){
        handleResponse({"status":"error","statusCode":500,"message":"","data":[]},res)
    }
}));
scheduleRoute.put('',async (req, res)=>{
    const validateData = scheduleController.validateData(req);
    if(!validateData){
        handleResponse({"status":"error","statusCode":500,"message":"","data":[]},res)
    }
    const validateTimeSlots = await scheduleController.validateTimeSlots;
    // const scheduleLists = await scheduleObject.updateSchedule(req);
    // res.status(scheduleLists.statusCode).send(scheduleLists);
});
// scheduleRoute.post('',async (req, res)=>{
//     const endTimeSlots = await scheduleObject.fetchEndTimeSlot(req)
//     res.status(endTimeSlots.statusCode).send(endTimeSlots);
// });