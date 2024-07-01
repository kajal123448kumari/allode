export const createError = (status, message)=>{
    console.log("status message-----",status,message);
    const error = new Error();
    error.status = status;
    error.message = message;
    return error;
}