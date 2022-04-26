import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import OrderList from './screens/OrderList';



const OrderStackNav = createStackNavigator();


const OrderStack = ({route}) => {
    
    
      
    
        return (
            <OrderStackNav.Navigator>
                <OrderStackNav.Screen name="OrderList" options={{ headerShown: false }} component={OrderList} />
            </OrderStackNav.Navigator>
        )
    
}

export default OrderStack