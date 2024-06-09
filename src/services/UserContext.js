import React, {createContext, useState} from 'react';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const getAvatar = async id => {
    try {
      const imageUrl = await storage().ref(`images/${id}`).getDownloadURL();
      return imageUrl ? imageUrl : null;
    } catch (error) {
      return null;
    }
  };

  const updateAvatar = async id => {
    const avatarUrl = await getAvatar(id);
    setUser(preUser => ({...preUser, profile_photo_path: avatarUrl}));
    await AsyncStorage.setItem(
      'USER',
      JSON.stringify({...user, profile_photo_path: avatarUrl}),
    );
  };

  const logout = async () => {
    await AsyncStorage.removeItem('USER');
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{user, setUser, getAvatar, updateAvatar, logout}}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContext, UserProvider};
