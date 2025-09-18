import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useUserData } from '../../user/model/useUserData';
import { githubLoadCommits } from "../../github/lib/githubStorage";
import AuthExports from "../../../shared/context/AuthContext";
import type { ICellsData } from "../activityCellTypes";
import type { INoteItem } from "../../notes/noteTypes";

export const useCellsData = () => {
   const { token } = AuthExports.useAuthContext();
   const { data: userData, isLoading } = useUserData(token);

   const [cellsData, setCellsData] = useState<ICellsData>({
      totalCells: 0,
      years: [],
      cellItems: []
   });

   useEffect(() => {
      if (isLoading || !userData || !userData.registrationDate) return;

      const today = dayjs();
      const registerDate = dayjs(userData?.registrationDate);      

      const years: number[] = [];
      for (let i = registerDate.year(); i < today.year(); i++) {
         years.push(i);
      }

      const activitiesMap = new Map<string, number>();

      const savedCommits = githubLoadCommits();

      savedCommits.repositories.forEach(rep => {
         rep.commits.forEach(commit => {
            const commitDay = dayjs(commit.author.date).startOf('day');
            const registerDay = registerDate.startOf('day');

            if (!commitDay.isBefore(registerDay)) {
               const key = commitDay.toDate().toISOString();
               activitiesMap.set(key, (activitiesMap.get(key) || 0) + 1);
            }
         });
      });

      const savedNotes: string | null = localStorage.getItem('notes');
      if (savedNotes) {
         const parsedNotes: INoteItem[] = JSON.parse(savedNotes).notes;

         parsedNotes.forEach(note => {
            if (note.status === 'completed' && note.completedDate) {
               const noteDay = dayjs(note.completedDate).startOf('day');

               if (!noteDay.isBefore(registerDate.startOf('day'))) {
                  const key = noteDay.toDate().toISOString();
                  activitiesMap.set(key, (activitiesMap.get(key) || 0) + 1);
               }
            }
         })
      }

      const startDate = dayjs().startOf('year');

      const totalCells: number = today.diff(startDate, 'day') + 1;     

      const cellItems = Array.from({ length: totalCells }, (_, i) => {
         const day = startDate.add(i, 'day');
         const key = day.toDate().toISOString();
         const registerDay = registerDate.startOf('day');

         const activities = activitiesMap.get(key) || 0;

         return { day: key, activities: day.isBefore(registerDay) ? 0 : activities };
      });

      setCellsData({ totalCells, years, cellItems });
   }, [userData, isLoading]);

   return cellsData;
}