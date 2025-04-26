const mongoose = require('mongoose');

module.exports = async () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    try {
        // Using await for mongoose connection
        await mongoose.connect(process.env.DB, connectionParams);
        console.log('Connected to database successfully');
    } catch (error) {
        console.log(error);
        console.log('Could not connect to database!');
    }
};
