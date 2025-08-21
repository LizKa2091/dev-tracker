import type { Difficulty } from './../../user/userTypes';
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

interface IUpdateDifficultyResponse {
   message: string;
   difficulty: Difficulty;
}

const updateDifficulty = async (difficulty: Difficulty, token: string): Promise<IUpdateDifficultyResponse> => {
   const { data } = await axios.patch<IUpdateDifficultyResponse>('http://localhost:5001/me/difficulty', 
      { difficulty: difficulty },
      {
         headers: {
            'authorization': `Bearer ${token}`
         }
      }
   );

   return data;
};

export const useUpdateDifficulty = (token: string | null) => {
   return useMutation<IUpdateDifficultyResponse, Error, { difficulty: Difficulty }>({
      mutationKey: ['userDifficulty', token],
      mutationFn: ({ difficulty }) => {
         if (!token) throw new Error('не предоставлен токен для проверки авторизации пользователя');

         return updateDifficulty(difficulty, token);
      },
      retry: 1
   })
}