<script lang="ts">
	import { onChangeEventToBigint } from '$lib/bigint';
	import { FormGroup, Input } from 'sveltestrap';
	import { JobOwner, type Job } from './form';
	import { FilingStatus } from './types';

	export let filingStatus: FilingStatus;
	export let job: Job;
</script>

<p>This name is only used for your reference, so you know which W-4 form goes with which job.</p>
<FormGroup floating label="Name">
	<Input bind:value={job.name} />
</FormGroup>
<p>
	If you're paid on a salary basis, add your salary. If you're paid on an hourly basis, make an
	estimate of how much you will make over the course of the year.
</p>
<FormGroup floating label="Expected income this year">
	<Input
		type="number"
		min={0}
		value={job.expectedYearlyIncome}
		on:change={(event) => (job.expectedYearlyIncome = onChangeEventToBigint(event))}
	/>
</FormGroup>
<p>
	If your job pays weekly, there are 52 pay periods per year. If your job pays every other week,
	there are 26 pay periods per year. If your job pays monthly, there are 12 pay periods per year. If
	your job pays twice a month, there are 24 pay periods per year.
</p>
<FormGroup floating label="Pay periods per year">
	<Input type="number" min={0} bind:value={job.payPeriods} />
</FormGroup>
{#if filingStatus === FilingStatus.Married}
	<FormGroup>
		<Input type="radio" bind:group={job.owner} value={JobOwner.Me} label="My job" />
		<Input type="radio" bind:group={job.owner} value={JobOwner.Spouse} label="My spouse's job" />
	</FormGroup>
{/if}
