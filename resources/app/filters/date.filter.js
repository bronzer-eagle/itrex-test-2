function dateFilter() {
    return function (input) {
        return moment(input).calendar();
    }
}

export default dateFilter;