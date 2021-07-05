import {Router} from 'express';
import {scheduleController}  from "../controllers/scheduleController";
const scheduleObject = new scheduleController();
export const schedule = Router();

schedule.get('', (req,res)=>scheduleObject.scheduleLists(req,res));
schedule.post('/',(req,res)=>scheduleObject.updateSchedule(req,res));
