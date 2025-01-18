import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2024;
const DAY = 5;

// solution path: /Users/user/src/github.com/SStoyanov22/advent-of-code/years/2024/05/index.ts
// data path    : /Users/user/src/github.com/SStoyanov22/advent-of-code/years/2024/05/data.txt
// problem url  : https://adventofcode.com/2024/day/5
// Part 2
const isUpdateCorrect = (rules: number[][], update: number[]): boolean =>
	!rules.some(([a, b]) =>
		update.includes(a) && update.includes(b) &&
		update.indexOf(a) > update.indexOf(b)
	);
function orderUpdate(rules: number[][], update: number[]): number[] {
	while (!isUpdateCorrect(rules, update)) {
		rules.forEach(([a, b]) => {
			const indexA = update.indexOf(a);
			const indexB = update.indexOf(b);
			if (indexA > -1 && indexB > -1 && indexA > indexB) {
				[update[indexA], update[indexB]] = [
					update[indexB],
					update[indexA],
				];
			}
		});
	}
	return update;
}

async function p2024day5_part1(input: string, ...params: any[]) {
	const [rules, updates] = input.split('\n\n').map(
		(el, i) => el.split('\n').map(
			(el) => el.trim().split(['|', ','][i]).map(Number))
	);

	const isUpdateCorrect = (rules: number[][], update: number[]): boolean =>
	!rules.some(([a, b]) =>
		update.includes(a) && update.includes(b) &&
		update.indexOf(a) > update.indexOf(b)
	);
	
	return updates
		.filter(update => isUpdateCorrect(rules, update))
		.reduce((acc, update) => acc + update[Math.floor(update.length / 2)], 0);
}

async function p2024day5_part2(input: string, ...params: any[]) {
	const [rules, updates] = input.split('\n\n').map(
		(el, i) => el.split('\n').map(
			(el) => el.trim().split(['|', ','][i]).map(Number))
	);
	return updates
	.filter(update => !isUpdateCorrect(rules, update))
	.reduce(
		(acc, update) =>
			acc +(orderUpdate(rules,update)[Math.floor(update.length / 2)]),
			0
	)
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2024day5_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2024day5_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2024day5_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2024day5_part2(input));
	const part2After = performance.now();

	logSolution(5, 2024, part1Solution, part2Solution);

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
