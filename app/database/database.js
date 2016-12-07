const mongoose = require(`mongoose`);

mongoose.connect(`mongodb://localhost:27017`, function (err) {
    if (err) throw new Error(err.message);

    console.log(`Mongodb connected on port: 27017`);
});

require('./models/users');
require('./models/messages');