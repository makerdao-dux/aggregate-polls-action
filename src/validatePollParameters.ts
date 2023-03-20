import {
  PollParameters,
  PollVictoryConditionAND,
  PollVictoryConditionDefault,
  PollVictoryConditionMajority,
  PollVictoryConditionComparison,
  PollVoteType,
} from './polls'
import {
  ERRORS_VALIDATE_POLL_PARAMETERS,
  PollInputFormat,
  PollVictoryConditions,
  PollResultDisplay,
  POLL_VOTE_TYPE,
} from './constants'
import {
  hasVictoryConditionInstantRunOff,
  hasVictoryConditionPlurality,
  hasVictoryConditionApproval,
  hasVictoryConditionMajority,
  hasVictoryConditionAND,
  hasVictoryConditionDefault,
  hasVictoryConditionComparison,
  findVictoryCondition,
} from './utils'

export function validatePollParameters(
  params: Record<string, unknown>
): [PollParameters | null, string[]] {
  const errors: string[] = []
  let inputFormatType = ''
  let inputFormatOptions: number[] = []
  let inputFormatAbstain = [0]

  if (!params.input_format) {
    errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.missingInputFormat)
  } else {
    // Extract the input format type
    if (typeof params.input_format === 'string') {
      // if is an string, asume is the type, and use the default options
      inputFormatType = params.input_format
    } else {
      inputFormatType = (params.input_format as any).type
      inputFormatOptions =
        (params.input_format as any).options || inputFormatOptions
      inputFormatAbstain =
        (params.input_format as any).abstain || inputFormatAbstain
    }

    if (
      inputFormatType !== PollInputFormat.rankFree &&
      inputFormatType !== PollInputFormat.singleChoice &&
      inputFormatType !== PollInputFormat.chooseFree
    ) {
      errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.invalidInputFormat)
    }
  }

  if (!params.victory_conditions) {
    errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.missingVictoryConditions)
  } else if (!Array.isArray(params.victory_conditions)) {
    errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionsNotArray)
  } else {
    const hasInstantRunOff = hasVictoryConditionInstantRunOff(
      params.victory_conditions
    )
    const hasPlurality = hasVictoryConditionPlurality(params.victory_conditions)
    const hasApproval = hasVictoryConditionApproval(params.victory_conditions)
    const hasMajority = hasVictoryConditionMajority(params.victory_conditions)
    const hasAND = hasVictoryConditionAND(params.victory_conditions)
    const hasDefault = hasVictoryConditionDefault(params.victory_conditions)
    const hasComparison = hasVictoryConditionComparison(
      params.victory_conditions
    )

    params.victory_conditions.forEach((v) => {
      if (!v.type) {
        errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.invalidVictoryConditions)
      } else if (
        [
          PollVictoryConditions.and,
          PollVictoryConditions.approval,
          PollVictoryConditions.comparison,
          PollVictoryConditions.default,
          PollVictoryConditions.instantRunoff,
          PollVictoryConditions.majority,
          PollVictoryConditions.plurality,
        ].indexOf(v.type) === -1
      ) {
        errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.invalidVictoryConditions)
      }
    })

    // Can not combine instant runoff and plurality
    if (hasInstantRunOff && hasPlurality) {
      errors.push(
        ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionsInstantRunOffAndPluralityCanNotBeCombined
      )
    }

    // Can not combine instant runoff and majority
    if (hasInstantRunOff && hasMajority) {
      errors.push(
        ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionsInstantRunOffAndMajoritynNotBeCombined
      )
    }

    // Rank free requires instant runoff condition
    if (inputFormatType !== PollInputFormat.rankFree && hasInstantRunOff) {
      errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.instantRunoffRequiresRankFree)
    }

    // plurality requires requires single_choice
    if (inputFormatType !== PollInputFormat.singleChoice && hasPlurality) {
      errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.pluralityRequiresSingleChoice)
    }

    // Approval requires input_format choose_free
    if (inputFormatType !== PollInputFormat.chooseFree && hasApproval) {
      errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.approvalRequiresChooseFree)
    }

    // Validate that the AND victory condition has conditions inside
    if (hasAND) {
      const andConditions = findVictoryCondition(
        params.victory_conditions,
        PollVictoryConditions.and
      ) as PollVictoryConditionAND[]

      andConditions.forEach((condition: PollVictoryConditionAND) => {
        if (!condition.conditions || condition.conditions?.length === 0) {
          errors.push(
            ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionANDRequiresConditions
          )
        }
      })
    }

    // If it has default victory condition, the default has to have a value
    if (hasDefault) {
      const defaultConditions = findVictoryCondition(
        params.victory_conditions,
        PollVictoryConditions.default
      ) as PollVictoryConditionDefault[]

      defaultConditions.forEach((condition: PollVictoryConditionDefault) => {
        if (typeof condition.value === 'undefined') {
          errors.push(
            ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionDefaultRequiresDefaultValue
          )
        }
      })
    }

    // If it has a majority condition, check that the majority has a value
    if (hasMajority) {
      const majorityConditions = findVictoryCondition(
        params.victory_conditions,
        PollVictoryConditions.majority
      ) as PollVictoryConditionMajority[]

      majorityConditions.forEach((condition: PollVictoryConditionMajority) => {
        if (typeof condition.percent === 'undefined') {
          errors.push(
            ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionMajorityRequiresAPercentValue
          )
        }
      })
    }

    // If it has a comparision condition, check that the comparison has a comparator and a value
    if (hasComparison) {
      const comparisonConditions = findVictoryCondition(
        params.victory_conditions,
        PollVictoryConditions.comparison
      ) as PollVictoryConditionComparison[]

      comparisonConditions.forEach(
        (condition: PollVictoryConditionComparison) => {
          if (
            !condition.comparator ||
            ['>', '>=', '<=', '=', '<'].indexOf(condition.comparator) === -1
          ) {
            errors.push(
              ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionComparisonRequiresValidComparator
            )
          }

          if (!condition.value || typeof condition.value !== 'number') {
            errors.push(
              ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionComparisonRequiresValidValue
            )
          }
        }
      )
    }
  }

  // Validate result display
  if (!params.result_display) {
    errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.requiredResultDisplay)
  } else {
    // input_format single-choice requires single-vote-breakdown result_display
    if (
      inputFormatType === PollInputFormat.singleChoice &&
      params.result_display !== PollResultDisplay.singleVoteBreakdown
    ) {
      errors.push(
        ERRORS_VALIDATE_POLL_PARAMETERS.singleChoiceRequiresSingleVoteBreakdownDisplay
      )
    }

    // input_format rank-free requires instant-runoff-breakdown result_display
    if (
      inputFormatType === PollInputFormat.rankFree &&
      params.result_display !== PollResultDisplay.instantRunoffBreakdown
    ) {
      errors.push(
        ERRORS_VALIDATE_POLL_PARAMETERS.rankFreeRequiresInstantRunoffBreakdownDisplay
      )
    }

    // Approval requires approval-breakdown result_display
    if (
      hasVictoryConditionApproval(params.victory_conditions as any) &&
      params.result_display !== PollResultDisplay.approvalBreakdown
    ) {
      errors.push(
        ERRORS_VALIDATE_POLL_PARAMETERS.approvalRequiresApprovalBreakdownDisplay
      )
    }
  }

  // There are errors, return a empty object and the list of errors
  if (errors.length > 0) {
    return [null, errors]
  } else {
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
      } as PollParameters,
      [],
    ]
  }
}

// Formats old vote types to new poll parameters
export function oldVoteTypeToNewParameters(
  voteType: PollVoteType
): [PollParameters, string[]] {
  if (
    voteType === POLL_VOTE_TYPE.PLURALITY_VOTE ||
    voteType === POLL_VOTE_TYPE.UNKNOWN
  ) {
    return [
      {
        inputFormat: {
          type: PollInputFormat.singleChoice,
          abstain: [0],
          options: [],
        },
        resultDisplay: PollResultDisplay.singleVoteBreakdown,
        victoryConditions: [
          {
            type: PollVictoryConditions.plurality,
          },
        ],
      },
      [],
    ]
  } else {
    return [
      {
        inputFormat: {
          type: PollInputFormat.rankFree,
          abstain: [0],
          options: [],
        },
        resultDisplay: PollResultDisplay.instantRunoffBreakdown,
        victoryConditions: [
          {
            type: PollVictoryConditions.instantRunoff,
          },
        ],
      },
      [],
    ]
  }
}
