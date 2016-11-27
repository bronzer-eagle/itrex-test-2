const mongoose = require(`mongoose`);

mongoose.connect(`mongodb://localhost:27017`, function (err) {
    if (err) {
        throw new Error(err.message)
    }

    console.log(`Mongodb connected`)
});

require('./models/users');