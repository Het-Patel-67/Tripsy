class ApiError extends Error {
    constructor(
        statusCode,
        message = 'Something went wrong',
        errors = [],
        stack = ""
    ) {
        super(message);  // SUPER method used to initialize parent's properties . without it can't access parent's logic
        this.statusCode = statusCode;
        this.errors = errors;
        this.stack = stack;
        this.success = false;
    }
}

export { ApiError };