import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import {Button, Block, Text} from '../components';
import {theme} from '../constants';


export function TabBar({props, navigation, state, route}){

    
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
      });
      if (!fontsLoaded) {
        return <AppLoading />;
      } else {
    return(
        <Block flex={false} row style={style.bottomTab} space="around">
            <TouchableOpacity style={style.tabsIcon} onPress={()=> navigation.navigate('Home')}>
                <Image style={{width: 17, height: 19}} resizeMode="contain" source={state.index == 0 ? require('../assets/images/home-active.png') : require('../assets/images/home-default.png')} />
                <Text color={state.index == 0 ? 'secondary' : 'gray'} style={{fontFamily: 'Roboto_400Regular', fontSize: 12, paddingTop: 5}}>Home</Text>
            </TouchableOpacity >
            <TouchableOpacity style={style.tabsIcon} onPress={()=> navigation.navigate('CatelogList')}>
                <Image style={{width: 22, height: 18}} resizeMode="contain" source={state.index == 1 ? require('../assets/images/catelog-active.png') : require('../assets/images/catelog-default.png')} />
                <Text color={state.index == 1 ? 'secondary' : 'gray'} style={{fontFamily: 'Roboto_400Regular', fontSize: 12, paddingTop: 5}}>Catalog</Text>
                </TouchableOpacity >
            <TouchableOpacity style={style.tabsIcon} onPress={()=> navigation.navigate('sharelist')}>
                <Image style={{width: 20, height: 21}} resizeMode="contain" source={state.index == 2 ? require('../assets/images/shared-active.png') : require('../assets/images/sharedlist-default.png')} />
                <Text color={state.index == 2 ? 'secondary' : 'gray'} style={{fontFamily: 'Roboto_400Regular', fontSize: 12, paddingTop: 5}}>Shared list</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.tabsIcon} onPress={()=> navigation.navigate('Order')}>
                <Image style={{width: 15, height: 20}} resizeMode="contain" source={state.index == 3 ? require('../assets/images/order-active.png') : require('../assets/images/order-default.png')} />
                <Text color={state.index == 3 ? 'secondary' : 'gray'} style={{fontFamily: 'Roboto_400Regular', fontSize: 12, paddingTop: 5}}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.tabsIcon} onPress={() => navigation.toggleDrawer()}>
                <Image style={{width: 20, height: 17}} resizeMode="contain" source={require('../assets/images/more.png')} />
                <Text color='gray' style={{fontFamily: 'Roboto_400Regular', fontSize: 12, paddingTop: 5}}>More</Text>
            </TouchableOpacity>

        </Block>
    )
      }
}

const style = StyleSheet.create({
    bottomTab: {
        backgroundColor: '#fff',
        height: 70,
        alignItems: 'center'
    },
    tabsIcon: {
        flex:1, 
        justifyContent: 'center',
        alignItems: 'center'
    }
})