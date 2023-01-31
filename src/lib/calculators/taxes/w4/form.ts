import { FilingStatus } from './types';

export enum JobOwner {
	Me = 'me',
	Spouse = 'spouse'
}

export interface Job {
	name: string;
	expectedYearlyIncome: bigint;
	payPeriods: number;
	owner: JobOwner;
}

export interface PersonalInfo {
	firstName: string;
	lastName: string;
	socialSecurityNumber: string;
	address: string;
	city: string;
	state: string;
	zip: string;
}

export interface FormState {
	filingStatus: FilingStatus;
	personalInfo: PersonalInfo;
	spouseInfo: PersonalInfo;
	jobs: Job[];
	dependents: {
		children: number;
		other: number;
	};
	adjustments: {
		otherIncome: bigint;
		deductions: bigint;
		extraWithholding: bigint;
	};
}

function defaultPersonalInfo(): PersonalInfo {
	return {
		firstName: '',
		lastName: '',
		socialSecurityNumber: '',
		address: '',
		city: '',
		state: '',
		zip: ''
	};
}

export function defaultJob(): Job {
	return {
		name: '',
		expectedYearlyIncome: 0n,
		payPeriods: 26,
		owner: JobOwner.Me
	};
}

export function defaultFormState(): FormState {
	return {
		filingStatus: FilingStatus.Single,
		personalInfo: defaultPersonalInfo(),
		spouseInfo: defaultPersonalInfo(),
		jobs: [
			{
				name: '',
				// US median income (2019)
				expectedYearlyIncome: 31133n,
				payPeriods: 26,
				owner: JobOwner.Me
			}
		],
		dependents: {
			children: 0,
			other: 0
		},
		adjustments: {
			otherIncome: 0n,
			deductions: 0n,
			extraWithholding: 0n
		}
	};
}

export function serializeFormState(state: FormState) {
	return {
		...state,
		jobs: state.jobs.map((job) => ({
			...job,
			expectedYearlyIncome: job.expectedYearlyIncome.toString()
		})),
		adjustments: {
			otherIncome: state.adjustments.otherIncome.toString(),
			deductions: state.adjustments.deductions.toString(),
			extraWithholding: state.adjustments.extraWithholding.toString()
		}
	};
}

export function deserializeFormState(serialized: ReturnType<typeof serializeFormState>): FormState {
	return {
		...serialized,
		jobs: serialized.jobs.map((job) => ({
			...job,
			expectedYearlyIncome: BigInt(job.expectedYearlyIncome)
		})),
		adjustments: {
			otherIncome: BigInt(serialized.adjustments.otherIncome),
			deductions: BigInt(serialized.adjustments.deductions),
			extraWithholding: BigInt(serialized.adjustments.extraWithholding)
		}
	};
}
