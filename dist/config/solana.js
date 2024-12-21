"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payer = exports.connection = exports.SOLANA_RPC_URL = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
exports.SOLANA_RPC_URL = "https://api.devnet.solana.com";
exports.connection = new web3_js_1.Connection(exports.SOLANA_RPC_URL);
exports.payer = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(process.env.SOLANA_PRIVATE_KEY));
