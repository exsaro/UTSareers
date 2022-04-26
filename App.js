
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {AuthContext} from './context/context';
import MainTabs from './mainTabs';
import RootStack from './rootStack';
import {Block} from './components';
import { UserDrawer } from './screens/UserDrawer';

import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Permissions from 'expo-permissions';

//import Home from './screens/Home';

import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

// const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {

  // const  [isLoading,setIsLoading ]= React.useState(true);
  // const  [token,settoken ]= React.useState(null);

  // async function getLocationAsync() {
    
  //   const { status, permissions } = await Permissions.askAsync(
  //     Permissions.CAMERA,
  //     Permissions.CAMERA_ROLL
  //     );
  //     if (status !== 'granted') {
  //       alert('Hey! You have not enabled selected permissions');
  //     }
  // }

  const initialLoginState = {
    isLoading: true,
    token: null,
    userName: null
  }

  const loginReducer = (prevState, action) => {
    switch(action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          token: action.token,
          isLoading: false
        };
      case 'LOGIN':
        return {
          ...prevState,
          token: action.token,
          userName: action.id,
          isLoading: false
        };
      case 'REGISTER':
        return {
          ...prevState,
          token: action.token,
          userName: action.id,
          isLoading: false
        };
      case 'LOGOUT':
        return {
          ...prevState,
          token: null,
          userName: null,
          isLoading: false
        };
    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState)

  const authContext = React.useMemo( () => ({
    SignIn: async (userToken, username) => {

      try {
        await AsyncStorage.multiSet([['token',userToken], ['userId',username]])
      } catch (e) {
        console.log(e);
      }
      dispatch({ type:'LOGIN', id:username, token:userToken })
    },
    SignOut: async () => {
      try {
        await AsyncStorage.multiRemove(['token', 'userId'])
      } catch (e) {
        console.log(e);
      }
      dispatch({ type:'LOGOUT' })
    },
    SignUp: () => {
      setIsLoading(false);
      settoken('saasd');
    }
  }), [])



  React.useEffect(() => {
    setTimeout(async () => {
      let token;
      token = null;
      try {
        token = await AsyncStorage.getItem('token')
      } catch (e) {
        console.log(e);
      }
      dispatch({ type:'RETRIEVE_TOKEN', token: token })
    }, 1000);
    
  //   navigation.addListener('focus', () => {
  //     getLocationAsync();    
  // });
  }, []);


  if (loginState.isLoading){
    return (
      <Block center middle><ActivityIndicator size="large" /></Block>
    )
  }


  return (
    <AuthContext.Provider value={authContext}>
    <NavigationContainer>
      
      {
        loginState.token != null ? (
          <Drawer.Navigator drawerContent={props => <UserDrawer {...props} />} drawerPosition='right'>
            <Drawer.Screen name="Main" component={MainTabs} />
          </Drawer.Navigator>
        ) : (<RootStack />)
      }

    </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
