import {Router} from 'express';
import {scheduleController}  from "../controllers/scheduleController";
const scheduleObject = new scheduleController();
export const scheduleRoute = Router();

scheduleRoute.get('/', (async (req, res) => {
    const scheduleLists =  await scheduleObject.scheduleLists();
    res.status(scheduleLists.statusCode).send(scheduleLists);
}));
scheduleRoute.put('',async (req, res)=>{
    const scheduleLists = await scheduleObject.updateSchedule(req);
    res.status(scheduleLists.statusCode).send(scheduleLists);
});
scheduleRoute.post('',async (req, res)=>{
    const endTimeSlots = await scheduleObject.fetchEndTimeSlot(req)
    res.status(endTimeSlots.statusCode).send(endTimeSlots);
});