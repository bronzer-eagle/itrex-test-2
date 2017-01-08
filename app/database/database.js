const
    mongoose = require(`mongoose`);

mongoose.connect(process.env.dbPath, function (err) {
    if (err) throw new Error(err.message);

    console.log(`Mongodb connected on port: ${process.env.dbPort}`);
});

require('./models/users');
require('./models/messages');