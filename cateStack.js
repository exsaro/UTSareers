import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CatelogList from './screens/CatelogList';
import ProductList from './screens/Productlist';
import ProductDetail from './screens/ProductDetail';
import CheckOut from './screens/Checkout';
import ListAddress from './screens/ListAddress';
import AddAddress from './screens/AddAddress';
// import EditAddress from './screens/EditAddress';
import ReviewOrder from './screens/ReviewOrder';
import SuccessOrder from './screens/SuccessOrder';

const CatelogListStackNav = createStackNavigator();

export default class CatelogListStack extends React.Component {
    render(){
        return (
            <CatelogListStackNav.Navigator>
                <CatelogListStackNav.Screen name="CatelogList" options={{ headerShown: false }} component={CatelogList} />
                <CatelogListStackNav.Screen name="ProductList" options={{ headerShown: false }} component={ProductList} />
                <CatelogListStackNav.Screen name="ProductDetail" options={{ headerShown: false }} component={ProductDetail} />
                <CatelogListStackNav.Screen name="CheckOut" options={{ headerShown: false }} component={CheckOut} />
                <CatelogListStackNav.Screen name="ListAddress" options={{ headerShown: false }} component={ListAddress} />
                <CatelogListStackNav.Screen name="AddAddress" options={{ headerShown: false }} component={AddAddress} />
                {/* <CatelogListStackNav.Screen name="EditAddress" options={{ headerShown: false }} component={EditAddress} /> */}
                <CatelogListStackNav.Screen name="ReviewOrder" options={{ headerShown: false }} component={ReviewOrder} />
                <CatelogListStackNav.Screen name="SuccessOrder" options={{ headerShown: false }} component={SuccessOrder} />
            </CatelogListStackNav.Navigator>
        )
    }
}