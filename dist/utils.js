"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolToLst = exports.LstToSol = void 0;
function calculateConversionsWithMinuteRate() {
    const growthRatePerMinute = 0.00019026 / 100;
    const startTime = new Date('2024-12-21T10:16:17.891+00:00');
    const currentTime = new Date();
    const elapsedMinutes = (currentTime.getTime() - startTime.getTime()) / (1000 * 60);
    const growthFactor = Math.exp(growthRatePerMinute * elapsedMinutes);
    function LstToSol(LstAmount) {
        return Math.floor(LstAmount * growthFactor);
    }
    function SolToLst(solAmount) {
        return Math.floor(solAmount / growthFactor);
    }
    return { LstToSol, SolToLst };
}
const { LstToSol, SolToLst } = calculateConversionsWithMinuteRate();
exports.LstToSol = LstToSol;
exports.SolToLst = SolToLst;
