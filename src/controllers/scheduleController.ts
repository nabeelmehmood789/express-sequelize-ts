import scheduleServices from "../services/scheduleServices";
// import {iScheduleLists} from "../interfaces/interfaces";
import {Schedule} from "../models/Schedule";
import {scheduleValidation} from "../validations/validation";

interface ischeduleController {
    scheduleLists():Promise<Schedule[]>;
    // updateSchedule(req: Express.Request):any;
    // fetchEndTimeSlot(req: Express.Request):Promise<iScheduleLists>;
    validateData(req:Express.Request):boolean,
    getTimeSlots(req:Express.Request):Promise<Schedule[]>
}

// const scheduleServiceObject = new scheduleServices();
export default new class scheduleController implements ischeduleController{

    scheduleLists(){
       return scheduleServices.getScheduleLists();
    }

    // updateSchedule(req: Express.Request){
    //     return  scheduleServiceObject.updateTimeSlots(req);
    // }
    // fetchEndTimeSlot(req:Express.Request){
    //     return scheduleServiceObject.fetchEndTimeSlot(req);
    // }
    //
    validateData(req:Express.Request): boolean{
        return scheduleValidation(req);
    }
    getTimeSlots(req:Express.Request) {
        return scheduleServices.getTimeSlots(req);
    }
    //
    // excludeTimeSlots(req: Express.Request):string[] {
    //     return scheduleServiceObject.validateTimeSlots(req);
    // }
}
