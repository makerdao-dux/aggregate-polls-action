"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignTags = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
function assignTags(pollMetadata, pollTagsFilePath) {
    const tagsPath = path_1.default.join(process.cwd(), pollTagsFilePath);
    if (!(0, fs_1.existsSync)(tagsPath)) {
        throw new Error('Tags file does not exist');
    }
    const tagsFileContent = (0, fs_1.readFileSync)(tagsPath, 'utf8');
    const tags = JSON.parse(tagsFileContent);
    const polls = pollMetadata.map((poll) => (Object.assign(Object.assign({}, poll), { tags: tags[poll.pollId] || [] })));
    return polls;
}
exports.assignTags = assignTags;
