import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import {Button, Block, Text, Card, HomeList} from '../components';
import {theme} from '../constants';
import endpoint from '../api/endpoint';

const { width, height } = Dimensions.get('screen');

import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderList = ({navigation}) => {

    const url = 'https://www.softwebsystems.com/UTsarees-api/uploads/';

    const  [loading,setLoading ]= React.useState(false);
    const  [orderList,setOrderList ]= React.useState([]);

    const getOrderList = async () => {
        setLoading(true);
        let userId;
        userId = null;
        try {
            userId = await AsyncStorage.getItem('userId')
        } catch (e) {
            console.log(e);
        }
        await endpoint.get(`/listorder/${userId}`).then(response => {
            setLoading(false);
            setOrderList(response.data);
        });
    }

    // const passCart = async () => {
    //     navigation.navigate('CatelogList', { screen: 'CheckOut', initial: false})
    // }

    React.useEffect(() => {
        getOrderList();
        
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
            <Block flex={false} row style={{height: height/7, paddingTop:20, alignItems: 'center', backgroundColor: '#fff'}}>
                <Block style={{paddingLeft: theme.sizes.padding}}>
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:20}}>Order List</Text>
                </Block>
                <TouchableOpacity onPress={() => passCart()} style={{alignItems: 'flex-end', paddingRight: theme.sizes.padding}}>
                    <Image style={{width:22, height:27}} source={require('../assets/images/addtocart.png')} resizeMode="contain" />
                </TouchableOpacity>
            </Block>
            {/* <Block row flex={false} style={{backgroundColor:'#fff', borderColor: '#E4E4E4', borderTopWidth:1, height: height/12}}>
                <TouchableOpacity style={{width: width/2, justifyContent: 'center', alignItems: 'center'}}>
                    <Block center row flex={false}>
                        <Image style={{width:14, height:8}} source={require('../assets/images/sort.png')} resizeMode="contain" />
                        <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform: 'uppercase', paddingLeft:5}}>Sort</Text>
                    </Block>
                    <Text color="gray" style={{fontFamily: 'Roboto_400Regular', fontSize:12}}>New Arrivals</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{width: width/2, borderColor:'#E4E4E4',borderLeftWidth:1,justifyContent: 'center', alignItems: 'center'}}>
                <Block center row flex={false}>
                        <Image style={{width:13, height:10}} source={require('../assets/images/filter.png')} resizeMode="contain" />
                        <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform: 'uppercase', paddingLeft:5}}>Filters</Text>
                    </Block>
                    <Text color="gray" style={{fontFamily: 'Roboto_400Regular', fontSize:12}}>Select Category</Text>
                </TouchableOpacity>
            </Block> */}
            <ScrollView>
                {loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (
                <Block padding={theme.sizes.padding}>
                <FlatList
                data={orderList}
                keyExtractor={(item, index)=> `${item.order_ID}`}
                renderItem={({item}) => (
                    <Card>
                        <Block row flex={false} style={{height:height/9, justifyContent:'space-between'}}>

                            <Image style={{flex:0.3, height:'100%', borderRadius:5}} source={{uri: url+item.Transaction[0].asset_path}} resizeMode='cover' />

                            <Block style={{flex:0.65}}>
                <Text style={{fontFamily: 'Roboto_700Bold', fontSize:14}}>{item.Transaction[0].Product_name}</Text>
                                <Text color='gray' style={{fontFamily: 'Roboto_400Regular', fontSize:12, marginBottom:10}}>{item.Transaction[0].description}</Text>
                                <Text style={{fontFamily: 'Roboto_700Bold', fontSize:13}}>Status</Text>
                                <Text style={{fontFamily: 'Roboto_400Regular', fontSize:13}}>{item.status}</Text>
                            </Block>
                        </Block>
                    </Card>
                )} />
                    
                </Block>
                )}
            </ScrollView>


        </Block>
    )}
}


const style = StyleSheet.create({
    main: {
        backgroundColor: '#F4F4F7'
    }
})

export default OrderList;