import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import {Button, Block, Text, Card, HomeList} from '../components';
import RadioGroup from 'react-native-custom-radio-group';
import { CommonActions } from '@react-navigation/native';
import {theme} from '../constants';
import endpoint from '../api/endpoint';

const { width, height } = Dimensions.get('screen');

const ReviewOrder = ({navigation, route, Payment}) => {

    const url = 'https://www.softwebsystems.com/UTsarees-api/uploads/';

    const [loading,setLoading ] = React.useState(false);
    const [cartList, setCartList] = React.useState([]);
    const [address, setaddress] = React.useState([]);
    const [subtotal, setSubtotal] = React.useState(0);
    const [prodTotal, setProdTotal] = React.useState(0);
    const [rewardPoins, setRewardPoins] = React.useState([]);
    const [payment, onChangePayment] = React.useState(null);
    const userId = route.params.userId;
    const addId = route.params.addId;

    const getReviewList = async () => {
        setLoading(true);
        let config = {
            headers: {'Content-Type': 'application/json'}
        }
        let params = {            
            "addressid" : addId,
            "userid" : userId
        }
        await endpoint.post(`/checkout`, JSON.stringify(params), config).then(response => {
            setLoading(false);
            setCartList(response.data.cart);
            setaddress([response.data.address]);
            setRewardPoins([response.data.rewardsvalue])
            const sTot = response.data.cart.reduce((i, a) => {
                return i+a.stotal;
            },0)
            setSubtotal(sTot);

            const fTot = response.data.cart.reduce((j, b) => {
                return j+Number(b.price);
            },0)
            setProdTotal(fTot);

            // const rPoint = response.data.cart.reduce((j, b) => {
            //     return Number(j+b.reward_value);
            // },0)
            // setRewardPoins(rPoint);

        });
    }

    const placeOrder = async () => {
        setLoading(true);
        let transaction = [];
        let config = {
            headers: {'Content-Type': 'application/json'}
        }
        cartList.map(cart => {
            transaction.push({
                "stock_ID": cart.stock_ID,
                "product_ID": cart.product_ID,
                "product_option_ID": cart.product_option_ID,
                "offers": cart.offers,
                "qty": cart.qty,
                "price": cart.price,
                "stotal": cart.stotal
            })
        })
        let params = {            
            "user_ID": userId,
            "address_ID": addId,
            "stotal": prodTotal,
            "taxamt": "0",
            "offeramt": "0",
            "rewards_value_used": "0",
            "shipping_amt": "0",
            "total": subtotal,
            "pay_method": payment,
            "payment_status": "Pending",
            "payment_details": null,
            "status": "Pending",
            "transaction": transaction
        }

        await endpoint.post(`/createorder`, JSON.stringify(params), config).then(res => {
            setLoading(false);
            //console.log(res.data.Order_id.status = );
            if(res.data.Order_id.status == "Success"){
                navigation.dispatch(CommonActions.navigate({name: 'SuccessOrder'}));
            }
        }).catch(err => console.log(err))
        //console.log(params);
    }

    React.useEffect(()=>{
        setTimeout(()=> {
        getReviewList();
        }, 1000);
        navigation.addListener('focus', () => {
            getReviewList();    
        });
    }, []);
    

    // console.log('addId: '+addId);
    // console.log('userId: '+userId);

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
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:20}}>Review Order</Text>
                </Block>
            </Block>
            <Block row middle center flex={false} style={{backgroundColor:'#fff', height: height/12}}>
                <Block middle center>
                    <Image source={require('../assets/images/checkout-active-state.png')} resizeMode="contain" style={{width:30, height:30}} />
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:12, color:'#1A1C29', textTransform:'uppercase', paddingTop:10}}>SELeCT PRODUCT</Text>
                </Block>
                <Block middle center>
                    <Image source={require('../assets/images/checkout-active-state.png')} resizeMode="contain" style={{width:30, height:30}} />
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:12, color:'#1A1C29', textTransform:'uppercase', paddingTop:10}}>ADD ADDRESS</Text>
                </Block>
                <Block middle center>
                    <Image source={require('../assets/images/checkout-curr-state.png')} resizeMode="contain" style={{width:30, height:30}} />
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:12, color:'#1A1C29', textTransform:'uppercase', paddingTop:10}}>PAYMENT</Text>
                </Block>
            </Block>
            
            <ScrollView>

                { loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (
                    <Block padding={theme.sizes.padding}>
                        <Block style={{marginBottom:20, position: 'relative'}}>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase', paddingBottom:10}}>Selected Product</Text>
                            <FlatList 
                    data={cartList}
                    keyExtractor={(item, index)=> `${item.cart_item_ID}`}
                    renderItem={({item}) => (
                        
                    <Card>
                        <Block row flex={false} style={{height:height/11, justifyContent:'space-between'}}>
                            <Image style={{flex:0.2, height:'100%', borderRadius:5}} source={{uri: url+item.assets[0].asset_path}} resizeMode='cover' />
                            <Block style={{flex:0.75}}>
                                <Text style={{fontFamily: 'Roboto_700Bold', fontSize:14}}>{item.product_name}</Text>
                    <Text color='gray' style={{fontFamily: 'Roboto_400Regular', fontSize:12, marginBottom:10}}>{item.description}</Text>
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase', marginBottom:15}}>Starting At <Text color='primary' style={{fontFamily: 'Roboto_700Bold'}}>₹ {item.price}</Text></Text>
                            </Block>
                        </Block>
                    </Card>
                    
                    )} />

                        </Block>

                        <Block style={{marginBottom:20, position: 'relative'}}>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase', paddingBottom:10}}>DELIVERY ADDRESS</Text>

                            <FlatList 
                    data={address}
                    keyExtractor={(item, index)=> `${item.address_ID}`}
                    renderItem={({item}) => (
                        <Card style={{marginBottom:20}}>
                            <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase'}}>{item.name}</Text>
                            <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>{item.item}, {item.locality}, {item.city}, {item.state} - {item.pincode}</Text>
                            <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>PHONE: {item.mobile}</Text>
                            <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>{item.landmark}</Text>
                        </Card>
                    )} />

                            
                        </Block>

                        <Block style={{marginBottom:20, position: 'relative'}}>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase', paddingBottom:10}}>PRICE DETAILS</Text>
                            <Card>
                                <Block row style={{justifyContent:'space-between', borderColor:'#9A9EB230', borderBottomWidth:1, paddingBottom:10, marginBottom:10}}>
                                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:16, color:'#969696'}}>Product Prize</Text>
                                    <Text style={{fontFamily: 'Roboto_700Bold', fontSize:16, color:'#000'}}>₹ {prodTotal}</Text>
                                </Block>
                                <Block row style={{justifyContent:'space-between', borderColor:'#9A9EB230', borderBottomWidth:1, paddingBottom:10, marginBottom:10}}>
                                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:16, color:'#969696'}}>Earned Points</Text>
                                    <Block>
                                    <FlatList 
                                        data={rewardPoins}
                                        keyExtractor={(item, index)=> `${index}`}
                                        renderItem={({item}) => (
                                            <Text style={{fontFamily: 'Roboto_700Bold', fontSize:16, color:'#000', textAlign:'right'}}>{item.points_value_available}</Text>
                                        )} />
                                    </Block>
                                </Block>
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
                        <Block style={{marginBottom:20, position: 'relative'}}>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase', paddingBottom:10}}>SELECT PAYMENT METHOD</Text>
                            <RadioGroup 
                                radioGroupList={Payment}
                                buttonContainerActiveStyle = {{backgroundColor: '#FF0076', flex:1, marginRight:3,marginLeft:3, borderColor: '#FF0076', borderWidth: 1, height: 50,fontFamily: 'Roboto_400Regular', fontSize: 14, fontWeight: 'normal'}}
                                buttonContainerInactiveStyle = {{backgroundColor: '#fff', flex:1,marginRight:3,marginLeft:3, borderColor: '#fff', borderWidth: 1, height: 50,fontFamily: 'Roboto_400Regular', fontSize: 14}}
                                buttonTextActiveStyle = {{color: '#fff'}}
                                buttonTextInactiveStyle = {{color: '#2B2F52'}}
                                onChange = {payment => onChangePayment(payment) }
                                value={payment}
                                />
                        </Block>
                        {
                            payment != null ? (<Button onPress={() => placeOrder()} color='primary' style={{alignItems:'center'}}><Text color='white' style={{fontFamily: 'Roboto_700Bold', fontSize:14, textTransform:'uppercase'}}>Place Order</Text></Button>) : (<></>)
                        }
                        
                    </Block>
                )}

                {/* <Block padding={theme.sizes.padding}>
                    
                
                <Card style={{backgroundColor:'f9f9fb', borderColor:'#EAEAEA', borderWidth:1}}>
                    <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase', paddingBottom:15}}>From Address</Text>
                    <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase'}}>CHITRA KAILASH</Text>
                    <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>Flat No. 5, Victoria Garden, 106, J.N. Salai, Koyambedu, Chennai - 600107</Text>
                    <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>PHONE: 900 900 9000</Text>
                    <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>Near by Reliance trends</Text>
                </Card>
                
                
                </Block> */}
            </ScrollView>
            
        </Block>
    )}

}

ReviewOrder.defaultProps = {
    Payment : [
    // {
    //     id: 0,
    //     label: 'Debit Or Credit Card',
    //     value: 'card'
    // },
    // {
    //     id: 1,
    //     label: 'Internet Banking',
    //     value: 'netbanking'
    // },
    {
        id: 2,
        label: 'Cash On Delivery',
        value: 'cod'
    }

    ]
  }

const style = StyleSheet.create({
    main: {
        backgroundColor: '#F4F4F7'
    }
})

export default ReviewOrder;