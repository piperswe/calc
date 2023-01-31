import { JobOwner, type FormState, type Job, type PersonalInfo } from './form';
import { calculateAnnualWithholding } from './multipleJobsTables';
import { FilingStatus } from './types';

interface Step1 {
	a: {
		firstNameMiddleInitial: string;
		lastName: string;
		address: string;
		cityTownStateZIP: string;
	};
	b: {
		socialSecurityNumber: string;
	};
	c: {
		singleOrMarriedFilingSeparately: boolean;
		marriedFilingJointlyOrQualifyingSurvivingSpouse: boolean;
		headOfHousehold: boolean;
	};
}

export interface OutputForm {
	step1: Step1;
	step2: {
		checkThisBox: boolean;
	};
	step3: {
		multiplyNumberOfQualifyingChildren: string;
		multiplyNumberOfOtherDependents: string;
		addAmountsAbove: string;
	};
	step4: {
		otherIncomeNotFromJobs: string;
		deductions: string;
		extraWithholding: string;
	};
}

function generateStep1(personalInfo: PersonalInfo, filingStatus: FilingStatus): Step1 {
	return {
		a: {
			firstNameMiddleInitial: personalInfo.firstName,
			lastName: personalInfo.lastName,
			address: personalInfo.address,
			cityTownStateZIP: `${personalInfo.city}, ${personalInfo.state} ${personalInfo.zip}`
		},
		b: {
			socialSecurityNumber: personalInfo.socialSecurityNumber
		},
		c: {
			singleOrMarriedFilingSeparately: filingStatus === FilingStatus.Single,
			marriedFilingJointlyOrQualifyingSurvivingSpouse: filingStatus === FilingStatus.Married,
			headOfHousehold: filingStatus === FilingStatus.HeadOfHousehold
		}
	};
}

function lowestSalary(state: FormState): Job {
	let lowest = state.jobs[0];
	state.jobs.forEach((job) => {
		if (job.expectedYearlyIncome < lowest.expectedYearlyIncome) {
			lowest = job;
		}
	});
	return lowest;
}

function highestSalary(state: FormState): Job {
	let highest = state.jobs[0];
	state.jobs.forEach((job) => {
		if (job.expectedYearlyIncome > highest.expectedYearlyIncome) {
			highest = job;
		}
	});
	return highest;
}

function totalIncome(state: FormState): bigint {
	return state.jobs.reduce((total, job) => total + job.expectedYearlyIncome, 0n);
}

function eligibleForDependents(state: FormState): boolean {
	if (state.filingStatus === FilingStatus.Married) {
		return totalIncome(state) <= 400000n;
	} else {
		return totalIncome(state) <= 200000n;
	}
}

function multipleJobsBoxChecked(state: FormState) {
	return (
		state.jobs.length === 2 &&
		lowestSalary(state).expectedYearlyIncome > highestSalary(state).expectedYearlyIncome / 2n
	);
}

function getJobExtraWithholding(state: FormState, job: Job): bigint {
	if (multipleJobsBoxChecked(state)) {
		return 0n;
	}
	if (job !== highestSalary(state)) {
		return 0n;
	}
	const annual = calculateAnnualWithholding(
		job.expectedYearlyIncome,
		lowestSalary(state).expectedYearlyIncome,
		state.filingStatus
	);
	const perPeriod = annual / BigInt(job.payPeriods);
	return perPeriod;
}

function generateOutputFormFromJob(state: FormState, job: Job): OutputForm {
	const step1 = generateStep1(
		job.owner === JobOwner.Me ? state.personalInfo : state.spouseInfo,
		state.filingStatus
	);
	const multiplyNumberOfQualifyingChildren =
		BigInt(eligibleForDependents(state) ? state.dependents.children : 0) * 2000n;
	const multiplyNumberOfOtherDependents =
		BigInt(eligibleForDependents(state) ? state.dependents.other : 0) * 500n;
	return {
		step1,
		step2: {
			checkThisBox: multipleJobsBoxChecked(state)
		},
		step3: {
			multiplyNumberOfQualifyingChildren: multiplyNumberOfQualifyingChildren.toString(),
			multiplyNumberOfOtherDependents: multiplyNumberOfOtherDependents.toString(),
			addAmountsAbove: (
				multiplyNumberOfQualifyingChildren + multiplyNumberOfOtherDependents
			).toString()
		},
		step4: {
			otherIncomeNotFromJobs: state.adjustments.otherIncome.toString(),
			deductions: state.adjustments.deductions.toString(),
			extraWithholding: (
				state.adjustments.extraWithholding + getJobExtraWithholding(state, job)
			).toString()
		}
	};
}

export function generateOutputForms(state: FormState): Record<string, OutputForm> {
	const forms: [string, OutputForm][] = state.jobs.map((job) => [
		job.name,
		generateOutputFormFromJob(state, job)
	]);
	const indexedForms: Record<string, OutputForm> = {};
	for (const [name, form] of forms) {
		indexedForms[name] = form;
	}
	return indexedForms;
}
