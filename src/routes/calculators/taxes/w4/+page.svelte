<script lang="ts">
	import {
		Form,
		Alert,
		FormGroup,
		Input,
		Button,
		Card,
		CardBody,
		Accordion,
		AccordionItem
	} from 'sveltestrap';
	import { FilingStatus } from '$lib/calculators/taxes/w4/types';
	import {
		defaultFormState,
		defaultJob,
		deserializeFormState,
		serializeFormState
	} from '$lib/calculators/taxes/w4/form';
	import PersonalInfo from '$lib/calculators/taxes/w4/PersonalInfo.svelte';
	import { readFromLocalStorage, writeToLocalStorage } from '$lib/localstorage';
	import Job from '$lib/calculators/taxes/w4/Job.svelte';
	import { onChangeEventToBigint } from '$lib/bigint';
	import { generateOutputForms } from '$lib/calculators/taxes/w4/generate';

	const key = 'calculators/taxes/w4';
	let state = readFromLocalStorage(key, deserializeFormState) ?? defaultFormState();
	$: writeToLocalStorage(key, state, serializeFormState);
	$: totalIncome = state.jobs.reduce((total, job) => total + job.expectedYearlyIncome, 0n);
</script>

<svelte:head>
	<title>W-4 Calculator - Piper's Calculators</title>
</svelte:head>

<Form>
	<h2>W-4 Calculator</h2>
	<Alert color="warning">
		This calculator was created as a programming exercise. Check its output yourself - it may not
		always produce the correct output.
	</Alert>
	<Button
		on:click={() =>
			confirm('Are you sure you want to reset this form?') && (state = defaultFormState())}
		color="danger"
		class="mb-3">Reset</Button
	>
	<Accordion stayOpen>
		<AccordionItem active header="Filing Status">
			<p>
				Check your anticipated filing status. This will determine the standard deduction and tax
				rates used to compute your withholding.
			</p>
			<FormGroup>
				<div class="form-check">
					<input
						class="form-check-input"
						id="filingStatus-single"
						type="radio"
						value={FilingStatus.Single}
						bind:group={state.filingStatus}
					/>
					<label class="form-check-label" for="filingStatus-single"
						><strong>Single</strong> or <strong>Married filing separately</strong></label
					>
				</div>
				<div class="form-check">
					<input
						class="form-check-input"
						id="filingStatus-married"
						type="radio"
						value={FilingStatus.Married}
						bind:group={state.filingStatus}
					/>
					<label class="form-check-label" for="filingStatus-married"
						><strong>Married filing jointly</strong> or
						<strong>Qualifying surviving spouse</strong></label
					>
				</div>
				<div class="form-check">
					<input
						class="form-check-input"
						id="filingStatus-hoh"
						type="radio"
						value={FilingStatus.HeadOfHousehold}
						bind:group={state.filingStatus}
					/>
					<label class="form-check-label" for="filingStatus-hoh"
						><strong>Head of household</strong> (Check only if you're unmarried and pay more than half
						the costs of keeping up a home for yourself and a qualifying individual)</label
					>
				</div>
			</FormGroup>
		</AccordionItem>
		<AccordionItem active header="Personal Information">
			<PersonalInfo bind:personalInfo={state.personalInfo} />
		</AccordionItem>
		{#if state.filingStatus === FilingStatus.Married}
			<AccordionItem active header="Spouse Information">
				<PersonalInfo bind:personalInfo={state.spouseInfo} />
			</AccordionItem>
		{/if}
		<AccordionItem active header="Jobs">
			<p>List all jobs held by you and your spouse. A W-4 form will be generated for each job.</p>
			{#if state.jobs.length > 2}
				<Alert color="danger">This calculator doesn't support more than 2 jobs.</Alert>
			{/if}
			{#each state.jobs as job}
				<Card class="mb-3">
					<CardBody>
						<Job bind:job filingStatus={state.filingStatus} />
						<Button
							on:click={() => (state.jobs = state.jobs.filter((x) => x !== job))}
							color="danger">Remove Job</Button
						>
					</CardBody>
				</Card>
			{/each}
			<Button on:click={() => (state.jobs = [...state.jobs, defaultJob()])}>Add Job</Button>
		</AccordionItem>
		<AccordionItem active header="Dependents">
			{#if state.filingStatus === FilingStatus.Married ? totalIncome <= 400000n : totalIncome <= 200000n}
				<p>
					To qualify for the child tax credit, a child must be under age 17 as of December 31, must
					be your dependent who generally lives with you for more than half the year, and must have
					the required social security number. If a child does not qualify for the child tax credit,
					they may still be a dependent.
				</p>
				<FormGroup floating label="Number of qualifying children">
					<Input type="number" min={0} bind:value={state.dependents.children} />
				</FormGroup>
				<FormGroup floating label="Number of other dependents">
					<Input type="number" min={0} bind:value={state.dependents.other} />
				</FormGroup>
			{:else}
				<Alert color="warning">You are not eligible to claim dependents.</Alert>
			{/if}
		</AccordionItem>
		<AccordionItem active header="Other Adjustments">
			<p>
				If you have any other income, such as from self employment or "gig" jobs, include your
				estimated yearly other income.
			</p>
			<FormGroup floating label="Other income (not from jobs)">
				<Input
					type="number"
					min={0}
					value={state.adjustments.otherIncome}
					on:change={(event) => (state.adjustments.otherIncome = onChangeEventToBigint(event))}
				/>
			</FormGroup>
			<p>The deductions worksheet is coming soon.</p>
			<FormGroup floating label="Deductions">
				<Input
					type="number"
					min={0}
					value={state.adjustments.deductions}
					on:change={(event) => (state.adjustments.deductions = onChangeEventToBigint(event))}
				/>
			</FormGroup>
			<p>
				If you would like to have more money withheld from your paycheck for whatever reason, add it
				here. This amount is <strong>per pay period</strong> and will be withheld from each job's paycheck.
				Withholdings based on the Multiple Jobs Worksheet will be automatically added to the resulting
				forms - you don't need to enter them here.
			</p>
			<FormGroup floating label="Extra withholding">
				<Input
					type="number"
					min={0}
					value={state.adjustments.extraWithholding}
					on:change={(event) => (state.adjustments.extraWithholding = onChangeEventToBigint(event))}
				/>
			</FormGroup>
		</AccordionItem>
		<AccordionItem active header="Results">
			<pre><code>{JSON.stringify(generateOutputForms(state), null, 4)}</code></pre>
		</AccordionItem>
	</Accordion>
</Form>
