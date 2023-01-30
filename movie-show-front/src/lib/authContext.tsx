import { createContext, useContext, useEffect, useState } from 'react';
import { getIdFromLocalCookie, getTokenFromLocalCookie, getUserFromLocalCookie } from '../lib/auth';

let userState: any;

const User = createContext({ user: null, loading: false });

  // @ts-ignore
export const UserProvider = ({ value, children }) => {
  const { user } = value;

  useEffect(() => {
    if (!userState && user) {
      userState = user;
    }
  }, []);

  return <User.Provider value={value}>{children}</User.Provider>;
};
  // @ts-ignore
export const useUser = () => useContext(User);

export const useFetchUser = () => {
  const [data, setUser] = useState({
    user: userState || null,
    loading: userState === undefined,
  });

  useEffect(() => {
    if (userState !== undefined) {
      return;
    }

    let isMounted = true;
    const resolveUser = async () => {
      const user = await getUserFromLocalCookie();
      if (isMounted) {
        setUser({ user, loading: false });
      }
    };
    resolveUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
};

export const useUserInfo = () => {
  const [data, setUser] = useState({
    id: userState || null,
    jwt: userState || null,
    loading: userState === undefined,
  });

  useEffect(() => {
    if (userState !== undefined) {
      return;
    }

    let isMounted = true;
    const resolveUser = async () => {
      const jwt = await getTokenFromLocalCookie();
      const id = await getIdFromLocalCookie();
      if (isMounted) {
        setUser({ id, jwt, loading: false });
      }
    };
    resolveUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
};