import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './homeStack';
import SharelistStack from './sharelistStack';
import OrderStack from './orderStack';
import UserStack from './userStack';
import CatelogListStack from './cateStack';

import { TabBar } from './screens/TabBar';

const Tab = createBottomTabNavigator();


const MainTabs = ({route}) => {
    
        return (
            <Tab.Navigator tabBar={props => <TabBar {...props} />}>
                <Tab.Screen name="Home" component={HomeStack} />
                <Tab.Screen name="CatelogList" component={CatelogListStack} />
                <Tab.Screen name="sharelist" component={SharelistStack} />
                <Tab.Screen name="Order" component={OrderStack} />
                <Tab.Screen name="User" component={UserStack} />
            </Tab.Navigator>
        )
    
}

export default MainTabs;