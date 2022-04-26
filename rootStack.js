import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Welcome from './screens/Welcome';
import Register from './screens/Register';
import Login from './screens/Login';
// import Otp from './screens/Otp';
import Notify from './screens/Notify';
import ForgotPassword from './screens/Forgotpass';
import ResetPassword from './screens/ResetPass';


const RootStackNav = createStackNavigator();


export default class RootStack extends React.Component {
    render(){
        return (
            <RootStackNav.Navigator>
                <RootStackNav.Screen name="Welcome" options={{ headerShown: false }} component={Welcome} />
                <RootStackNav.Screen name="Register" options={{ headerShown: false }} component={Register} />
                <RootStackNav.Screen name="Login" options={{ headerShown: false }} component={Login} />
                <RootStackNav.Screen name="ForgotPassword" options={{ headerShown: false }} component={ForgotPassword} />
                <RootStackNav.Screen name="ResetPassword" options={{ headerShown: false }} component={ResetPassword} />
                {/* <RootStackNav.Screen name="Otp" options={{ headerShown: false }} component={Otp} /> */}
                <RootStackNav.Screen name="Notify" options={{ headerShown: false }} component={Notify} />
            </RootStackNav.Navigator>
        )
    }
}
