import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, ActivityIndicator, FlatList, Alert, SafeAreaView } from 'react-native';
import {Button, Block, Text, Card, HomeList} from '../components';
import endpoint from '../api/endpoint';
import { CommonActions } from '@react-navigation/native';
import {theme} from '../constants';

const { width, height } = Dimensions.get('screen');

import AsyncStorage from '@react-native-async-storage/async-storage';


const ShareList = ({navigation}) => {

    const url = 'https://www.softwebsystems.com/UTsarees-api/uploads/';

    const  [loading,setLoading ]= React.useState(false);
    const  [userId,setUserId ]= React.useState(null);
    const  [sharedList,setSharedList ]= React.useState([]);

    const getSharedList = async () => {
        setLoading(true);
        let userId;
        userId = null;
        try {
            userId = await AsyncStorage.getItem('userId')
        } catch (e) {
            console.log(e);
        }
        setUserId(userId);
        await endpoint.get(`/listshared/${userId}`).then(response => {
            setLoading(false);
            setSharedList(response.data);
        }).catch(error => {
            setLoading(false);
            Alert.alert('Error!', 'Something went wrong Please try again later', [{ text: "OK"}]);
            return;
        })
    }

    const passProductDetail = async (prodId, prodName) => {
        navigation.dispatch(CommonActions.navigate({name: 'ProductDetail', params: {id: prodId, name: prodName}}));
    }

    const getMinPrice = (array) => {
        array.reduce((min, p) => p.price < min.price ? p.price : min.price, array[0].price);
    }

    const passCart = async () => {
        navigation.navigate('CatelogList', { screen: 'CheckOut', initial: false})
    }


    React.useEffect(()=>{
       getSharedList();
       navigation.addListener('focus', () => {
        getSharedList();    
    });
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
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:20}}>Shared List</Text>
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
                data={sharedList}
                keyExtractor={(item, index)=> `${item.shared_ID}`}
                renderItem={({item}) => (
                    

                        item.product_details.map((share)=>(
                            <Card key={share.product_ID}>
                            {share.assets.length > 0 ? (
                                share.assets.length > 3 ? (
                                    <Block row flex={false} style={{height:height/5, overflow:'hidden', justifyContent: 'space-between', marginBottom:20}}>
                                        <Block flex={0.58}>
                                            <Image style={{width:'100%', height:'100%', borderRadius:5}} source={{uri: url+share.assets[0].asset_path}} resizeMode="cover" />
                                        </Block>
                                        <Block flex={0.39}>
                                            <Image style={{height:'48%',width:'100%', borderRadius:5}} source={{uri: url+share.assets[1].asset_path}} resizeMode="cover" />
                                            <Block style={{position:'relative', height:'48%', marginTop:10}}>
                                                <Image style={{height:'100%',width:'100%', borderRadius:5}} source={{uri: url+share.assets[3].asset_path}} resizeMode="cover" />
                                                <Block middle center style={{position:'absolute', left:0, top:0, backgroundColor:'#00000080', width:'100%', height:'100%', borderRadius:5}}><Text color='white' style={{fontFamily: 'Roboto_700Bold', fontSize:18}}>+3</Text></Block>
                                            </Block>
                                        </Block>
                                    </Block>
                                
                            ) : share.assets.length == 3 ? (
                                <Block row flex={false} style={{height:height/5, overflow:'hidden', justifyContent: 'space-between', marginBottom:20}}>
                                    <Block flex={0.58}>
                                        <Image style={{width:'100%', height:'100%', borderRadius:5}} source={{uri: url+share.assets[0].asset_path}} resizeMode="cover" />
                                    </Block>
                                    <Block flex={0.39}>
                                        <Image style={{height:'48%',width:'100%', borderRadius:5}} source={{uri: url+share.assets[1].asset_path}} resizeMode="cover" />
                                        <Block style={{position:'relative', height:'48%', marginTop:10}}>
                                            <Image style={{height:'100%',width:'100%', borderRadius:5}} source={{uri: url+share.assets[2].asset_path}} resizeMode="cover" />
                                            {/* <Block middle center style={{position:'absolute', left:0, top:0, backgroundColor:'#00000080', width:'100%', height:'100%', borderRadius:5}}><Text color='white' style={{fontFamily: 'Roboto_700Bold', fontSize:18}}>+3</Text></Block> */}
                                        </Block>
                                    </Block>
                                </Block>
                            ) : (share.assets.length < 3 && share.assets.length > 1) ? (
                                <Block row flex={false} style={{height:height/5, overflow:'hidden', justifyContent: 'space-between', marginBottom:20}}>
                                    <Block flex={0.58}>
                                        <Image style={{width:'100%', height:'100%', borderRadius:5}} source={{uri: url+share.assets[0].asset_path}} resizeMode="cover" />
                                    </Block>
                                    <Block flex={0.39}>
                                        <Image style={{height:'48%',width:'100%', borderRadius:5}} source={{uri: url+share.assets[1].asset_path}} resizeMode="cover" />
                                    </Block>
                                </Block>
                            ) : (
                                <Block row flex={false} style={{height:height/5, overflow:'hidden', justifyContent: 'space-between', marginBottom:20}}>
                                    <Block flex={1}>
                                        <Image style={{width:'100%', height:'100%', borderRadius:5}} source={{uri: url+share.assets[0].asset_path}} resizeMode="cover" />
                                    </Block>
                                </Block>
                            )
                            ) : null}
                            <Text style={{fontFamily: 'Roboto_700Bold', fontSize:18}}>{share.product_name}</Text>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#969696', marginBottom: 10}}>{share.shortdesc}</Text>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>STARTING AT 
                                {/* <Text color="primary" style={{fontFamily: 'Roboto_700Bold', fontSize:14}}>₹ {item.price}</Text> */}
                                <Text color="primary" style={{fontFamily: 'Roboto_700Bold', fontSize:14}}> ₹ {share.options.length > 1 ? getMinPrice(share.options) : (share.options[0].price)}</Text>
                            </Text>

                            <Block row style={{justifyContent:'space-between'}}>
                                <Button onPress={()=> passProductDetail(share.product_ID, share.product_name)} style={{backgroundColor:'#FF0076', display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', width:'100%'}}>
                                    <Text color='white' style={{fontFamily: 'Roboto_700Bold', fontSize: 14, textTransform:'uppercase', paddingLeft:10}}>Buy Now</Text>
                                </Button>
                                {/* <Button style={{borderColor:'#D9D9D9', borderWidth:1, borderRadius:5, width:'15%', justifyContent:'center', alignItems:'center'}}>
                                    <Image source={require('../assets/images/share.png')} resizeMode='contain' style={{width:17, height:19}} />
                                </Button> */}
                            </Block>

                            </Card>
                        ))
                        
                        )} />

                    
                    {/* <Block flex={false} row style={{marginTop:15, marginBottom:20}}>
                        {
                            item.points != null ? (
                                <Block row flex={false} style={{backgroundColor:'#F4F4F7', paddingLeft:4,paddingRight:5, paddingVertical:3, borderRadius:20, marginRight:10}}>
                            <Image style={{width:19, height:19, marginRight:5}} source={require('../assets/images/points-icn.png')} resizeMode="contain" />
                            <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize: 12}}>You will get <Text style={{fontFamily: 'Roboto_700Bold'}}>{item.points} points</Text></Text>
                        </Block>
                            ) : (<Text></Text>)
                        }
                        {
                            item.freeShip ? (
                                <Block row flex={false} style={{backgroundColor:'#F4F4F7', paddingLeft:4,paddingRight:5, paddingVertical:3, borderRadius:20}}>
                                    <Image style={{width:19, height:19, marginRight:5}} source={require('../assets/images/shipping-icn.png')} resizeMode="contain" />
                                    <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize: 12}}>Free Shipping</Text>
                                </Block>
                            ) : (<Text></Text>)
                        }                        
                    </Block> */}
                    
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

export default ShareList;