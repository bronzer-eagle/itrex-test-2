/**
 * Created by alexander on 02.03.17.
 */

class ExpressHelper {
    constructor() {}

    static error(status = 500, message = {error : 'Error occurred'}) {
        this.status(status).json(message);
    }

    static success(status = 204, message = {}) {
        this.status(status).json(message);
    }
}

module.exports = ExpressHelper;