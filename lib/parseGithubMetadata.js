"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGithubMetadata = void 0;
function parseGithubMetadata(pollsWithRawMetadata) {
    const polls = pollsWithRawMetadata.map(({ pollId, rawMetadata }) => {
        // RegEx to extract title from rawMetadata string
        const titleRegex = /(?<=title: )(.*?)(?=\n)/i;
        const title = rawMetadata.match(titleRegex);
        return {
            pollId,
            title: title ? title[0] : '',
        };
    });
    return polls;
}
exports.parseGithubMetadata = parseGithubMetadata;
