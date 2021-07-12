import {responseHandle} from "../interfaces/interfaces";

export const handleResponse = (dataObject:responseHandle, res):void => {
    const { statusCode, message, status, data } = dataObject;
    if(statusCode != 200){
        res.status(statusCode).json({
            status,
            statusCode,
            message,
            data
        });
        return;
    }
    res.status(statusCode).json({
        status,
        statusCode,
        message,
        data
    });

};


