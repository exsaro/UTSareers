import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_300Light } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, FlatList, Image, Dimensions, View, Animated, ScrollView, TouchableOpacity } from 'react-native';
import {Button, Block, Text, Card} from '../components';
import {theme} from '../constants';

const { width, height } = Dimensions.get('screen');



const Welcome = ({Slides, navigation}) => {
    let [fontsLoaded] = useFonts({
        Roboto_300Light,
      });
      if (!fontsLoaded) {
        return <AppLoading />;
      } else {
    return(

        
        <Block style={style.main} padding={theme.sizes.padding}>
            <Image style={style.container} source={require('../assets/images/welcome-bg.png')} resizeMode="contain" />
            <Card flex={false} style={style.cardShad} margin={[theme.sizes.padding, 0]} padding={[theme.sizes.padding]}>
                <Image style={{width: 112, height: 35}} source={require('../assets/images/logo-text.png')} resizeMode="contain" />
                <Text color="secondary" title style={{fontFamily: 'Roboto_300Light'}}>We weave the dreams of Artisans, and homemakers to be an entrepreneur.</Text>
            </Card>
            <ScrollView horizontal pagingEnabled>
                {Slides.map((item)=>(
                    <Block key={item.id} style={{width: width/1.1}} padding={theme.sizes.padding}>
                        <Image style={{width: 112, height: 139}} source={item.source} resizeMode="contain" />
                        <Text style={style.bannerCaption} color="primary" bigger>{item.caption}</Text>
                        <Text style={style.bannerCaption} color="secondary" bigger>{item.subcaption}</Text>
                        <Text title style={{fontFamily: 'Roboto_300Light', marginTop: 10, marginBottom: 10}}>{item.description}</Text>
                        {
                            item.button != null ? (<Block><Button style={{width: width/1.5}} onPress={()=> navigation.navigate('Login')} color="primary"><Text center white bold>{item.button}</Text></Button></Block>) : (
                                <TouchableOpacity onPress={()=> navigation.navigate('Login')} style={{alignItems: 'flex-end', paddingRight: 50}}><Text color="secondary">SKIP <Image style={{width: 9, height: 6}} source={require('../assets/images/right-arrow-pink-sm.png')} resizeMode="contain" /></Text></TouchableOpacity>
                            )
                        }
                    </Block>
                ))}
            </ScrollView>

        </Block>

        
    )
      }
}


Welcome.defaultProps = {
    Slides : [
    {
        id: 0,
        source: require('../assets/images/welcome-search.png'),
        caption: 'BROWSE', 
        subcaption: 'OUR UNIQUE DESIGN', 
        description: 'We have thousands of unique sarees collections',
        button: null
    },
    {
        id: 1,
        source: require('../assets/images/welcome-share.png'),
        caption: 'SHARE', 
        subcaption: 'WIDTH SOCIAL MEDIA', 
        description: 'Saree photos and description to your whatsapp groups',
        button: null
    },
    {
        id: 2,
        source: require('../assets/images/welcome-earn.png'),
        caption: 'EARN MORE', 
        subcaption: 'POINTS AND MARGIN', 
        description: 'Add your margin while ordering earn more points for each order',
        button: 'GET STARTED'
    }

    ]
  }


  const style = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: -20,
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

export default Welcome;