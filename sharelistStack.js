import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ShareList from './screens/ShareList';

const SharelistStackNav = createStackNavigator();

export default class SharelistStack extends React.Component {
    render(){
        return (
            <SharelistStackNav.Navigator>
                <SharelistStackNav.Screen name="ShareList" options={{ headerShown: false }} component={ShareList} />
            </SharelistStackNav.Navigator>
        )
    }
}