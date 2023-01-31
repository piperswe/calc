<script lang="ts">
	import { FormGroup, Input, InputGroup } from 'sveltestrap';
	import type { PersonalInfo } from './form';

	export let personalInfo: PersonalInfo;
</script>

<p>This name and social security number should match the details on your tax return, Form 1040.</p>
<InputGroup>
	<FormGroup floating label="First name and middle initial">
		<Input bind:value={personalInfo.firstName} />
	</FormGroup>
	<FormGroup floating label="Last name">
		<Input bind:value={personalInfo.lastName} />
	</FormGroup>
	<FormGroup floating label="Social security number">
		<Input bind:value={personalInfo.socialSecurityNumber} />
	</FormGroup>
</InputGroup>
<FormGroup floating label="Address">
	<Input bind:value={personalInfo.address} />
</FormGroup>
<InputGroup>
	<FormGroup floating label="City or town">
		<Input bind:value={personalInfo.city} />
	</FormGroup>
	<FormGroup floating label="State">
		<Input bind:value={personalInfo.state} />
	</FormGroup>
	<FormGroup floating label="ZIP code">
		<Input bind:value={personalInfo.zip} />
	</FormGroup>
</InputGroup>
