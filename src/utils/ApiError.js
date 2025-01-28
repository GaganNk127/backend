class ApiError extends Error{
    constructor (
        statuscode,
        message = "Something went wrong",
        error = [],
        stack = ""
    ){
        supper(message)
        this.statuscode = statuscode;
        this.data = null;
        this.message = message;
        this.successs = false;
        this.errors = errors

        if(stack)
        {
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }

}
export {ApiError}