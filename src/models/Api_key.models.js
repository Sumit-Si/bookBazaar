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
    status: {
        type: String,
        enum: ["active","inactive"],
        default: "active",
    },
    expiresAt: {
        type: Date,
    }

}, { timestamps: true});


const ApiKey = mongoose.model("Api_key",apiKeySchema);

export default ApiKey;