class REQRESPONSE {
    status;
    data;
    message;

    constructor (status, data, message) {
        this.status = status;
        this.data = data;
        this.message = message;
    }
}

class LISTRESPONSE {
    status
    data
    message
    totalCount
    currentPage
    pageSize
    totalPages

    constructor (status, data, message, totalCount, currentPage, pageSize) {
        this.status = status;
        this.data = data;
        this.message = message;
        this.totalCount = totalCount;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPages = Math.ceil(totalCount / pageSize);
    }
}


module.exports = {REQRESPONSE, LISTRESPONSE}