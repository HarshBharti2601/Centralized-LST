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
Object.defineProperty(exports, "__esModule", { value: true });
exports.burnTokensAndSendNativeTokens = exports.mintTokens = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const solana_1 = require("./config/solana");
const address_1 = require("./address");
const utils_1 = require("./utils");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const calculateAmountToMint = (amountInLamports) => {
    console.log("Calculating amount to mint", amountInLamports);
    const amountToMint = (0, utils_1.SolToLst)(amountInLamports);
    console.log("Amount to mint", amountToMint);
    return amountToMint;
};
const calculateNativeAmountToSend = (amountInLamports) => {
    console.log("Calculating native amount to send", amountInLamports);
    const amountToSend = (0, utils_1.LstToSol)(amountInLamports);
    console.log("Amount to send", amountToSend);
    return amountToSend;
};
const mintTokens = (toAddress, amountInLamports) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Minting tokens");
        const receiverAtaAddress = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(solana_1.connection, solana_1.payer, address_1.TOKEN_MINT_ADDRESS, toAddress, true, "confirmed", undefined, spl_token_1.TOKEN_2022_PROGRAM_ID);
        let amountToMint = calculateAmountToMint(amountInLamports);
        console.log("Amount to mint", amountToMint);
        yield (0, spl_token_1.mintTo)(solana_1.connection, solana_1.payer, address_1.TOKEN_MINT_ADDRESS, receiverAtaAddress.address, solana_1.payer, amountToMint, [], undefined, spl_token_1.TOKEN_2022_PROGRAM_ID);
        console.log("Tokens minted");
    }
    catch (error) {
        console.log("Error minting tokens", error);
        throw new Error("Error minting tokens");
    }
});
exports.mintTokens = mintTokens;
const burnTokensAndSendNativeTokens = (userAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Combine burn and transfer in a single atomic transaction
        console.log("Burning tokens and sending native tokens");
        yield sleep(10000);
        let amountOfNativeTokensToSend = calculateNativeAmountToSend(amount);
        console.log("Amount of native tokens to send", amountOfNativeTokensToSend);
        const transaction = new web3_js_1.Transaction()
            .add((0, spl_token_1.createBurnInstruction)(address_1.ATA_ADDRESS, address_1.TOKEN_MINT_ADDRESS, address_1.PUBLIC_KEY, amount, [], spl_token_1.TOKEN_2022_PROGRAM_ID))
            .add(web3_js_1.SystemProgram.transfer({
            fromPubkey: solana_1.payer.publicKey,
            toPubkey: userAddress,
            lamports: amountOfNativeTokensToSend,
        }));
        yield (0, web3_js_1.sendAndConfirmTransaction)(solana_1.connection, transaction, [solana_1.payer], {
            skipPreflight: true,
            commitment: "confirmed",
        });
        console.log("Tokens burned and native tokens sent");
    }
    catch (error) {
        console.log("Error burning tokens and sending native tokens", error);
        throw new Error("Error burning tokens and sending native tokens");
    }
});
exports.burnTokensAndSendNativeTokens = burnTokensAndSendNativeTokens;
