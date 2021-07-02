// import {handleResponse} from "../responseHandling/response";

export const scheduleUpdateValidation = (req,res) => {
    if(!req.body.from || !req.body.to || !req.body.weekdays){
      res.status(422).send({
            status:"error",
            statusCode:422,
            message:"Invalid Request Data",
            data:[]
        });
      return;
    }
}