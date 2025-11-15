import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getDeadlineChartData } from '../../features/deadlines/lib/getDeadlineChartData';
import { loadNotes } from '../../features/notes/model/noteStorage';
import { formatNotes } from '../../features/deadlines/lib/formatNotes';
import type { INotesStorage } from '../../features/notes/model/constants';

vi.mock('../../features/notes/model/noteStorage', () => ({
   loadNotes: vi.fn(),
}));

vi.mock('../../features/deadlines/lib/formatNotes', () => ({
   formatNotes: vi.fn(),
}));

describe('getDeadlineChartData tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('returns chartData=null and empty types if loadNotes returns nothing', () => {
      (loadNotes as any).mockReturnValue(null);

      const result = getDeadlineChartData();

      expect(result.chartData).toBeNull();
      expect(result.types).toEqual([]);
   });

   test('calls formatNotes and returns formatted data', () => {
      const mockNotes: INotesStorage = {
         notes: [
            {
               dueToDate: '2025-01-01',
               type: 'work',
               title: 'Test note',
               tags: [],
               createdDate: '2025-01-01',
               key: '1',
               status: 'active',
            },
         ],
      };

      const formatted = [
         { date: '2025-01-01', work: 1, study: 2 },
         { date: '2025-01-02', home: 1 },
      ];

      (loadNotes as any).mockReturnValue(mockNotes);
      (formatNotes as any).mockReturnValue(formatted);

      const result = getDeadlineChartData();

      expect(loadNotes).toHaveBeenCalled();
      expect(formatNotes).toHaveBeenCalledWith(mockNotes.notes);
      expect(result.chartData).toEqual(formatted);
      expect(result.types.sort()).toEqual(['work', 'study', 'home'].sort());
   });

   test('correctly proccesses empty types in formattedNotes', () => {
      const mockNotes: INotesStorage = { notes: [] };
      const formatted = [{ date: '2025-01-01' }];

      (loadNotes as any).mockReturnValue(mockNotes);
      (formatNotes as any).mockReturnValue(formatted);

      const result = getDeadlineChartData();

      expect(result.types).toEqual([]);
   });
});
