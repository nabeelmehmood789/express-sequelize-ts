import {scheduleServices} from "../services/scheduleServices";
import {iScheduleLists} from "../interfaces/interfaces";

interface ischeduleController {
    scheduleLists():Promise<iScheduleLists>;
    updateSchedule(req: Express.Request):Promise<iScheduleLists>;
    fetchEndTimeSlot(req: Express.Request):Promise<iScheduleLists>;
}

const scheduleServiceObject = new scheduleServices();
export class scheduleController implements ischeduleController{

    scheduleLists(){
       return scheduleServiceObject.getScheduleLists();
    }

    updateSchedule(req: Express.Request){
        return  scheduleServiceObject.updateTimeSlots(req);
    }
    fetchEndTimeSlot(req:Express.Request){
        return scheduleServiceObject.fetchEndTimeSlot(req);
    }
}
