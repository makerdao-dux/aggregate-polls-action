"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollInputFormat = exports.POLL_VOTE_TYPE = void 0;
exports.POLL_VOTE_TYPE = {
    PLURALITY_VOTE: 'Plurality Voting',
    RANKED_VOTE: 'Ranked Choice IRV',
    UNKNOWN: 'Unknown',
};
var PollInputFormat;
(function (PollInputFormat) {
    PollInputFormat["singleChoice"] = "single-choice";
    PollInputFormat["rankFree"] = "rank-free";
    PollInputFormat["chooseFree"] = "choose-free";
})(PollInputFormat = exports.PollInputFormat || (exports.PollInputFormat = {}));
