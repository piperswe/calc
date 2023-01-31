export function onChangeEventToBigint(event: Event): bigint {
	return BigInt((event.target as HTMLInputElement | null)?.value ?? 0);
}
