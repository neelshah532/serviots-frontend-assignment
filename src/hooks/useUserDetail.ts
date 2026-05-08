import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';

export const useUserDetail = (id: string | undefined) => {
  const users = useAppSelector((state) => state.user.users);

  const user = useMemo(() => {
    if (!id) return undefined;
    const numericId = parseInt(id, 10);
    return users.find((u) => u.id === numericId);
  }, [id, users]);

  return { user };
};
