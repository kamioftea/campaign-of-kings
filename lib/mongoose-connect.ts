import mongoose, {ConnectOptions} from "mongoose";

// Clear models on recompile
(mongoose as any).models = {};

const options: ConnectOptions = {
    dbName: 'campaign-of-kings',
    family: 4,
};

console.log(process.env.MONGO_URI, options)

export const mongooseConnect = mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017',
    options
);

