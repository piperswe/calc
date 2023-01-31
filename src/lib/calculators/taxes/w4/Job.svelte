<script lang="ts">
	import { onChangeEventToBigint } from '$lib/bigint';
	import { FormGroup, Input } from 'sveltestrap';
	import { JobOwner, type Job } from './form';
	import { FilingStatus } from './types';

	export let filingStatus: FilingStatus;
	export let job: Job;
</script>

<FormGroup floating label="Name (optional; for your reference)">
	<Input bind:value={job.name} />
</FormGroup>
<FormGroup floating label="Expected income this year">
	<Input
		type="number"
		min={0}
		value={job.expectedYearlyIncome}
		on:change={(event) => (job.expectedYearlyIncome = onChangeEventToBigint(event))}
	/>
</FormGroup>
<FormGroup
	floating
	label="Pay periods per year (pays weekly => 52, pays every other week => 26, pays monthly => 12, pays twice a month => 24, etc.)"
>
	<Input type="number" min={0} bind:value={job.payPeriods} />
</FormGroup>
{#if filingStatus === FilingStatus.Married}
	<FormGroup>
		<Input type="radio" bind:group={job.owner} value={JobOwner.Me} label="My job" />
		<Input type="radio" bind:group={job.owner} value={JobOwner.Spouse} label="My spouse's job" />
	</FormGroup>
{/if}
