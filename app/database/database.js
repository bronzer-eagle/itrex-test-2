import mongoose from 'mongoose';
import Promise from "bluebird";

Promise.promisifyAll(mongoose);

mongoose.connect(process.env.dbPath, (err) => {
    if (err) throw new Error(err.message);

    console.log(`Mongodb connected on port: ${process.env.dbPort}`);
});

import './models/users';
import './models/messages';