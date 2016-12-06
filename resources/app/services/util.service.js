/**
 * Created by alexander on 06.12.16.
 */
class UtilService {
    constructor() {

    }

    apiPrefix(url) {
        return `http://localhost:8080/${url}`;
    }
}

export default UtilService;