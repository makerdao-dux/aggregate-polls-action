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
exports.markdownToHtml = exports.hasVictoryConditionComparison = exports.hasVictoryConditionDefault = exports.hasVictoryConditionAND = exports.hasVictoryConditionApproval = exports.hasVictoryConditionMajority = exports.hasVictoryConditionPlurality = exports.hasVictoryConditionInstantRunOff = exports.findVictoryCondition = void 0;
const unified_1 = require("unified");
const remark_parse_1 = __importDefault(require("remark-parse"));
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const remark_rehype_1 = __importDefault(require("remark-rehype"));
const rehype_sanitize_1 = __importDefault(require("rehype-sanitize"));
const rehype_stringify_1 = __importDefault(require("rehype-stringify"));
const constants_1 = require("./constants");
// Generic function to determine if a victory condition exists in the nested array of victory conditions
function findVictoryCondition(victoryConditions, victoryCondition) {
    const found = [];
    victoryConditions.forEach((v) => {
        if (v.type === constants_1.PollVictoryConditions.and) {
            if (victoryCondition === constants_1.PollVictoryConditions.and) {
                found.push(v);
                return;
            }
            ;
            (v.conditions || []).forEach((i) => {
                if (i.type === victoryCondition) {
                    found.push(i);
                    return;
                }
            });
        }
        if (v.type === victoryCondition) {
            found.push(v);
        }
    });
    return found;
}
exports.findVictoryCondition = findVictoryCondition;
function hasVictoryConditionInstantRunOff(victoryConditions) {
    return (findVictoryCondition(victoryConditions, constants_1.PollVictoryConditions.instantRunoff)
        .length > 0);
}
exports.hasVictoryConditionInstantRunOff = hasVictoryConditionInstantRunOff;
function hasVictoryConditionPlurality(victoryConditions) {
    return (findVictoryCondition(victoryConditions, constants_1.PollVictoryConditions.plurality)
        .length > 0);
}
exports.hasVictoryConditionPlurality = hasVictoryConditionPlurality;
function hasVictoryConditionMajority(victoryConditions) {
    return (findVictoryCondition(victoryConditions, constants_1.PollVictoryConditions.majority)
        .length > 0);
}
exports.hasVictoryConditionMajority = hasVictoryConditionMajority;
function hasVictoryConditionApproval(victoryConditions) {
    return (findVictoryCondition(victoryConditions, constants_1.PollVictoryConditions.approval)
        .length > 0);
}
exports.hasVictoryConditionApproval = hasVictoryConditionApproval;
function hasVictoryConditionAND(victoryConditions) {
    return (findVictoryCondition(victoryConditions, constants_1.PollVictoryConditions.and).length >
        0);
}
exports.hasVictoryConditionAND = hasVictoryConditionAND;
function hasVictoryConditionDefault(victoryConditions) {
    return (findVictoryCondition(victoryConditions, constants_1.PollVictoryConditions.default)
        .length > 0);
}
exports.hasVictoryConditionDefault = hasVictoryConditionDefault;
function hasVictoryConditionComparison(victoryConditions) {
    return (findVictoryCondition(victoryConditions, constants_1.PollVictoryConditions.comparison)
        .length > 0);
}
exports.hasVictoryConditionComparison = hasVictoryConditionComparison;
function markdownToHtml(markdown) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, unified_1.unified)()
            .use(remark_parse_1.default)
            .use(remark_gfm_1.default)
            .use(remark_rehype_1.default)
            .use(rehype_sanitize_1.default)
            .use(rehype_stringify_1.default)
            .process(markdown);
        return result.toString().replace(/<a href/g, '<a target="_blank" href');
    });
}
exports.markdownToHtml = markdownToHtml;
