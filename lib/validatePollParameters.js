"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oldVoteTypeToNewParameters = exports.validatePollParameters = void 0;
const constants_1 = require("./constants");
const utils_1 = require("./utils");
function validatePollParameters(params) {
    const errors = [];
    let inputFormatType = '';
    let inputFormatOptions = [];
    let inputFormatAbstain = [0];
    if (!params.input_format) {
        errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.missingInputFormat);
    }
    else {
        // Extract the input format type
        if (typeof params.input_format === 'string') {
            // if is an string, asume is the type, and use the default options
            inputFormatType = params.input_format;
        }
        else {
            inputFormatType = params.input_format.type;
            inputFormatOptions =
                params.input_format.options || inputFormatOptions;
            inputFormatAbstain =
                params.input_format.abstain || inputFormatAbstain;
        }
        if (inputFormatType !== constants_1.PollInputFormat.rankFree &&
            inputFormatType !== constants_1.PollInputFormat.singleChoice &&
            inputFormatType !== constants_1.PollInputFormat.chooseFree) {
            errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.invalidInputFormat);
        }
    }
    if (!params.victory_conditions) {
        errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.missingVictoryConditions);
    }
    else if (!Array.isArray(params.victory_conditions)) {
        errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionsNotArray);
    }
    else {
        const hasInstantRunOff = (0, utils_1.hasVictoryConditionInstantRunOff)(params.victory_conditions);
        const hasPlurality = (0, utils_1.hasVictoryConditionPlurality)(params.victory_conditions);
        const hasApproval = (0, utils_1.hasVictoryConditionApproval)(params.victory_conditions);
        const hasMajority = (0, utils_1.hasVictoryConditionMajority)(params.victory_conditions);
        const hasAND = (0, utils_1.hasVictoryConditionAND)(params.victory_conditions);
        const hasDefault = (0, utils_1.hasVictoryConditionDefault)(params.victory_conditions);
        const hasComparison = (0, utils_1.hasVictoryConditionComparison)(params.victory_conditions);
        params.victory_conditions.forEach((v) => {
            if (!v.type) {
                errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.invalidVictoryConditions);
            }
            else if ([
                constants_1.PollVictoryConditions.and,
                constants_1.PollVictoryConditions.approval,
                constants_1.PollVictoryConditions.comparison,
                constants_1.PollVictoryConditions.default,
                constants_1.PollVictoryConditions.instantRunoff,
                constants_1.PollVictoryConditions.majority,
                constants_1.PollVictoryConditions.plurality,
            ].indexOf(v.type) === -1) {
                errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.invalidVictoryConditions);
            }
        });
        // Can not combine instant runoff and plurality
        if (hasInstantRunOff && hasPlurality) {
            errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionsInstantRunOffAndPluralityCanNotBeCombined);
        }
        // Can not combine instant runoff and majority
        if (hasInstantRunOff && hasMajority) {
            errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionsInstantRunOffAndMajoritynNotBeCombined);
        }
        // Rank free requires instant runoff condition
        if (inputFormatType !== constants_1.PollInputFormat.rankFree && hasInstantRunOff) {
            errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.instantRunoffRequiresRankFree);
        }
        // plurality requires requires single_choice
        if (inputFormatType !== constants_1.PollInputFormat.singleChoice && hasPlurality) {
            errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.pluralityRequiresSingleChoice);
        }
        // Approval requires input_format choose_free
        if (inputFormatType !== constants_1.PollInputFormat.chooseFree && hasApproval) {
            errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.approvalRequiresChooseFree);
        }
        // Validate that the AND victory condition has conditions inside
        if (hasAND) {
            const andConditions = (0, utils_1.findVictoryCondition)(params.victory_conditions, constants_1.PollVictoryConditions.and);
            andConditions.forEach((condition) => {
                var _a;
                if (!condition.conditions || ((_a = condition.conditions) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                    errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionANDRequiresConditions);
                }
            });
        }
        // If it has default victory condition, the default has to have a value
        if (hasDefault) {
            const defaultConditions = (0, utils_1.findVictoryCondition)(params.victory_conditions, constants_1.PollVictoryConditions.default);
            defaultConditions.forEach((condition) => {
                if (typeof condition.value === 'undefined') {
                    errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionDefaultRequiresDefaultValue);
                }
            });
        }
        // If it has a majority condition, check that the majority has a value
        if (hasMajority) {
            const majorityConditions = (0, utils_1.findVictoryCondition)(params.victory_conditions, constants_1.PollVictoryConditions.majority);
            majorityConditions.forEach((condition) => {
                if (typeof condition.percent === 'undefined') {
                    errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionMajorityRequiresAPercentValue);
                }
            });
        }
        // If it has a comparision condition, check that the comparison has a comparator and a value
        if (hasComparison) {
            const comparisonConditions = (0, utils_1.findVictoryCondition)(params.victory_conditions, constants_1.PollVictoryConditions.comparison);
            comparisonConditions.forEach((condition) => {
                if (!condition.comparator ||
                    ['>', '>=', '<=', '=', '<'].indexOf(condition.comparator) === -1) {
                    errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionComparisonRequiresValidComparator);
                }
                if (!condition.value || typeof condition.value !== 'number') {
                    errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionComparisonRequiresValidValue);
                }
            });
        }
    }
    // Validate result display
    if (!params.result_display) {
        errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.requiredResultDisplay);
    }
    else {
        // input_format single-choice requires single-vote-breakdown result_display
        if (inputFormatType === constants_1.PollInputFormat.singleChoice &&
            params.result_display !== constants_1.PollResultDisplay.singleVoteBreakdown) {
            errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.singleChoiceRequiresSingleVoteBreakdownDisplay);
        }
        // input_format rank-free requires instant-runoff-breakdown result_display
        if (inputFormatType === constants_1.PollInputFormat.rankFree &&
            params.result_display !== constants_1.PollResultDisplay.instantRunoffBreakdown) {
            errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.rankFreeRequiresInstantRunoffBreakdownDisplay);
        }
        // Approval requires approval-breakdown result_display
        if ((0, utils_1.hasVictoryConditionApproval)(params.victory_conditions) &&
            params.result_display !== constants_1.PollResultDisplay.approvalBreakdown) {
            errors.push(constants_1.ERRORS_VALIDATE_POLL_PARAMETERS.approvalRequiresApprovalBreakdownDisplay);
        }
    }
    // There are errors, return a empty object and the list of errors
    if (errors.length > 0) {
        return [null, errors];
    }
    else {
        // Correct object
        return [
            {
                inputFormat: {
                    type: inputFormatType,
                    abstain: inputFormatAbstain,
                    options: inputFormatOptions,
                },
                resultDisplay: params.result_display,
                victoryConditions: params.victory_conditions,
            },
            [],
        ];
    }
}
exports.validatePollParameters = validatePollParameters;
// Formats old vote types to new poll parameters
function oldVoteTypeToNewParameters(voteType) {
    if (voteType === constants_1.POLL_VOTE_TYPE.PLURALITY_VOTE ||
        voteType === constants_1.POLL_VOTE_TYPE.UNKNOWN) {
        return [
            {
                inputFormat: {
                    type: constants_1.PollInputFormat.singleChoice,
                    abstain: [0],
                    options: [],
                },
                resultDisplay: constants_1.PollResultDisplay.singleVoteBreakdown,
                victoryConditions: [
                    {
                        type: constants_1.PollVictoryConditions.plurality,
                    },
                ],
            },
            [],
        ];
    }
    else {
        return [
            {
                inputFormat: {
                    type: constants_1.PollInputFormat.rankFree,
                    abstain: [0],
                    options: [],
                },
                resultDisplay: constants_1.PollResultDisplay.instantRunoffBreakdown,
                victoryConditions: [
                    {
                        type: constants_1.PollVictoryConditions.instantRunoff,
                    },
                ],
            },
            [],
        ];
    }
}
exports.oldVoteTypeToNewParameters = oldVoteTypeToNewParameters;
