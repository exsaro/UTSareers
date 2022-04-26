import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './screens/Home';


const HomeStackNav = createStackNavigator();

export default class HomeStack extends React.Component {
    render(){
        return (
            <HomeStackNav.Navigator>
                <HomeStackNav.Screen name="Home" options={{ headerShown: false }} component={Home} />
            </HomeStackNav.Navigator>
        )
    }
}