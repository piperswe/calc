import { FilingStatus } from './types';

export type Range = [bigint, bigint];

const columnRanges: Range[] = [
	[0n, 9999n],
	[10000n, 19999n],
	[20000n, 29999n],
	[30000n, 39999n],
	[40000n, 49999n],
	[50000n, 59999n],
	[60000n, 69999n],
	[70000n, 79999n],
	[80000n, 89999n],
	[90000n, 99999n],
	[100000n, 109999n],
	[110000n, 120000n]
];

export type Column = bigint;
export type Row = Column[];
export interface MultipleJobsTable {
	columnRanges: Range[];
	rowRanges: Range[];
	rows: Row[];
}

/**
 * Converts row data, copied from https://www.irs.gov/pub/irs-pdf/fw4.pdf, to an array of rows
 * @param rowData Table data - copy the entire table below the header
 */
function convertRowData(rowData: string): Row[] {
	const rows = rowData.replace(/,/g, '').replace(/\$/g, '').split('\n');
	return rows.map((row) => {
		const cells = row.split(' ');
		const cellsWithoutRange = cells.slice(3);
		return cellsWithoutRange.map((cell) => BigInt(cell));
	});
}

export const tables: Record<FilingStatus, MultipleJobsTable> = {
	[FilingStatus.Married]: {
		columnRanges,
		rowRanges: [
			[0n, 9999n],
			[10000n, 19999n],
			[20000n, 29999n],
			[30000n, 39999n],
			[40000n, 49999n],
			[50000n, 59999n],
			[60000n, 69999n],
			[70000n, 79999n],
			[80000n, 99999n],
			[100000n, 149999n],
			[150000n, 239999n],
			[240000n, 259999n],
			[260000n, 279999n],
			[280000n, 299999n],
			[300000n, 319999n],
			[320000n, 364999n],
			[365000n, 524999n],
			[525000n, BigInt(Number.MAX_SAFE_INTEGER)]
		],
		rows: convertRowData(`$0 - 9,999 $0 $0 $850 $850 $1,000 $1,020 $1,020 $1,020 $1,020 $1,020 $1,020 $1,870
$10,000 - 19,999 0 930 1,850 2,000 2,200 2,220 2,220 2,220 2,220 2,220 3,200 4,070
$20,000 - 29,999 850 1,850 2,920 3,120 3,320 3,340 3,340 3,340 3,340 4,320 5,320 6,190
$30,000 - 39,999 850 2,000 3,120 3,320 3,520 3,540 3,540 3,540 4,520 5,520 6,520 7,390
$40,000 - 49,999 1,000 2,200 3,320 3,520 3,720 3,740 3,740 4,720 5,720 6,720 7,720 8,590
$50,000 - 59,999 1,020 2,220 3,340 3,540 3,740 3,760 4,750 5,750 6,750 7,750 8,750 9,610
$60,000 - 69,999 1,020 2,220 3,340 3,540 3,740 4,750 5,750 6,750 7,750 8,750 9,750 10,610
$70,000 - 79,999 1,020 2,220 3,340 3,540 4,720 5,750 6,750 7,750 8,750 9,750 10,750 11,610
$80,000 - 99,999 1,020 2,220 4,170 5,370 6,570 7,600 8,600 9,600 10,600 11,600 12,600 13,460
$100,000 - 149,999 1,870 4,070 6,190 7,390 8,590 9,610 10,610 11,660 12,860 14,060 15,260 16,330
$150,000 - 239,999 2,040 4,440 6,760 8,160 9,560 10,780 11,980 13,180 14,380 15,580 16,780 17,850
$240,000 - 259,999 2,040 4,440 6,760 8,160 9,560 10,780 11,980 13,180 14,380 15,580 16,780 17,850
$260,000 - 279,999 2,040 4,440 6,760 8,160 9,560 10,780 11,980 13,180 14,380 15,580 16,780 18,140
$280,000 - 299,999 2,040 4,440 6,760 8,160 9,560 10,780 11,980 13,180 14,380 15,870 17,870 19,740
$300,000 - 319,999 2,040 4,440 6,760 8,160 9,560 10,780 11,980 13,470 15,470 17,470 19,470 21,340
$320,000 - 364,999 2,040 4,440 6,760 8,550 10,750 12,770 14,770 16,770 18,770 20,770 22,770 24,640
$365,000 - 524,999 2,970 6,470 9,890 12,390 14,890 17,220 19,520 21,820 24,120 26,420 28,720 30,880
$525,000 and over 3,140 6,840 10,460 13,160 15,860 18,390 20,890 23,390 25,890 28,390 30,890 33,250`)
	},
	[FilingStatus.Single]: {
		columnRanges,
		rowRanges: [
			[0n, 9999n],
			[10000n, 19999n],
			[20000n, 29999n],
			[30000n, 39999n],
			[40000n, 59999n],
			[60000n, 79999n],
			[80000n, 99999n],
			[100000n, 124999n],
			[125000n, 149999n],
			[150000n, 174999n],
			[175000n, 199999n],
			[200000n, 249999n],
			[250000n, 399999n],
			[400000n, 449999n],
			[450000n, BigInt(Number.MAX_SAFE_INTEGER)]
		],
		rows: convertRowData(`$0 - 9,999 $310 $890 $1,020 $1,020 $1,020 $1,860 $1,870 $1,870 $1,870 $1,870 $2,030 $2,040
$10,000 - 19,999 890 1,630 1,750 1,750 2,600 3,600 3,600 3,600 3,600 3,760 3,960 3,970
$20,000 - 29,999 1,020 1,750 1,880 2,720 3,720 4,720 4,730 4,730 4,890 5,090 5,290 5,300
$30,000 - 39,999 1,020 1,750 2,720 3,720 4,720 5,720 5,730 5,890 6,090 6,290 6,490 6,500
$40,000 - 59,999 1,710 3,450 4,570 5,570 6,570 7,700 7,910 8,110 8,310 8,510 8,710 8,720
$60,000 - 79,999 1,870 3,600 4,730 5,860 7,060 8,260 8,460 8,660 8,860 9,060 9,260 9,280
$80,000 - 99,999 1,870 3,730 5,060 6,260 7,460 8,660 8,860 9,060 9,260 9,460 10,430 11,240
$100,000 - 124,999 2,040 3,970 5,300 6,500 7,700 8,900 9,110 9,610 10,610 11,610 12,610 13,430
$125,000 - 149,999 2,040 3,970 5,300 6,500 7,700 9,610 10,610 11,610 12,610 13,610 14,900 16,020
$150,000 - 174,999 2,040 3,970 5,610 7,610 9,610 11,610 12,610 13,750 15,050 16,350 17,650 18,770
$175,000 - 199,999 2,720 5,450 7,580 9,580 11,580 13,870 15,180 16,480 17,780 19,080 20,380 21,490
$200,000 - 249,999 2,900 5,930 8,360 10,660 12,960 15,260 16,570 17,870 19,170 20,470 21,770 22,880
$250,000 - 399,999 2,970 6,010 8,440 10,740 13,040 15,340 16,640 17,940 19,240 20,540 21,840 22,960
$400,000 - 449,999 2,970 6,010 8,440 10,740 13,040 15,340 16,640 17,940 19,240 20,540 21,840 22,960
$450,000 and over 3,140 6,380 9,010 11,510 14,010 16,510 18,010 19,510 21,010 22,510 24,010 25,330`)
	},
	[FilingStatus.HeadOfHousehold]: {
		columnRanges,
		rowRanges: [
			[0n, 9999n],
			[10000n, 19999n],
			[20000n, 29999n],
			[30000n, 39999n],
			[40000n, 59999n],
			[60000n, 79999n],
			[80000n, 99999n],
			[100000n, 124999n],
			[125000n, 149999n],
			[150000n, 174999n],
			[175000n, 199999n],
			[200000n, 249999n],
			[250000n, 449999n],
			[450000n, BigInt(Number.MAX_SAFE_INTEGER)]
		],
		rows: convertRowData(`$0 - 9,999 $0 $620 $860 $1,020 $1,020 $1,020 $1,020 $1,650 $1,870 $1,870 $1,890 $2,040
$10,000 - 19,999 620 1,630 2,060 2,220 2,220 2,220 2,850 3,850 4,070 4,090 4,290 4,440
$20,000 - 29,999 860 2,060 2,490 2,650 2,650 3,280 4,280 5,280 5,520 5,720 5,920 6,070
$30,000 - 39,999 1,020 2,220 2,650 2,810 3,440 4,440 5,440 6,460 6,880 7,080 7,280 7,430
$40,000 - 59,999 1,020 2,220 3,130 4,290 5,290 6,290 7,480 8,680 9,100 9,300 9,500 9,650
$60,000 - 79,999 1,500 3,700 5,130 6,290 7,480 8,680 9,880 11,080 11,500 11,700 11,900 12,050
$80,000 - 99,999 1,870 4,070 5,690 7,050 8,250 9,450 10,650 11,850 12,260 12,460 12,870 13,820
$100,000 - 124,999 2,040 4,440 6,070 7,430 8,630 9,830 11,030 12,230 13,190 14,190 15,190 16,150
$125,000 - 149,999 2,040 4,440 6,070 7,430 8,630 9,980 11,980 13,980 15,190 16,190 17,270 18,530
$150,000 - 174,999 2,040 4,440 6,070 7,980 9,980 11,980 13,980 15,980 17,420 18,720 20,020 21,280
$175,000 - 199,999 2,190 5,390 7,820 9,980 11,980 14,060 16,360 18,660 20,170 21,470 22,770 24,030
$200,000 - 249,999 2,720 6,190 8,920 11,380 13,680 15,980 18,280 20,580 22,090 23,390 24,690 25,950
$250,000 - 449,999 2,970 6,470 9,200 11,660 13,960 16,260 18,560 20,860 22,380 23,680 24,980 26,230
$450,000 and over 3,140 6,840 9,770 12,430 14,930 17,430 19,930 22,430 24,150 25,650 27,150 28,600`)
	}
};

export function calculateAnnualWithholding(
	highestSalary: bigint,
	lowestSalary: bigint,
	filingStatus: FilingStatus
): bigint {
	const table = tables[filingStatus];
	let column = table.columnRanges.length - 1;
	table.columnRanges.forEach(([low, high], i) => {
		if (lowestSalary >= low && lowestSalary <= high) {
			column = i;
		}
	});
	let row = table.rowRanges.length - 1;
	table.rowRanges.forEach(([low, high], i) => {
		if (highestSalary >= low && highestSalary <= high) {
			row = i;
		}
	});
	console.log({ column, row });
	return table.rows[row][column];
}
