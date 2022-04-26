import React, { useState, useEffect } from 'react';
import { useFonts, Roboto_300Light } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, FlatList, Image, Dimensions, View, Animated, ScrollView, TouchableOpacity } from 'react-native';
import {Button, Block, Text, Card} from '../components';
import {theme} from '../constants';

const { width, height } = Dimensions.get('window');



const SuccessOrder = ({navigation}) => {
    let [fontsLoaded] = useFonts({
        Roboto_300Light,
      });
      if (!fontsLoaded) {
        return <AppLoading />;
      } else {
    return(

        
        <Block style={style.main} padding={theme.sizes.padding}>
            <Image style={style.container} source={require('../assets/images/welcome-bg.png')} resizeMode="contain" />
            
            <Block padding={theme.sizes.padding}>
                <Image style={{width: 139, height: 139}} source={require('../assets/images/success-icon.png')} resizeMode="contain" />
          <Text style={style.bannerCaption} color="secondary" bigger>SUCCESS</Text>
          <Text title style={{fontFamily: 'Roboto_300Light', marginTop: 10, marginBottom: 10}}>Your order placed Successfully You will get a Tracking ID Shortly.</Text>
          </Block>
          
        </Block>

        
    )
      }
}







  const style = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: -50,
        bottom:0,
        width: width,
        height: height/2,
        backgroundColor: '#fff'
        
        

    },
    main: {
        backgroundColor: '#fff'
    },
    cardShad: {
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 16
    },
    bannerCaption: {
        lineHeight: 38,
        fontFamily: 'Roboto_300Light'
    }
  })

export default SuccessOrder;