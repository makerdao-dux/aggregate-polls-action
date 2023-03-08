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
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
function fetchSpockPolls(network) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios_1.default.post(constants_1.POLLING_DB_URLS[network], { operationName: 'activePolls' });
        const spockPollsData = res.data.data.activePolls.edges
            .map(({ node: { pollId, url, multiHash } }) => ({ pollId, url, multiHash }))
            // Removes duplicate entries
            .reduce((acum, { pollId, url, multiHash }, i, pollArray) => {
            if (i === pollArray.findIndex((p) => p.multiHash === multiHash)) {
                acum.push({ pollId, url });
            }
            return acum;
        }, []);
        return spockPollsData;
    });
}
exports.default = fetchSpockPolls;
