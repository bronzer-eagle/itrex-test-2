function dateFilter() {
    return function (input) {
        let result;

        result = moment(input).calendar();

        return result;
    }
}

export default dateFilter;