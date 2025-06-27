import mongoose, { Schema } from "mongoose";

const apiKeySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    key: {
        type: String,
        unique: true,
        required: true,
    },

}, { timestamps: true});


const ApiKey = mongoose.model("Api_key",apiKeySchema);

export default ApiKey;