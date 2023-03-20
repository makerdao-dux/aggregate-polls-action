"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasVictoryConditionComparison = exports.hasVictoryConditionDefault = exports.hasVictoryConditionAND = exports.hasVictoryConditionApproval = exports.hasVictoryConditionMajority = exports.hasVictoryConditionPlurality = exports.hasVictoryConditionInstantRunOff = exports.findVictoryCondition = void 0;
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
