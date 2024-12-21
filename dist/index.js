"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mintTokens_1 = require("./mintTokens");
const address_1 = require("./address");
const web3_js_1 = require("@solana/web3.js");
const database_1 = require("./config/database");
const WebhookEvent_1 = require("./WebhookEvent");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    yield (0, database_1.connectToDB)();
    app.post("/helius", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const data = (_a = req.body) === null || _a === void 0 ? void 0 : _a[0];
            console.log({ eventType: data === null || data === void 0 ? void 0 : data.type });
            const webhookEvent = yield WebhookEvent_1.WebhookEvent.create({
                eventType: data === null || data === void 0 ? void 0 : data.type,
                rawData: data,
            });
            processWebhook(data)
                .then(() => {
                webhookEvent.processed = true;
                webhookEvent.save();
                console.log("Event Processed");
            })
                .catch((error) => {
                console.log("failed to process event", error);
            });
            res.send("Event Captured");
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Event Failed");
        }
    }));
    const processWebhook = (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        try {
            const type = "TRANSFER";
            let fromAddress = (_b = (_a = data === null || data === void 0 ? void 0 : data.nativeTransfers) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.fromUserAccount;
            let toAddress = (_d = (_c = data === null || data === void 0 ? void 0 : data.nativeTransfers) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.toUserAccount;
            let amount = (_f = (_e = data === null || data === void 0 ? void 0 : data.nativeTransfers) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.amount;
            if ((data === null || data === void 0 ? void 0 : data.type) === type && toAddress === address_1.PUBLIC_KEY.toBase58()) {
                fromAddress = (_h = (_g = data === null || data === void 0 ? void 0 : data.nativeTransfers) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.fromUserAccount;
                amount = (_k = (_j = data === null || data === void 0 ? void 0 : data.nativeTransfers) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.amount;
                yield (0, mintTokens_1.mintTokens)(new web3_js_1.PublicKey(fromAddress), Number(amount));
            }
            else {
                let myAccountData = (_l = data === null || data === void 0 ? void 0 : data.accountData) === null || _l === void 0 ? void 0 : _l.find((account) => account.account === "8mSftUkCcRVL2ht2JvNRXMNo87Xk6tSMnokZvkT6ZfLH");
                console.log({ myAccountData });
                if (myAccountData) {
                    let senderAccount = (_m = data === null || data === void 0 ? void 0 : data.accountData) === null || _m === void 0 ? void 0 : _m.find((account) => {
                        var _a, _b, _c, _d, _e, _f;
                        return ((_c = (_b = (_a = account === null || account === void 0 ? void 0 : account.tokenBalanceChanges) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.rawTokenAmount) === null || _c === void 0 ? void 0 : _c.tokenAmount) ===
                            "-" +
                                ((_f = (_e = (_d = myAccountData === null || myAccountData === void 0 ? void 0 : myAccountData.tokenBalanceChanges) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.rawTokenAmount) === null || _f === void 0 ? void 0 : _f.tokenAmount);
                    });
                    console.log(senderAccount);
                    if (senderAccount) {
                        let senderAddress = new web3_js_1.PublicKey(senderAccount.tokenBalanceChanges[0].userAccount);
                        let amount = Number(myAccountData.tokenBalanceChanges[0].rawTokenAmount.tokenAmount);
                        yield (0, mintTokens_1.burnTokensAndSendNativeTokens)(senderAddress, amount);
                    }
                }
            }
        }
        catch (error) {
            console.log(`Failed to process webhook:`, error);
        }
    });
    app.listen(3000, () => {
        console.log("Server is running on port 3000, hello");
    });
});
startServer();
