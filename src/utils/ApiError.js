class ApiError extends Error {
    constructor(
        statuscode,
        message = "Something went wrong",
        error = [],
        stack = ""
    ) {
        super(message); 
        this.statuscode = statuscode;
        this.data = null;
        this.message = message;
        this.success = false; // Fixed typo: successs → success
        this.errors = error; // Fixed typo: errors → error

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiError };
