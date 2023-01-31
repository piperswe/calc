import { describe, expect, test } from 'vitest';
import { tables } from './multipleJobsTables';
import { FilingStatus } from './types';

describe.each([FilingStatus.Single, FilingStatus.Married, FilingStatus.HeadOfHousehold])(
	'table validation',
	(filingStatus) => {
		const table = tables[filingStatus];
		test('row range count and row count match', () => {
			expect(table.rows).toHaveLength(table.rowRanges.length);
		});
		test('column range count and cell count in each row match', () => {
			for (const cells of table.rows) {
				expect(cells).toHaveLength(table.columnRanges.length);
			}
		});
	}
);
