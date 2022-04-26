import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import {Button, Block, Text, Card, HomeList} from '../components';
import {theme} from '../constants';
import endpoint from '../api/endpoint';
import { CommonActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

const CatelogList = ({navigation}) => {

    const url = 'https://www.softwebsystems.com/UTsarees-api/uploads/';
    

    const  [loading,setLoading ]= React.useState(false);
    const  [catelogListSec,setCatelogList ]= React.useState([]);

    const getCatelogList = async () => {
        setLoading(true);
        await endpoint.get(`/listcatalog`).then(response => {
            setLoading(false);
            setCatelogList(response.data);
        });
    }

    const passCart = async () => {
        //navigation.navigate('CatelogList', { screen: 'CheckOut', initial: false})
        navigation.dispatch(CommonActions.navigate({name: 'CheckOut'}));
    }

    const passListProduct = async (catelogId, catelogName) => {
       navigation.dispatch(CommonActions.navigate({name: 'ProductList', params: {id: catelogId, name: catelogName}}));
    }

    React.useEffect(()=>{
        getCatelogList();
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
            <Block style={{paddingLeft: theme.sizes.padding}}>
                <Text style={{fontFamily: 'Roboto_400Regular', fontSize:20}}>Catalog</Text>
            </Block>
            <TouchableOpacity onPress={()=>passCart()} style={{alignItems: 'flex-end', paddingRight: theme.sizes.padding}}>
                <Image style={{width:22, height:27}} source={require('../assets/images/addtocart.png')} resizeMode="contain" />
            </TouchableOpacity>
        </Block>
        <SafeAreaView>
{
    loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (

        <FlatList
        data={catelogListSec}
        padding={theme.sizes.padding*1.3}
        keyExtractor={(item, index)=> `${item.catalog_ID}`}
        renderItem={({item}) => (
            <TouchableOpacity onPress={()=> passListProduct(item.catalog_ID, item.catalog_name)}>
            <Block row center style={{backgroundColor: '#fff', marginBottom:15, borderRadius: 30, padding:5}}>
                <Image style={{width:48, height:48, borderRadius: 50,}} source={{uri: url+item.catalog_icon}} />
                <Text style={{fontFamily: 'Roboto_700Bold', fontSize:14, marginLeft: 15, flex:0.9}}>{item.catalog_name}</Text>
                <Image source={require('../assets/images/right-arrow-pink-sm.png')} style={{width:12, height:10}} resizeMode="contain" />
            </Block>
            </TouchableOpacity>
        

        )} /> 
)
}
        </SafeAreaView>

        
    </Block>
)}
}

const style = StyleSheet.create({
    main: {
        backgroundColor: '#F4F4F7'
    }
})

export default CatelogList;