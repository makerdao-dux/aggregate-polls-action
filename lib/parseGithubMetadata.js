"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGithubMetadata = void 0;
const gray_matter_1 = __importDefault(require("gray-matter"));
const constants_1 = require("./constants");
const fetchPollTags_1 = require("./fetchPollTags");
function parseGithubMetadata(pollsWithRawMetadata, pollTagsFilePath) {
    const polls = pollsWithRawMetadata
        .map(({ pollId, rawMetadata }) => {
        const { data: pollMetadata } = (0, gray_matter_1.default)(rawMetadata);
        const title = pollMetadata.title || '';
        const voteType = (pollMetadata === null || pollMetadata === void 0 ? void 0 : pollMetadata.vote_type) ||
            constants_1.POLL_VOTE_TYPE.UNKNOWN;
        const pollType = pollMetadata.parameters
            ? validatePollType(pollMetadata.parameters)
            : oldVoteTypeToNew(voteType);
        return {
            pollId,
            title,
            type: pollType,
        };
    })
        .filter((poll) => poll.type);
    const pollsWithTags = (0, fetchPollTags_1.assignTags)(polls, pollTagsFilePath);
    return pollsWithTags;
}
exports.parseGithubMetadata = parseGithubMetadata;
const validatePollType = (params) => {
    let inputFormatType = '';
    if (typeof params.input_format === 'string') {
        inputFormatType = params.input_format;
    }
    else {
        inputFormatType = params.input_format.type;
    }
    if (inputFormatType === constants_1.PollInputFormat.rankFree ||
        inputFormatType === constants_1.PollInputFormat.singleChoice ||
        inputFormatType === constants_1.PollInputFormat.chooseFree) {
        return inputFormatType;
    }
    else {
        return null;
    }
};
const oldVoteTypeToNew = (voteType) => {
    if (voteType === constants_1.POLL_VOTE_TYPE.PLURALITY_VOTE ||
        voteType === constants_1.POLL_VOTE_TYPE.UNKNOWN) {
        return constants_1.PollInputFormat.singleChoice;
    }
    else {
        return constants_1.PollInputFormat.rankFree;
    }
};
