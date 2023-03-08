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
function fetchGithubPolls(parsedSpockPolls) {
    return __awaiter(this, void 0, void 0, function* () {
        const spockPollsInChunks = [];
        const chunkSize = 20;
        const pollsRes = [];
        for (let i = 0; i < parsedSpockPolls.length; i += chunkSize) {
            spockPollsInChunks.push(parsedSpockPolls.slice(i, i + chunkSize));
        }
        for (let j = 0; j < spockPollsInChunks.length; j++) {
            const settledPolls = yield Promise.allSettled(spockPollsInChunks[j].map(({ pollId, url }) => __awaiter(this, void 0, void 0, function* () {
                const res = yield axios_1.default.get(url);
                return {
                    pollId,
                    rawMetadata: res.data,
                };
            })));
            pollsRes.push(...settledPolls);
        }
        const polls = pollsRes
            .map((promise) => (promise.status === 'fulfilled' ? promise.value : null))
            .filter((poll) => !!poll);
        return polls;
    });
}
exports.default = fetchGithubPolls;
