
export const scheduleUpdateValidation = (req): boolean => {
    if(!req.body.from || !req.body.to || !req.body.weekdays){
      return false;
    }
      return true;
}