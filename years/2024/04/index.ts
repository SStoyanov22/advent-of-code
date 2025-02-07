import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Cell, Grid } from "../../../util/grid";

const YEAR = 2024;
const DAY = 4;

// solution path: /Users/user/src/github.com/SStoyanov22/advent-of-code/years/2024/04/index.ts
// data path    : /Users/user/src/github.com/SStoyanov22/advent-of-code/years/2024/04/data.txt
// problem url  : https://adventofcode.com/2024/day/4

async function p2024day4_part1(input: string, ...params: any[]) {
	const grid = new Grid({ serialized: input });

	const search = "XMAS";
	const searches = ["east", "southeast", "south", "southwest", "west", "northwest", "north", "northeast"] as const;

	let targetCount = 0;
	for (const cell of grid) {
		if (cell.value === search[0]) {
			for (const direction of searches) {
				const candidates: Cell[] = [cell];
				for (let i = 1; i < search.length; ++i) {
					const candidate = (candidates[i - 1] as any)[direction]() as Cell;
					if (candidate) {
						candidates.push(candidate);
					} else {
						break;
					}
				}
				if (candidates.length === search.length) {
					let good = true;
					for (let i = 0; i < search.length; ++i) {
						if (candidates[i].value !== search[i]) {
							good = false;
							break;
						}
					}
					if (good) {
						targetCount++;
					}
				}
			}
		}
	}
	return targetCount;
}

async function p2024day4_part2(input: string, ...params: any[]) {
	const grid = new Grid({serialized: input});
	const search = ["MAS", "SAM"];
	let count = 0;

	for(const cell of grid){
		if (cell.isEdge()) {
			continue;
		}
		const d1 = [cell.northwest(), cell, cell.southeast()].map(c => c?.value).join("");
		const d2 = [cell.southwest(), cell, cell.northeast()].map(c => c?.value).join("");

		if(search.indexOf(d1) > -1 && search.indexOf(d2) > - 1){
			count++;
		}
		
	}
	return count;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2024day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2024day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2024day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2024day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2024, part1Solution, part2Solution);

	log(chalk.gray("--- Performance ---"));
	log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
