"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POLLING_DB_URLS = exports.POLL_VOTE_TYPE = exports.PollInputFormat = exports.SupportedNetworks = void 0;
var SupportedNetworks;
(function (SupportedNetworks) {
    SupportedNetworks["mainnet"] = "mainnet";
    SupportedNetworks["goerli"] = "goerli";
})(SupportedNetworks = exports.SupportedNetworks || (exports.SupportedNetworks = {}));
var PollInputFormat;
(function (PollInputFormat) {
    PollInputFormat["singleChoice"] = "single-choice";
    PollInputFormat["rankFree"] = "rank-free";
    PollInputFormat["chooseFree"] = "choose-free";
})(PollInputFormat = exports.PollInputFormat || (exports.PollInputFormat = {}));
exports.POLL_VOTE_TYPE = {
    PLURALITY_VOTE: 'Plurality Voting',
    RANKED_VOTE: 'Ranked Choice IRV',
    UNKNOWN: 'Unknown',
};
exports.POLLING_DB_URLS = {
    [SupportedNetworks.mainnet]: 'https://pollingdb2-mainnet-prod.makerdux.com/api/v1',
    [SupportedNetworks.goerli]: 'https://pollingdb2-goerli-staging.makerdux.com/api/v1',
};
