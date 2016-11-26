const mongoose = require(`mongoose`);

mongoose.connect(`mongodb://localhost/social`, function () {
    console.log(`Mongodb connected`)
});

module.exports = mongoose;