import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, ActivityIndicator, FlatList, ToastAndroid } from 'react-native';
import {Button, Block, Text, Card, HomeList} from '../components';
import {theme} from '../constants';
import { RadioButton } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import endpoint from '../api/endpoint';

const { width, height } = Dimensions.get('screen');




const ListAddress = ({navigation, route}) => {

    const userId = route.params.id;

    const  [loading,setLoading ]= React.useState(false);
    const  [showBtn,setShowBtn ]= React.useState(false);
    const  [listAddress,setListAddress ]= React.useState([]);
    const  [addrsId,setAddrsId ]= React.useState(null);

    const [checked, setChecked] = React.useState(null);
    const [pincode, setPincode] = React.useState(null);

    const getListAddress = async () => {
        setLoading(true);
        
        await endpoint.get(`/listaddress/${userId}`).then(response => {
            setLoading(false);
            setListAddress(response.data);
            response.data.map((add, i) => {
                if(i == 0){
                    setAddrsId(add.address_ID);
                    verifyPincode(add.address_ID);
                    //setChecked(add.address_ID);
                    //setPincode(add.pincode);
                }
            })
        });
    }

    const passAddAddress = async () => {
        navigation.dispatch(CommonActions.navigate({name: 'AddAddress', params: {id: userId}}));
    }

    const passSelectedAddress = async () => {
        navigation.dispatch(CommonActions.navigate({name: 'ReviewOrder', params: { addId: addrsId, userId: userId }}));
    }

    const verifyPincode = async (addId) => {

        setLoading(true);
        setChecked(addId);
        setAddrsId(addId);
        let params = {            
            "address_ID" : addId,
            "user_ID" : userId
        }


        let config = {
            headers: {'Content-Type': 'application/json'}
        }
        await endpoint.post(`/verifyshipping`, JSON.stringify(params), config).then(res => {
            
            setLoading(false);
            
            if(res.data.status == 'Failed'){
                setShowBtn(false);
                ToastAndroid.show('Sorry We cant able to deliver this Location', ToastAndroid.LONG);
            }
            if(res.data.status == 'Success'){
                setShowBtn(true);
            }
            
        });
        
    }

    const deleteAddress = async (addId) => {
        await endpoint.delete(`/deleteaddress/${addId}`).then(res => {
            setLoading(false);
            if(res.data.status == 'Success'){
                ToastAndroid.show('Address Has deleted Successfully', ToastAndroid.LONG);
                getListAddress();
            }
        });
    }

    React.useEffect(()=>{
        //setTimeout(() => {getListAddress();}, 1000)
        getListAddress();
        navigation.addListener('focus', () => {
            getListAddress();
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
                    <Image source={require('../assets/images/checkout-active-state.png')} resizeMode="contain" style={{width:30, height:30}} />
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:12, color:'#1A1C29', textTransform:'uppercase', paddingTop:10}}>SELeCT PRODUCT</Text>
                </Block>
                <Block middle center>
                    <Image source={require('../assets/images/checkout-curr-state.png')} resizeMode="contain" style={{width:30, height:30}} />
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:12, color:'#1A1C29', textTransform:'uppercase', paddingTop:10}}>ADD ADDRESS</Text>
                </Block>
                <Block middle center>
                    <Image source={require('../assets/images/checkout-default-state.png')} resizeMode="contain" style={{width:30, height:30}} />
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:12, color:'#969696', textTransform:'uppercase', paddingTop:10}}>Payment</Text>
                </Block>
            </Block>
            <Block>
            <ScrollView>
                {
            loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (
                <Block padding={theme.sizes.padding}>
                    <Block style={{paddingBottom:10}}>
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase'}}>List Delivery Address</Text>
                    {/* <Text style={{fontFamily: 'Roboto_400Regular', fontSize:12}}>Must Include Landmarks</Text> */}
                    </Block>
                    {
                        listAddress.length > 0 ? (

                            listAddress.map(address => (
                                <Card style={{marginBottom:20}} key={address.address_ID}>
                                    <Block row>
                                        <RadioButton
                                            value={address.address_ID}
                                            color="black"
                                            status={ checked === address.address_ID ? 'checked' : 'unchecked' }
                                            onPress={() => verifyPincode(address.address_ID)}
                                        />
                                        <Block>
                            <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase'}}>{address.add_type} {address.address_ID}</Text>                
                                        <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase'}}>{address.name}</Text>
                                        <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>{address.address}, {address.city}, {address.state}, {address.country},  {address.pincode}</Text>
                                        <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>PHONE: {address.mobile}</Text>
                                            {address.landmark != null ? (<Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>address.landmark</Text>) : (<Text></Text>)}
                                            
                                        </Block>
                                    </Block>
                                    <Block row>
                                        {/* <Button onPress={() => editAddress(address.address_ID)} style={{backgroundColor:'#fff', height:45, justifyContent: 'center', marginRight:10, alignItems:'center', borderColor:'#D9D9D9', borderWidth:1, borderRadius:6, width:100}}><Text style={{color:'#003170', textTransform:'uppercase', fontWeight:'bold'}}><Image source={require('../assets/images/blue-edit.png')} resizeMode="cover" style={{width:17, height:19}} /> Edit</Text></Button> */}
                                        <Button onPress={() => deleteAddress(address.address_ID)} style={{backgroundColor:'#fff', height:45, justifyContent: 'center', alignItems:'center', borderColor:'#D9D9D9', borderWidth:1, borderRadius:6, width:100}}><Text style={{color:'#003170', textTransform:'uppercase', fontWeight:'bold'}}><Image source={require('../assets/images/blue-delete.png')} resizeMode="contain" style={{width:17, height:22, marginTop:-2}} /> Delete</Text></Button>
                                    </Block>
                                </Card>
                            ))
                    
                    ) : (<Block style={{height:height/3}} center middle><Text title>No Items in this Cart</Text></Block>)}

                {/* <Card style={{backgroundColor:'f9f9fb', borderColor:'#EAEAEA', borderWidth:1}}>
                    <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase', paddingBottom:15}}>From Address</Text>
                    <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase'}}>CHITRA KAILASH</Text>
                    <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>Flat No. 5, Victoria Garden, 106, J.N. Salai, Koyambedu, Chennai - 600107</Text>
                    <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>PHONE: 900 900 9000</Text>
                    <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>Near by Reliance trends</Text>
                </Card> */}
                
                
                <Button onPress={()=> passAddAddress()} style={{alignItems:'center', backgroundColor:'#fff'}}><Text style={{fontFamily: 'Roboto_700Bold', fontSize:14, textTransform:'uppercase', color:'#003170'}}><Image source={require('../assets/images/blue-plus.png')} resizeMode="contain" style={{width:11, height:11}} /> Add New Address</Text></Button>

                </Block>
                )}
            </ScrollView>
            </Block>

                <Block style={{paddingLeft:25, paddingRight:25, paddingBottom:20}} flex={false}>
                    {showBtn ? (<Button onPress={() => passSelectedAddress()} color='primary' style={{alignItems:'center'}}><Text color='white' style={{fontFamily: 'Roboto_700Bold', fontSize:14, textTransform:'uppercase'}}>Next</Text></Button>) : (<></>)}
                </Block>
            
        </Block>
    )}

}

const style = StyleSheet.create({
    main: {
        backgroundColor: '#F4F4F7'
    }
})

export default ListAddress;