import { Flex, Switch } from 'antd';
import { type FC } from 'react'
import { useUserData } from '../../../user/model/useUserData';
import { useUpdateDifficulty } from '../../model/useUpdateDifficulty';
import { useQueryClient } from '@tanstack/react-query';
import type { Difficulty } from '../../../user/userTypes';
import AuthExports from '../../../../shared/context/AuthContext';

const DifficultySwitcher: FC = () => {
   const { token } = AuthExports.useAuthContext();
   const { data: userData } = useUserData(token);
   const { mutate: updateDifficulty, isPending } = useUpdateDifficulty(token);

   const queryClient = useQueryClient();

   const handleChange = async (): Promise<void> => {
      if (!token || !userData) return;

      const newMode: Difficulty = userData.difficulty === 'default' ? 'hard' : 'default';
      updateDifficulty({ difficulty: newMode }, {
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userData', token]});
         },
         onError: (err: Error) => {
            console.error(err.message || 'Ошибка при обновлении режима');
         }
      });
   };

   return (
      <Flex gap='middle' vertical>
         <h4>Режим</h4>
         <h5>Для более быстрого набора опыта выберите режим сложный, но в то же время невыполненные задания будут отнимать больше опыта, чем в обычном режиме</h5>
         <Flex gap='middle'>
            <span>Обычный</span>
            <Switch checked={userData?.difficulty === 'hard'} onChange={handleChange} loading={isPending} />
            <span>Сложный</span>
         </Flex>
      </Flex>
   )
}

export default DifficultySwitcher;