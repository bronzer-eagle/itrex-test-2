/**
 * Created by alexanderbondarenko on 9/27/16.
 */
import _ from 'underscore';

class PaginationService {
    /** @ngInject */
    constructor($http) {
        this._http = $http;
    }

    getInfiniteData(options, pagination, callback) {
        options.params.pagination = pagination.current;

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

    getPagination() {
        return {
            current             : {
                start           : 0,
                count           : 20,
                moreAvailable   : true
            }
        }
    }
}


export default PaginationService;
