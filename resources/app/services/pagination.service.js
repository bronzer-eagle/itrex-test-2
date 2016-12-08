/**
 * Created by alexanderbondarenko on 9/27/16.
 */
import _ from 'underscore';

class PaginationService {
    /** @ngInject */
    constructor($http) {
        this._http              = $http;
    }

    getInfiniteData(options, pagination, callback) {
        return this._http(options)
            .then(response => {
                let responseData                    = response.data;

                pagination.current                  = responseData.pagination;

                return responseData;

            }, error => {
                console.log(error);
            })
            .finally(() => {
                if (callback) {
                    callback()
                }
            })
    }
}


export default PaginationService;