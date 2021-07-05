import {scheduleServices} from "../services/scheduleServices";
import {Schedule} from "../models/Schedule";
interface ischeduleController {
    scheduleLists(req: Express.Request,res:Express.Response):Promise<Schedule[]>;
    updateSchedule(req: Express.Request,res:Express.Response):Promise<Schedule[] | undefined>;
}
const scheduleServiceObject = new scheduleServices();
export class scheduleController implements ischeduleController{

    scheduleLists(req: Express.Request,res:Express.Response){
       return scheduleServiceObject.getScheduleLists(req,res);
    }

    updateSchedule(req: Express.Request,res:Express.Response){
        return  scheduleServiceObject.updateTimeSlot(req,res);
    }
}
