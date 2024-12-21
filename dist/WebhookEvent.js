"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookEvent = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const webhookEventSchema = new mongoose_1.default.Schema({
    eventType: {
        type: String,
        required: true,
    },
    rawData: {
        type: Object,
        required: true,
    },
    processed: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});
exports.WebhookEvent = mongoose_1.default.model("WebhookEvent", webhookEventSchema);
