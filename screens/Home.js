import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, ActivityIndicator, FlatList, Alert } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import RadioGroup from 'react-native-custom-radio-group';
import {Button, Block, Text, Card, HomeList} from '../components';
import {theme} from '../constants';
import endpoint from '../api/endpoint';
import { CommonActions } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('screen');

const Home = ({navigation}) => {

  const url = 'https://www.softwebsystems.com/UTsarees-api/uploads/';

    const [interval, setInterval] = React.useState(1);
    const [intervals, setIntervals] = React.useState(null);
    const  [loading,setLoading ]= React.useState(false);
    const [topTrending, setTopTrending] = React.useState([]);
    const [offersDay, setOffersDay] = React.useState([]);


    const getHomeList = async () => {
      setLoading(true);
      await endpoint.get(`/trendingproducts`).then(response => {
          setLoading(false);
          setTopTrending(response.data.trending);
          setIntervals(response.data.trending.length)
          setOffersDay(response.data.offerproducts);
      }).catch(error => {
          setLoading(false);
          Alert.alert('Error!', 'Something went wrong Please try again later', [{ text: "OK"}]);
          return;
      })
  }

  const passProductDetail = async (prodId, prodName) => {
    navigation.navigate('CatelogList', { screen: 'ProductDetail', initial: false, params: { id: prodId, name: prodName },})
  }

  const passCart = async () => {
    navigation.navigate('CatelogList', { screen: 'CheckOut', initial: false})
  }

  const getMinPrice = (array) => {
    array.reduce((min, p) => p.price < min.price ? p.price : min.price, array[0].price);
}

    React.useEffect(() => {
      getHomeList();
    }, []);

    

    let bullets = [];
  for (let i = 1; i <= intervals; i++) {
    bullets.push(
      <Text
        key={i} style={style.bullet}>
        &bull;
      </Text>
    );
  }

    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
      });
      if (!fontsLoaded) {
        return <AppLoading />;
      } else {
    return(
        <Block style={style.main}>
            
                    <Fragment>
                    <Block flex={false} row style={{backgroundColor: '#fff', height: height/7, paddingTop:20, alignItems: 'center'}}>
                        <Block style={{paddingLeft: theme.sizes.padding}}>
                    <Image style={{width:96, height:12}} source={require('../assets/images/logo-text.png')} resizeMode="contain" />
                    </Block>
                    <TouchableOpacity onPress={()=>passCart()} style={{alignItems: 'flex-end', paddingRight: theme.sizes.padding}}>
                      <Image style={{width:22, height:27}} source={require('../assets/images/addtocart.png')} resizeMode="contain" />
                    </TouchableOpacity>
                    </Block>
                    <ScrollView>
                    { loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (  
                    <Block padding={theme.sizes.padding}>

                    
                      <Block style={{marginBottom:20, position: 'relative'}}>
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:12, textTransform: 'uppercase', marginBottom: 10}}>Top Trending</Text>
                    <ScrollView 
                    horizontal={true}
                    contentContainerStyle={{ width: `${100 * intervals}%` }}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={200}
                    decelerationRate="fast"
                    pagingEnabled
                    >
                      {topTrending.map((item, i) => (
                        <TouchableOpacity key={item.product_ID} onPress={()=> passProductDetail(item.product_ID, item.product_name)}>
                          <Card style={{justifyContent: 'flex-start', width:width/1.1}}>
                            {item.assets.length > 0 ? (<Image style={{height:181, width:'97%', borderRadius: 5, marginBottom: 20}} source={{uri: url+item.assets[0].asset_path}} resizeMode="cover" />) : (<></>)}
                            <Text style={{fontFamily: 'Roboto_700Bold', fontSize:18, marginBottom:5}}>{item.product_name}</Text>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#969696', marginBottom: 10}}>{item.description}</Text>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>STARTING AT 
                            <Text color="primary" style={{fontFamily: 'Roboto_700Bold', fontSize:14}}> ₹ {item.options.length > 1 ? getMinPrice(item.options) : (item.options[0].price)}</Text>
                            </Text>
                          </Card>
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <Block style={style.bullets}>
                        {bullets}
                    </Block>
                    </Block>
                    

                    <Block>
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:12, textTransform: 'uppercase', marginBottom: 10}}>Offers at the day</Text>
                    <FlatList
            horizontal
            scrollEnabled
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            snapToAlignment="center"
            data={offersDay}
            keyExtractor={(item, index)=> `${item.product_ID}`}
            renderItem={({item}) => (
              <TouchableOpacity key={item.product_ID} onPress={()=> passProductDetail(item.product_ID, item.product_name)}>
              <Card row style={{marginLeft: 5,marginRight: 5, width: width/1.3}}>
                  {item.assets.length > 0 ? (<Image source={{uri: url+item.assets[0].asset_path}} style={{width: width/3, height: height/6}} resizeMode='contain' />) : (<></>)}
                  <Block>
                    <Text style={{fontFamily: 'Roboto_700Bold', fontSize:16, marginBottom:5}}>{item.product_name}</Text>
                    <Text style={{fontFamily: 'Roboto_700Bold', fontSize:12, color: '#969696', marginBottom: 10}}>{item.shortdesc}</Text>
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform: 'uppercase'}}>Upto 
                      <Text  color="primary" style={{fontFamily: 'Roboto_700Bold', fontSize:14}}>{item.offer[0].offer}% Off</Text>
                    </Text>
                  </Block>
              </Card>
              </TouchableOpacity>
            )} />
            </Block>


                        {/* <Block style={{position: 'relative'}}>
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:12, textTransform: 'uppercase', marginBottom: 10}}>New Arrivals</Text>
                    <ScrollView 
                    horizontal={true}
                    contentContainerStyle={{ width: `${100 * intervals}%` }}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={200}
                    decelerationRate="fast"
                    pagingEnabled>
                      {newArrivals.map((item, i) => (
                          <HomeList
                            key={item.id}
                            image={item.image}
                            title={item.title}
                            desc={item.desc}
                            price={item.price}
                          />
                        ))}
                    </ScrollView>
                    <Block style={style.bullets}>
                        {bullets}
                    </Block>
                    </Block> */}
                        
                    </Block>
                    )}
                    </ScrollView>
                    
                    </Fragment>
               
            
            
        </Block>
    )
    }
}



const style = StyleSheet.create({
    
    main: {
        backgroundColor: '#F4F4F7'
    },
    bullets: {
      position: 'absolute',
      bottom: -20,
      display: 'flex',
      width:100,
      left:'50%',
      marginLeft: -50,
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingTop: 5
    },
    bullet: {
      paddingHorizontal: 2,
      fontSize: 30,
    }

  })


export default Home;