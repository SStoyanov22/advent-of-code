import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Cell, Grid } from "../../../util/grid";

const YEAR = 2024;
const DAY = 6;

// solution path: /Users/user/src/github.com/SStoyanov22/advent-of-code/years/2024/06/index.ts
// data path    : /Users/user/src/github.com/SStoyanov22/advent-of-code/years/2024/06/data.txt
// problem url  : https://adventofcode.com/2024/day/6


async function p2024day6_part1(input: string, ...params: any[]) {
	const matrix = input.trim().split('\n').map((row) => row.split(''));

	const patrolRow = matrix.findIndex((row) => row.includes('^'));
	const patrolCol = matrix[patrolRow].indexOf('^');

	const directions = [
		[-1, 0],
		[0, 1],
		[1, 0],
		[0, -1],
	];

	let dirIndex = 0;
	let pos = [patrolRow, patrolCol];
	const visited = new Set([JSON.stringify(pos)]);
	while (true) {
		const [row, col] = pos;
		const [dRow, dCol] = directions[dirIndex];
		const nextPos = [row + dRow, col + dCol];
	
		if (
			nextPos[0] < 0 || nextPos[0] >= matrix.length ||
			nextPos[1] < 0 || nextPos[1] >= matrix[0].length
		) break;
	
		if (matrix[nextPos[0]][nextPos[1]] === '#') {
			dirIndex = (dirIndex + 1) % directions.length;
			continue;
		}
	
		pos = nextPos;
	
		visited.add(JSON.stringify(pos));
	}

	return visited.size;
}

async function p2024day6_part2(input: string, ...params: any[]) {
	const matrix = input.trim().split('\n').map((row) => row.split(''));

	const patrolRow = matrix.findIndex((row) => row.includes('^'));
	const patrolCol = matrix[patrolRow].indexOf('^');

	const directions = [
		[-1, 0],
		[0, 1],
		[1, 0],
		[0, -1],
	];
	let obstructionCount = 0;

	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (!['#', '^'].includes(matrix[i][j])) {
				let dirIndex = 0;
				let pos = [patrolRow, patrolCol];
				const visited = new Set([
					JSON.stringify([...pos, ...directions[dirIndex]]),
				]);
				const modifiedMatrix = matrix.map((row) => [...row]);
				modifiedMatrix[i][j] = '#';

				while (true) {
					const [row, col] = pos;
					const [dRow, dCol] = directions[dirIndex];
					const nextPos = [row + dRow, col + dCol];

					if (
						nextPos[0] < 0 || nextPos[0] >= modifiedMatrix.length ||
						nextPos[1] < 0 || nextPos[1] >= modifiedMatrix[0].length
					) break;

					if (modifiedMatrix[nextPos[0]][nextPos[1]] === '#') {
						dirIndex = (dirIndex + 1) % directions.length;
						continue;
					}

					pos = nextPos;

					if (visited.has(JSON.stringify([...pos, ...directions[dirIndex]]))) {
						obstructionCount += 1;
						break;
					}

					visited.add(JSON.stringify([...pos, ...directions[dirIndex]]));
				}
			}
		}
	}
	return obstructionCount
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2024day6_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2024day6_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2024day6_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2024day6_part2(input));
	const part2After = performance.now();

	logSolution(6, 2024, part1Solution, part2Solution);

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
