/**
 * Created by alexander on 06.12.16.
 */
class UtilService {
    constructor() {}

    apiPrefix(url) {
        return window.location.origin + `/${url}`;
    }
}

export default UtilService;