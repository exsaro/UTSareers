import React, { useState, useEffect, Fragment } from 'react';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import Block from "./Block";
import Card from "./Card";
import Text from "./Text";
import { theme } from "../constants";

const { width, height } = Dimensions.get('screen');

const HomeList = (props) => {

    const { image, title, desc, price } = props;

    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
      });
      if (!fontsLoaded) {
        return <AppLoading />;
      } else {
    return(
        <Card style={{justifyContent: 'flex-start', width:width/1.1}}>
          <Image style={{height:181, width:'100%', borderRadius: 5, marginBottom: 20}} source={image} resizeMode="cover" />
          <Text style={{fontFamily: 'Roboto_700Bold', fontSize:18, marginBottom:5}}>{title}</Text>
          <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#969696', marginBottom: 10}}>{desc}</Text>
          <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>STARTING AT <Text color="primary" style={{fontFamily: 'Roboto_700Bold', fontSize:14}}>₹ {price}</Text></Text>
        </Card>
        
    )
}
}

export default HomeList;