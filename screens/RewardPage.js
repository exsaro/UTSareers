import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import RadioGroup from 'react-native-custom-radio-group';
import {Button, Block, Text, Card, HomeList} from '../components';
import {theme} from '../constants';
import endpoint from '../api/endpoint';
import { CommonActions } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('screen');

const UserReward = ({navigation}) => {

  const url = 'https://www.softwebsystems.com/UTsarees-api/uploads/';

    
    const  [loading,setLoading ]= React.useState(false);
    

    

  
    React.useEffect(() => {
      //getHomeList();
    }, []);

    

 
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
      });
      if (!fontsLoaded) {
        return <AppLoading />;
      } else {
    return(
        <Block style={style.main}>
            <ScrollView>
                    
              <Text>User Reward</Text> 
            
              </ScrollView>
        </Block>
    )
    }
}



const style = StyleSheet.create({
    
    main: {
        backgroundColor: '#F4F4F7'
    }
  })


export default UserReward;