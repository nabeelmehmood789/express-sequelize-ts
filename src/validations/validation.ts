
export const scheduleValidation = (req): boolean  => {
    let isValidData = true;
    if(!req.body.from || !req.body.to || !req.body.weekdays){
        isValidData = false;
    }
    return isValidData;
}