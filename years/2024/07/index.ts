import _, { eq } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2024;
const DAY = 7;

// solution path: /Users/user/src/github.com/SStoyanov22/advent-of-code/years/2024/07/index.ts
// data path    : /Users/user/src/github.com/SStoyanov22/advent-of-code/years/2024/07/data.txt
// problem url  : https://adventofcode.com/2024/day/7
function testEquation(
	numbers: number[],
	target: number,
	combine: (num1: number, num2: number) => number[]
): boolean {
	if(numbers.length === 1){
		return numbers[0] === target
	}
	return numbers[0] > target ? 
		false : combine(numbers[0], numbers[1]).some(
			(num) => testEquation(
				[num, ...numbers.slice(2)],
				target,
				combine))
}

function readEquations(input: string): Map<number, number[]> {
	return new Map(
		input.trim().split('\n').map(line => {
		  const [key, values] = line.split(':').map(part => part.trim());
		  return [Number(key), values.split(' ').map(Number)];
		}))
}

async function p2024day7_part1(input: string, ...params: any[]) {
	const equations = readEquations(input);
	
	return Array.from(equations)
		.filter(([target, numbers]) =>  // filter for correct equations
			testEquation(
				numbers, 
				target, 
				(num1, num2) => [num1 + num2, num1 * num2]))
		.map(([target]) => target) // collect only targets of equations
		.reduce((sum, target) => sum + target, 0) // sum targets
};

async function p2024day7_part2(input: string, ...params: any[]) {
	const equations = readEquations(input);
	
	return Array.from(equations)
		.filter(([target, numbers]) =>  // filter for correct equations
			testEquation(
				numbers, 
				target, 
				(num1, num2) => [num1 + num2, num1 * num2, parseInt(`${num1}${num2}`)]))
		.map(([target]) => target) // collect only targets of equations
		.reduce((sum, target) => sum + target, 0) // sum targets
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2024day7_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2024day7_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2024day7_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2024day7_part2(input));
	const part2After = performance.now();

	logSolution(7, 2024, part1Solution, part2Solution);

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
