"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const core = __importStar(require("@actions/core"));
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const constants_1 = require("./constants");
const fetchGithubPolls_1 = __importDefault(require("./fetchGithubPolls"));
const fetchPolls_1 = require("./fetchPolls");
const parseGithubMetadata_1 = require("./parseGithubMetadata");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pollTagsFilePath = core.getInput('tags-file');
            const network = core.getInput('network');
            const outputFilePath = core.getInput('output-file');
            const hashFilePath = core.getInput('hash-file');
            if (network !== constants_1.SupportedNetworks.mainnet &&
                network !== constants_1.SupportedNetworks.tenderly) {
                throw new Error('Unsupported network input parameter');
            }
            const [spockPolls, subgraphPolls] = yield Promise.all([
                (0, fetchPolls_1.fetchSpockPolls)(network),
                (0, fetchPolls_1.fetchSubgraphPolls)(network)
            ]);
            const cutoffDate = new Date('2025-03-01T00:00:00Z'); // TODO: Set to cutoff date
            const fetchedPolls = [
                ...spockPolls.filter(poll => new Date(poll.startDate) < cutoffDate),
                ...subgraphPolls.filter(poll => new Date(poll.startDate) >= cutoffDate)
            ];
            const pollsWithRawMetadata = yield (0, fetchGithubPolls_1.default)(fetchedPolls);
            const polls = yield (0, parseGithubMetadata_1.parseGithubMetadata)(pollsWithRawMetadata, pollTagsFilePath);
            const pollsFile = JSON.stringify(polls, null, 2);
            const aggregatedPollsHash = (0, crypto_1.createHash)('sha256')
                .update(pollsFile)
                .digest('hex');
            const hashFile = JSON.stringify({ hash: aggregatedPollsHash }, null, 2);
            (0, fs_1.writeFileSync)(outputFilePath, pollsFile);
            (0, fs_1.writeFileSync)(hashFilePath, hashFile);
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
run();
