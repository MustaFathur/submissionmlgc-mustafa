class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InputError';
        this.statusCode = 400;
    }
}

module.exports = InputError;