import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, ActivityIndicator, FlatList, ToastAndroid } from 'react-native';
import {Button, Block, Text, Card, HomeList} from '../components';
import {theme} from '../constants';
import { CommonActions } from '@react-navigation/native';
import endpoint from '../api/endpoint';

const { width, height } = Dimensions.get('screen');

import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckOut = ({navigation,route}) => {

    const url = 'https://www.softwebsystems.com/UTsarees-api/uploads/';

    const  [loading,setLoading ]= React.useState(false);
    const  [cartDetail,setCartDetail ]= React.useState([]);
    const  [userId,setUserId ]= React.useState(null);
    const [subtotal, setSubtotal] = React.useState(0);

    const passListAddress = async () => {
        navigation.dispatch(CommonActions.navigate({name: 'ListAddress', params: {id: userId}}));
    }
    

    const getCartDetail = async () => {
        setLoading(true);
        let userId;
        userId = null;
        try {
            userId = await AsyncStorage.getItem('userId')
        } catch (e) {
            console.log(e);
        }
        setUserId(userId);
        await endpoint.get(`/listcart/${userId}`).then(response => {
            setLoading(false);
            setCartDetail(response.data);
            const sTot = response.data.reduce((i, a) => {
                return i+a.stotal;
            },0)
            setSubtotal(sTot);
        });
    }

    const removeCart = async (cartId) => {
        setLoading(true);
        try{
            await endpoint.delete(`/deletecart/${cartId}`).then(res => {
                setLoading(false);
            if(res.data == 1){
                ToastAndroid.show(`Product Has removed Successfull`, ToastAndroid.SHORT);
            }else{
                ToastAndroid.show(`Something went wrong, Please try again`, ToastAndroid.LONG);
            }
            
            getCartDetail();
            
            });
        }catch(err){
            console.log(err);
        }
    };



    const updateCart = async (cartId, qty, stock) => {
        //console.log(cartId, qty, stock);

        if(qty <= 0){
            removeCart(cartId);
        }else{
            if(qty > stock){
                ToastAndroid.show(`We have ${stock} items of this selected Size`, ToastAndroid.LONG);
            }else{
                setLoading(true);
                let params = {
                    'user_ID': userId,
                    'cart_item_ID': cartId,
                    'qty': qty
                }
                let config = {
                    headers: {'Content-Type': 'application/json'}
                }
                try{
                    await endpoint.post('/updatecart', params, config).then(res => {
                        setLoading(false);
                        getCartDetail();
                    });
                }catch(err){

                }
            }
        }
    };

    React.useEffect(()=>{
        setTimeout(()=> {
            getCartDetail();
        }, 1000) 
        navigation.addListener('focus', () => {
            getCartDetail();    
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
                <TouchableOpacity onPress={() => navigation.goBack()} style={{alignItems: 'flex-end', paddingLeft: theme.sizes.padding}}>
                    <Image style={{width:18, height:13}} source={require('../assets/images/left-arrow-pink.png')} resizeMode="contain" />
                </TouchableOpacity>
                <Block style={{paddingLeft: theme.sizes.padding}}>
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:20}}>Checkout</Text>
                </Block>
            </Block>
            <Block row middle center flex={false} style={{backgroundColor:'#fff', height: height/12}}>
                <Block middle center>
                    <Image source={require('../assets/images/checkout-curr-state.png')} resizeMode="contain" style={{width:30, height:30}} />
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:12, color:'#1A1C29', textTransform:'uppercase', paddingTop:10}}>SELeCT PRODUCT</Text>
                </Block>
                <Block middle center>
                <Image source={require('../assets/images/checkout-default-state.png')} resizeMode="contain" style={{width:30, height:30}} />
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:12, color:'#969696', textTransform:'uppercase', paddingTop:10}}>ADD ADDRESS</Text>
                </Block>
                <Block middle center>
                <Image source={require('../assets/images/checkout-default-state.png')} resizeMode="contain" style={{width:30, height:30}} />
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:12, color:'#969696', textTransform:'uppercase', paddingTop:10}}>Payment</Text>
                </Block>
            </Block>
            {
                cartDetail.length > 0 ? (
                     loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (
                    <Block>
            <ScrollView>
            
                
                

                <Fragment>
                <Block padding={theme.sizes.padding}>
                    <FlatList 
                    data={cartDetail}
                    keyExtractor={(item, index)=> `${item.cart_item_ID}`}
                    renderItem={({item}) => (
                        
                    <Card>
                        <Block row flex={false} style={{height:height/7, justifyContent:'space-between'}}>
                            <Image style={{flex:0.4, height:'100%', borderRadius:5}} source={{uri: url+item.assets[0].asset_path}} resizeMode='cover' />
                            <Block style={{flex:0.55}}>
                                <Text style={{fontFamily: 'Roboto_700Bold', fontSize:14}}>{item.product_name}</Text>
                    <Text color='gray' style={{fontFamily: 'Roboto_400Regular', fontSize:12, marginBottom:10}}>{item.description}</Text>
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase', marginBottom:15}}>Starting At <Text color='primary' style={{fontFamily: 'Roboto_700Bold'}}>₹ {item.price}</Text></Text>
                                <Block row center>
                                <Block row center>
                                    <Button onPress={() => updateCart(item.cart_item_ID, Number(item.qty) - 1, item.stock)} style={{height:44, width:30,borderColor: '#D6E1F2', borderWidth: 1, borderRightWidth:0, justifyContent:'center', alignItems:'center', borderRightRadius:0}}><Image style={{width:11, height:2}} source={require('../assets/images/reduce-product.png')} resizeMode='contain' /></Button>
                                    <TextInput style={{ height: 44, width:30, borderColor: '#D6E1F2', borderWidth:1, marginLeft:-3, textAlign:'center'}} value={item.qty} />
                                    <Button onPress={() => updateCart(item.cart_item_ID, Number(item.qty) + 1, item.stock)} style={{height:44, width:30,borderColor: '#D6E1F2', borderWidth: 1, borderLeftWidth:0, justifyContent:'center', alignItems:'center', borderLeftRadius:0}}><Image style={{width:11, height:11}} source={require('../assets/images/increase-product.png')}  resizeMode='contain' /></Button>
                                </Block>
                                <Button onPress={() => removeCart(item.cart_item_ID)} style={{width:44, height:44, backgroundColor:'#F4F4F7', justifyContent:'center', alignItems:'center'}}><Image style={{width:17, height:20}} source={require('../assets/images/delete-product.png')} resizeMode='contain' /></Button>
                                </Block>
                            </Block>
                        </Block>
                    </Card>
                    
                    )} />
                    </Block>
    
                    <Block padding={theme.sizes.padding}>
                    <Text color='gray' style={{paddingBottom:5}}>PRICE DETAILS</Text>
                    <Card>
                        <Block row style={{justifyContent:'space-between', borderColor:'#9A9EB230', borderBottomWidth:1, paddingBottom:10, marginBottom:10}}>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize:16, color:'#969696'}}>Product Prize</Text>
                    <Text style={{fontFamily: 'Roboto_700Bold', fontSize:16, color:'#000'}}>₹ {subtotal}</Text>
                        </Block>
                        {/* <Block row style={{justifyContent:'space-between', borderColor:'#9A9EB230', borderBottomWidth:1, paddingBottom:10, marginBottom:10}}>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize:16, color:'#969696'}}>Earned Points</Text>
                            <Text style={{fontFamily: 'Roboto_700Bold', fontSize:16, color:'#000'}}>45</Text>
                        </Block> */}
                        <Block row style={{justifyContent:'space-between', borderColor:'#9A9EB230', borderBottomWidth:1, paddingBottom:10, marginBottom:10}}>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize:16, color:'#969696'}}>Shipping</Text>
                            <Text style={{fontFamily: 'Roboto_700Bold', fontSize:16, color:'#000'}}>Free</Text>
                        </Block>
                        <Block row style={{justifyContent:'space-between'}}>
                            <Text style={{fontFamily: 'Roboto_700Bold', fontSize:16, color:'#000'}}>Total</Text>
                    <Text style={{fontFamily: 'Roboto_700Bold', fontSize:16, color:'#000'}}>₹ {subtotal}</Text>
                        </Block>
                    </Card>
                    </Block>
                    </Fragment>
                
            
                
            </ScrollView>
            <Block padding={theme.sizes.padding} style={{paddingBottom:80}}>
                <Button onPress={()=> passListAddress()} color='primary' style={{alignItems:'center'}}><Text color='white' style={{fontFamily: 'Roboto_700Bold', fontSize:14, textTransform:'uppercase'}}>NEXT</Text></Button>
            </Block>
            </Block>

            )

            ) : (<Block center middle><Text title>No Items in this Cart</Text></Block>)}
            
        </Block>
    )}

}

const style = StyleSheet.create({
    main: {
        backgroundColor: '#F4F4F7'
    }
})

export default CheckOut;