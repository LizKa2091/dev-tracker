import type { Difficulty } from './../../user/userTypes';
import { useMutation } from "@tanstack/react-query";
import { defaultTokenApiAxios } from '../../../shared/api/axios';

interface IUpdateDifficultyResponse {
   message: string;
   difficulty: Difficulty;
};

export const useUpdateDifficulty = (token: string | null) => {
   return useMutation<IUpdateDifficultyResponse, Error, { difficulty: Difficulty }>({
      mutationKey: ['userDifficulty', token],
      mutationFn: async ({ difficulty }) => {
         const { data } = await defaultTokenApiAxios.patch<IUpdateDifficultyResponse>('/me/difficulty', difficulty);

         return data;
      },
      retry: 1
   })
}