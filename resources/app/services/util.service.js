/**
 * Created by alexander on 06.12.16.
 */
class UtilService {
    constructor() {

    }

    apiPrefix(url) {
        return `http://192.168.0.89:8080/${url}`;
    }
}

export default UtilService;