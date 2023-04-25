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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGithubMetadata = void 0;
const gray_matter_1 = __importDefault(require("gray-matter"));
const valid_url_1 = __importDefault(require("valid-url"));
const constants_1 = require("./constants");
const fetchPollTags_1 = require("./fetchPollTags");
const validatePollParameters_1 = require("./validatePollParameters");
const utils_1 = require("./utils");
function parseGithubMetadata(pollsWithRawMetadata, pollTagsFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const polls = yield Promise.all(pollsWithRawMetadata.map((_a) => __awaiter(this, void 0, void 0, function* () {
            var { rawMetadata } = _a, poll = __rest(_a, ["rawMetadata"]);
            const { data: pollMetadata, content: markdownContent } = (0, gray_matter_1.default)(rawMetadata);
            const content = yield (0, utils_1.markdownToHtml)(markdownContent);
            const title = (pollMetadata === null || pollMetadata === void 0 ? void 0 : pollMetadata.title) || '';
            const summary = (pollMetadata === null || pollMetadata === void 0 ? void 0 : pollMetadata.summary) || '';
            const options = (pollMetadata === null || pollMetadata === void 0 ? void 0 : pollMetadata.options) || {};
            const discussionLink = (pollMetadata === null || pollMetadata === void 0 ? void 0 : pollMetadata.discussion_link) &&
                valid_url_1.default.isUri(pollMetadata.discussion_link)
                ? pollMetadata.discussion_link
                : null;
            // Parse old vote type
            const voteType = (pollMetadata === null || pollMetadata === void 0 ? void 0 : pollMetadata.vote_type) ||
                constants_1.POLL_VOTE_TYPE.UNKNOWN;
            const [parameters, errorParameters] = pollMetadata.parameters
                ? (0, validatePollParameters_1.validatePollParameters)(pollMetadata.parameters)
                : (0, validatePollParameters_1.oldVoteTypeToNewParameters)(voteType);
            if (errorParameters.length > 0 || !parameters) {
                throw new Error(`Invalid poll parameters for poll ${poll.pollId}. ${errorParameters}`);
            }
            let startDate, endDate;
            //poll coming from poll create page
            if (new Date(poll.startDate).getTime() === 0 &&
                new Date(poll.endDate).getTime() === 0) {
                startDate = pollMetadata.start_date;
                endDate = pollMetadata.end_date;
            }
            else {
                //poll coming from onchain
                startDate = poll.startDate;
                endDate = poll.endDate;
            }
            return Object.assign(Object.assign({}, poll), { startDate,
                endDate,
                title,
                summary,
                discussionLink,
                content,
                options,
                parameters });
        })));
        const filteredPolls = polls.filter((poll) => !!poll);
        const pollsWithTags = (0, fetchPollTags_1.assignTags)(filteredPolls, pollTagsFilePath);
        return pollsWithTags;
    });
}
exports.parseGithubMetadata = parseGithubMetadata;
