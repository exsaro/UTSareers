import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import RadioGroup from 'react-native-custom-radio-group';
import {Button, Block, Text, Card, HomeList} from '../components';
import {theme} from '../constants';
import endpoint from '../api/endpoint';
import { CommonActions } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('screen');

import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetail = ({navigation,route}) => {

    const url = 'https://www.softwebsystems.com/UTsarees-api/uploads/';
    const prodId = route.params.id;
    const prodName = route.params.name;

    const  [loading,setLoading ]= React.useState(false);
    const  [productDetail,setProductDetail ]= React.useState([]);
    const  [userId,setUserId ]= React.useState(null);
    const [size, onChangeSize] = React.useState(null);

    const [checked, setChecked] = React.useState(null);

    const getProductDetail = async () => {
        setLoading(true);
        let userId;
        userId = null;
        try {
            userId = await AsyncStorage.getItem('userId')
        } catch (e) {
            console.log(e);
        }
        setUserId(userId);
        await endpoint.get(`/viewproduct/${prodId}/${userId}`).then(response => {
            setLoading(false);
            setProductDetail(response.data);
        });
    }

    const ShareWatsapp = async (imgPath) => {
        setLoading(true);
        const shareOptions = {
            dialogTitle : 'Share via'
        };
        const downloadResumable = FileSystem.createDownloadResumable(
            `https://www.softwebsystems.com/UTsarees-api/uploads/${imgPath}`,
            `${FileSystem.documentDirectory}/${imgPath}`,
            {},
        );
      
        const { uri, status } = await downloadResumable.downloadAsync();
        
        Sharing.shareAsync(uri, shareOptions).then(res => {
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            Alert.alert('Error!', 'Something went Wrong', [{ text: "OK"}]);
        });
        
    }
    

    const listCart = async (stockId) => {
        setLoading(true);
        let params = {            
            "user_ID" : userId,
            "stock_ID" : stockId,
            "qty" : 1
        }

        let config = {
            headers: {'Content-Type': 'application/json'}
        }
        await endpoint.post(`/createcart`, JSON.stringify(params), config).then(res => {
            setLoading(false);
            //console.log(res.data);
            if(res.data){
                navigation.dispatch(CommonActions.navigate({name: 'CheckOut'}));
            }
        });
    }

    const passCart = async () => {
        //navigation.navigate('CatelogList', { screen: 'CheckOut', initial: false})
        navigation.dispatch(CommonActions.navigate({name: 'CheckOut'}));
    }
    
    
  

    React.useEffect(()=>{
        getProductDetail();
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
            <Block flex={false} row style={{height: height/7, paddingTop:20, alignItems: 'center'}}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{alignItems: 'flex-end', paddingLeft: theme.sizes.padding}}>
                    <Image style={{width:18, height:13}} source={require('../assets/images/left-arrow-pink.png')} resizeMode="contain" />
                </TouchableOpacity>
                <Block style={{paddingLeft: theme.sizes.padding}}>
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:20}}>{prodName}</Text>
                </Block>
                <TouchableOpacity onPress={() => passCart()} style={{alignItems: 'flex-end', paddingRight: theme.sizes.padding}}>
                    <Image style={{width:22, height:27}} source={require('../assets/images/addtocart.png')} resizeMode="contain" />
                </TouchableOpacity>
            </Block>
            <SafeAreaView style={{flex: 1}}>
                
            { loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (

                <FlatList 
                data={productDetail}
                keyExtractor={(item, index)=> `${item.product_ID}`}
                renderItem={({item}) => (

                    <Block style={{paddingLeft: theme.sizes.padding, paddingRight: theme.sizes.padding}}>
                    <Card>
                        {
                            item.assets.length > 0 ? (
                                <Block row flex={false} style={{height:height/5, overflow:'hidden', justifyContent: 'space-between', marginBottom:20}}>
                                    <Block flex={1}>
                                        <Image style={{width:'100%', height:'100%', borderRadius:5}} source={{uri: url+item.assets[0].asset_path}} resizeMode="cover" />
                                    </Block>
                                </Block>
                            ) : null
                        }
                        
                <Text style={{fontFamily: 'Roboto_700Bold', fontSize:18}}>{item.product_name}</Text>
                <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#969696', marginBottom: 10}}>{item.shortdesc}</Text>
                        <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>STARTING AT <Text color="primary" style={{fontFamily: 'Roboto_700Bold', fontSize:14}}>₹ {item.options[0].price}</Text></Text>
                        <Block flex={false} row style={{marginTop:15, marginBottom:20}}>
                        {/* <Block row flex={false} style={{backgroundColor:'#F4F4F7', paddingLeft:4,paddingRight:5, paddingVertical:3, borderRadius:20, marginRight:10}}>
                            <Image style={{width:19, height:19, marginRight:5}} source={require('../assets/images/points-icn.png')} resizeMode="contain" />
                            <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize: 12}}>You will get <Text style={{fontFamily: 'Roboto_700Bold'}}>4 points</Text></Text>
                        </Block>
                        <Block row flex={false} style={{backgroundColor:'#F4F4F7', paddingLeft:4,paddingRight:5, paddingVertical:3, borderRadius:20}}>
                                    <Image style={{width:19, height:19, marginRight:5}} source={require('../assets/images/shipping-icn.png')} resizeMode="contain" />
                                    <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize: 12}}>Free Shipping</Text>
                                </Block> */}
                        </Block>
                        <Block style={{marginBottom:15}}>
                        <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, color:'#9A9EB2', marginBottom:5}}>SIZE & FIT</Text>
                        {item.options.map((option)=>(
                            <Fragment key={option.product_option_ID}>
                                <Block row center>
                                    <RadioButton
                                        value={option.size}
                                        color="black"
                                        status={ checked === option.size ? 'checked' : 'unchecked' }
                                        onPress={() => setChecked(option.size)}
                                    />
                                    <Text>{option.size}</Text>
                                </Block>
                                {
                                    item.assets.length > 0 ? (<Block row style={{justifyContent:'space-between'}}>
                                    <Button onPress={() => ShareWatsapp(item.assets[0].asset_path)} style={{backgroundColor:'#4CAF50', display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', width:'80%'}}>
                                        <Image style={{width:23, height:23}} source={require('../assets/images/whatsapp-icn.png')} resizeMode='contain' />
                                        <Text color='white' style={{fontFamily: 'Roboto_700Bold', fontSize: 14, textTransform:'uppercase', paddingLeft:10}}>Share whatsapp</Text>
                                    </Button>
                                    <Button onPress={() => ShareWatsapp(item.assets[0].asset_path)} style={{borderColor:'#D9D9D9', borderWidth:1, borderRadius:5, width:'15%', justifyContent:'center', alignItems:'center'}}>
                                        <Image source={require('../assets/images/share.png')} resizeMode='contain' style={{width:17, height:19}} />
                                    </Button>
                                    </Block>) : null
                                }
                                

                                {
                                    checked != null && option.cart_status == 0 ? (
                                        <Button onPress={() => listCart(option.stock_ID)} style={{backgroundColor:'#f4f4f7', display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:15}}>
                                            <Text color='black' style={{fontFamily: 'Roboto_400Regular', fontSize: 14, textTransform:'uppercase', marginRight:10}}>Add to Cart</Text>
                                            <Image source={require('../assets/images/right-arrow-pink-sm.png')} style={{width:10, height:7}} resizeMode="contain" />
                                        </Button>) : checked != null && option.cart_status == 1 ? (<Block style={{paddingTop:15, paddingBottom:15}} center><Text>This Product added already in Cart</Text></Block>) : (<Text></Text>)
                                }
                            </Fragment>
                           
                        ))}
                        </Block>




                    

                    <Block style={{marginBottom:15}}>
                        <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, color:'#9A9EB2', marginBottom:5}}>PRODUCT DETAILS</Text>
                        <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, color:'#2B2F52'}}>{item.description}</Text>
                    </Block>
                    <Block style={{marginBottom:15}}>
                        <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, color:'#9A9EB2', textTransform:'uppercase', marginBottom:5}}>Note</Text>
                        <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, color:'#2B2F52'}}>{item.notes}</Text>
                    </Block>
                    <Block row flex={false} style={{marginBottom:20}}>
                        <Block middle center style={{backgroundColor:'#F4F4F7', borderRadius:5, height: height/9}}>
                            <Image source={require('../assets/images/directstore-icn.png')} style={{width:22, height:22, marginBottom:10}} resizeMode="contain" />
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, textTransform:'uppercase', textAlign: 'center'}}>DIRECT BUY In STORE</Text>
                        </Block>
                        <Block middle center style={{backgroundColor:'#F4F4F7', borderRadius:5, height: height/9, marginRight:7, marginLeft:7}}>
                            <Image source={require('../assets/images/cashondelivery.png')} style={{width:22, height:22, marginBottom:10}} resizeMode="contain" />
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, textTransform:'uppercase', textAlign: 'center'}}>Cash on
Delivery</Text>
                        </Block>
                        <Block middle center style={{backgroundColor:'#F4F4F7', borderRadius:5, height: height/9}}>
                            <Image source={require('../assets/images/return-icn.png')} style={{width:22, height:22, marginBottom:10}} resizeMode="contain" />
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, textTransform:'uppercase', textAlign: 'center'}}>EASY 7 DAYS
RETURN</Text>
                        </Block>
                    </Block>
                    {/* <Block>
                        <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, color:'#9A9EB2', textTransform:'uppercase', marginBottom:5}}>Resellers Review</Text>
                        <Block style={{borderWidth:1, borderRadius:5, borderColor:'#E4E4E4'}}>
                            <Block row style={{padding:20, paddingBottom:0, borderColor:'#E4E4E4', borderBottomWidth:1, justifyContent:'space-between', alignItems:'center'}}>
                                <Card flex={false} style={{backgroundColor:'#F4F4F7', display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', height:35}}>
                                    <Text style={{fontFamily: 'Roboto_700Bold', fontSize: 14, paddingRight:5}}>4.5</Text>
                                    <Image style={{width:11, height:11}} source={require('../assets/images/star-review.png')} resizeMode="contain" />
                                </Card>
                                <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 11, height:35}}>28 Reviews</Text>
                            </Block>    
                            <Block row style={{padding:20, borderColor:'#E4E4E4', borderBottomWidth:1, justifyContent:'space-between', alignItems:'center'}}>
                                <Block>
                                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 14}}>Sindhu</Text>
                                    <Text color='gray' style={{fontFamily: 'Roboto_400Regular', fontSize: 11}}>Great Design</Text>
                                </Block>
                                <Text color='gray' style={{fontFamily: 'Roboto_400Regular', fontSize: 11}}>24 May 2020</Text>    
                            </Block>
                            <Block row style={{padding:20, borderColor:'#E4E4E4', borderBottomWidth:1, justifyContent:'space-between', alignItems:'center'}}>
                                <Block>
                                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 14}}>Sindhu</Text>
                                    <Text color='gray' style={{fontFamily: 'Roboto_400Regular', fontSize: 11}}>Great Design</Text>
                                </Block>
                                <Text color='gray' style={{fontFamily: 'Roboto_400Regular', fontSize: 11}}>24 May 2020</Text>    
                            </Block>
                            <TouchableOpacity>
                            <Block center middle row padding={theme.sizes.padding}>
                                <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 14, textTransform:'uppercase', paddingRight:10}}>View all REVIEWS</Text>
                                <Image style={{width:10, height:7}} source={require('../assets/images/right-arrow-pink-sm.png')} resizeMode='contain' />
                            </Block>
                            </TouchableOpacity>
                        </Block>
                    </Block> */}
                    </Card>        
                </Block>

                )} />

                
            )}
            </SafeAreaView>
        </Block>
    )}
}

const style = StyleSheet.create({
    main: {
        backgroundColor: '#F4F4F7'
    }
})

export default ProductDetail;