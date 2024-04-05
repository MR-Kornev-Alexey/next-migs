import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userReducer'; // Предполагается, что setUser - это экшен для установки данных о пользователе в Redux
import { AppDispatch } from '@/store/store';

const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch: AppDispatch = useDispatch();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Ваш код для загрузки данных о пользователе
        // Например, вызов API или другой механизм загрузки данных
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          dispatch(setUser(userData)); // Сохраняем данные о пользователе в Redux-стейт
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  return <>{children}</>;
};

export default UserDataProvider;
