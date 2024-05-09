"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERRORS_VALIDATE_POLL_PARAMETERS = exports.PollResultDisplay = exports.PollVictoryConditions = exports.PollInputFormat = exports.POLLING_DB_URLS = exports.POLL_VOTE_TYPE = exports.SupportedNetworks = void 0;
var SupportedNetworks;
(function (SupportedNetworks) {
    SupportedNetworks["mainnet"] = "mainnet";
    SupportedNetworks["tenderly"] = "tenderly";
})(SupportedNetworks = exports.SupportedNetworks || (exports.SupportedNetworks = {}));
exports.POLL_VOTE_TYPE = {
    PLURALITY_VOTE: 'Plurality Voting',
    RANKED_VOTE: 'Ranked Choice IRV',
    UNKNOWN: 'Unknown',
};
exports.POLLING_DB_URLS = {
    [SupportedNetworks.mainnet]: 'https://pollingdb2-mainnet-prod.makerdux.com/api/v1',
    [SupportedNetworks.tenderly]: 'https://pollingdb2-tenderly-staging.makerdux.com/api/v1',
};
// Poll parameters
var PollInputFormat;
(function (PollInputFormat) {
    PollInputFormat["singleChoice"] = "single-choice";
    PollInputFormat["rankFree"] = "rank-free";
    PollInputFormat["chooseFree"] = "choose-free";
})(PollInputFormat = exports.PollInputFormat || (exports.PollInputFormat = {}));
var PollVictoryConditions;
(function (PollVictoryConditions) {
    PollVictoryConditions["and"] = "and";
    PollVictoryConditions["majority"] = "majority";
    PollVictoryConditions["approval"] = "approval";
    PollVictoryConditions["plurality"] = "plurality";
    PollVictoryConditions["instantRunoff"] = "instant-runoff";
    PollVictoryConditions["default"] = "default";
    PollVictoryConditions["comparison"] = "comparison";
})(PollVictoryConditions = exports.PollVictoryConditions || (exports.PollVictoryConditions = {}));
var PollResultDisplay;
(function (PollResultDisplay) {
    PollResultDisplay["singleVoteBreakdown"] = "single-vote-breakdown";
    PollResultDisplay["instantRunoffBreakdown"] = "instant-runoff-breakdown";
    PollResultDisplay["approvalBreakdown"] = "approval-breakdown";
})(PollResultDisplay = exports.PollResultDisplay || (exports.PollResultDisplay = {}));
exports.ERRORS_VALIDATE_POLL_PARAMETERS = {
    missingInputFormat: 'Missing input_format on poll parameters',
    invalidInputFormat: 'Invalid input_format. Supported values are rank-free, choose-free and single-choice',
    missingVictoryConditions: 'Missing victory_conditions',
    victoryConditionsNotArray: 'victory_conditions should be an array of victory conditions',
    invalidVictoryConditions: 'victory_conditions should be objects',
    victoryConditionsNotValid: 'victory_conditions must include a valid condition. Valid conditions are "plurality", "instant_runoff", "approval" or "majority"',
    victoryConditionsInstantRunOffAndPluralityCanNotBeCombined: 'victory_conditions combination not valid. instant-runoff and plurality can not be combined together.',
    victoryConditionsInstantRunOffAndMajoritynNotBeCombined: 'victory_conditions combination not valid. instant-runoff and majority can not be combined together.',
    victoryConditionANDRequiresConditions: 'victory_condition AND requires inserting nested conditions',
    victoryConditionDefaultRequiresDefaultValue: 'victory_condition default requires a value',
    victoryConditionMajorityRequiresAPercentValue: 'victory_condition majority requires a percent',
    victoryConditionComparisonRequiresValidComparator: 'victory_condition comparison requires a valid comparator (>, >=, =, <=, <).',
    victoryConditionComparisonRequiresValidValue: 'victory_condition comparison requires a valid value',
    instantRunoffRequiresRankFree: 'victory_condition instant-runoff requires input_format rank-free',
    pluralityRequiresSingleChoice: 'victory_condition plurality requires input_format single-choice',
    approvalRequiresChooseFree: 'victory_condition approval requires input_format choose-free',
    // TODO: Include more result_displays when allowed
    requiredResultDisplay: 'result_display is required. Available values are "instant-runoff-breakdown" or "single-vote-breakdown"',
    singleChoiceRequiresSingleVoteBreakdownDisplay: 'input_format single-choice requires single-vote-breakdown result_display',
    rankFreeRequiresInstantRunoffBreakdownDisplay: 'input_format rank-free requires instant-runoff-breakdown result_display',
    approvalRequiresApprovalBreakdownDisplay: 'victory_condition approval requires approval-breakdown result_display',
};
