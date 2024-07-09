class REQRESPONSE {
    status;
    body;
    message;

    constructor (status, body, message) {
        this.status = status;
        this.body = body;
        this.message = message;
    }
}


module.exports = REQRESPONSE