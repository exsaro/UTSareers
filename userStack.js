import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import UserProfile from './screens/UserProfile';
import UserReward from './screens/RewardPage';



const UserStackNav = createStackNavigator();


const UserStack = ({route}) => {
    
    return (
        <UserStackNav.Navigator>
            <UserStackNav.Screen name="UserProfile" options={{ headerShown: false }} component={UserProfile} />
            <UserStackNav.Screen name="UserReward" options={{ headerShown: false }} component={UserReward} />
        </UserStackNav.Navigator>
    )
    
}

export default UserStack