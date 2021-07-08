export const handleResponse = (err, res) => {
    const { statusCode, message, status, data } = err;
    res.header("Content-Type",'application/json');
    res.status(statusCode).json({
        status,
        statusCode,
        message,
        data
    });

};


