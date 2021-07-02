import {scheduleServices} from "../services/scheduleServices";

let scheduleServiceObject = new scheduleServices();
export class scheduleController {

    async scheduleLists(req: Express.Request,res:Express.Response){
       return await scheduleServiceObject.getScheduleLists(req,res);

    }

    async updateSchedule(req: Express.Request,res:Express.Response){
        return await scheduleServiceObject.updateTimeSlot(req,res);
    }
}
