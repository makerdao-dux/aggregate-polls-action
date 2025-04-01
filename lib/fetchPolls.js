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
exports.fetchSubgraphPolls = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
//get latest polls created by whitelisted addresses after the start date
//TODO: add pagination to handle more than 1000 polls
function fetchSubgraphPolls(network, argStartUnix = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios_1.default.post(constants_1.SUBGRAPH_URLS[network], {
            query: `
        query filteredPolls($argStartUnix: BigInt){polls(orderBy: blockCreated, orderDirection: desc, first: 1000, where: {startDate_gte: $argStartUnix, creator_in: ["0xdc7ee5da5d011bc98cf030968659f3ee92232843", "0x8541ccfc6e7eacebd233c6789a0fbf7c708b0e68", "0x777cc2b5ec4c50b5aec0c0d9f8d1b8599ef2a54c"]}) {
          id
          creator
          startDate
          endDate
          multiHash
          url
          blockCreated
        }
      }
      `,
            variables: { argStartUnix }
        });
        const subgraphPollsData = res.data.data.polls
            .map(({ creator, id, startDate, endDate, multiHash, url, blockCreated }) => ({
            creator,
            pollId: Number(id),
            startDate: new Date(Number(startDate) * 1000).toISOString(),
            endDate: new Date(Number(endDate) * 1000).toISOString(),
            multiHash,
            url,
            blockCreated: Number(blockCreated)
        }))
            // Removes duplicate entries
            .reduce((acum, poll, i, pollArray) => {
            if (i === pollArray.findIndex((p) => p.multiHash === poll.multiHash)) {
                acum.push(Object.assign(Object.assign({}, poll), { slug: poll.multiHash.slice(0, 8) }));
            }
            return acum;
        }, []);
        return subgraphPollsData;
    });
}
exports.fetchSubgraphPolls = fetchSubgraphPolls;
