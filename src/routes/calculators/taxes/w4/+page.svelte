<script lang="ts">
	import { Form, Alert, InputGroup, FormGroup, Input } from 'sveltestrap';
	import { FilingStatus } from '$lib/calculators/taxes/w4/types';
	import { calculateAnnualWithholding } from '$lib/calculators/taxes/w4/multipleJobsTables';

	let firstName = '';
	let lastName = '';
	let socialSecurityNumber = '';
	let address = '';
	let cityStateZIP = '';
	let filingStatus: FilingStatus | null = null;

	let myJobs = 1n;
	let spouseJobs = 0n;
	let highestPayingJob = true;
	let highestSalary = 0n;
	let lowestSalary = 0n;
	let payPeriods = 26n;

	let totalExpectedIncome = 0n;
	let qualifyingChildren = 0n;
	let dependents = 0n;
	let otherIncome = 0n;
	let deductions = 0n;
	let extraWithholding = 0n;

	$: totalJobs = myJobs + spouseJobs;
	$: showMultipleJobsWorksheet = highestPayingJob && totalJobs > 1;
	$: multipleJobsAnnualWithholding = showMultipleJobsWorksheet
		? calculateAnnualWithholding(highestSalary, lowestSalary, filingStatus || FilingStatus.Single)
		: 0;
</script>

<Form>
	<h1>W-4 Calculator</h1>
	<Alert color="warning">
		This calculator was created as a programming exercise. Check its output yourself - it may not
		always produce the correct output.
	</Alert>
	<h2>Step 1: Enter Personal Information</h2>
	<InputGroup>
		<FormGroup floating label="First name and middle initial">
			<Input bind:value={firstName} />
		</FormGroup>
		<FormGroup floating label="Last name">
			<Input bind:value={lastName} />
		</FormGroup>
		<FormGroup floating label="Social security number">
			<Input bind:value={socialSecurityNumber} />
		</FormGroup>
	</InputGroup>
	<FormGroup floating label="Address">
		<Input bind:value={address} />
	</FormGroup>
	<FormGroup floating label="City or town, state, and ZIP code">
		<Input bind:value={cityStateZIP} />
	</FormGroup>
	<FormGroup>
		<Input
			type="radio"
			bind:group={filingStatus}
			value={FilingStatus.Single}
			label="Single or Married filing separately"
		/>
		<Input
			type="radio"
			bind:group={filingStatus}
			value={FilingStatus.Married}
			label="Married filing jointly or Qualifying surviving spouse"
		/>
		<Input
			type="radio"
			bind:group={filingStatus}
			value={FilingStatus.HeadOfHousehold}
			label="Head of household (Check only if you're unmarried and pay more than half the costs of keeping up a home for yourself and a qualifying individual.)"
		/>
	</FormGroup>
	<h2>Step 2: Multiple Jobs or Spouse Works</h2>
	<FormGroup floating label="My job count">
		<Input type="number" min={0} bind:value={myJobs} />
	</FormGroup>
	{#if filingStatus === FilingStatus.Married}
		<FormGroup floating label="My spouse's job count">
			<Input type="number" min={0} bind:value={spouseJobs} />
		</FormGroup>
	{/if}
	{#if totalJobs > 1}
		<FormGroup>
			<Input
				type="checkbox"
				bind:value={highestPayingJob}
				label="Of my and my spouse's jobs, the job this W-4 is being filled for is the highest paying"
			/>
		</FormGroup>
	{/if}
	{#if showMultipleJobsWorksheet}
		<h3>Step 2(b) - Multiple Jobs Worksheet</h3>
		{#if totalJobs > 2}
			<Alert color="danger">This calculator doesn't support more than 2 jobs.</Alert>
		{/if}
		<FormGroup floating label="Highest paying job's estimated yearly pay">
			<Input type="number" min={0} bind:value={highestSalary} />
		</FormGroup>
		<FormGroup floating label="Lowest paying job's estimated yearly pay">
			<Input type="number" min={0} bind:value={lowestSalary} />
		</FormGroup>
		<FormGroup
			floating
			label="Pay periods per year (pays weekly => 52, pays every other week => 26, pays monthly => 12, pays twice a month => 24, etc.)"
		>
			<Input type="number" min={0} bind:value={payPeriods} />
		</FormGroup>
	{/if}
</Form>
