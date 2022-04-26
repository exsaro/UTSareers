import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { 
    StyleSheet, 
    TouchableOpacity, 
    Image, 
    Dimensions, 
    TextInput, 
    ScrollView, 
    ActivityIndicator, 
    FlatList, 
    SafeAreaView,
    Alert
    } from 'react-native';
import {Button, Block, Text, Card, HomeList} from '../components';
import {theme} from '../constants';
import endpoint from '../api/endpoint';
import { CommonActions } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

// import Share from "react-native-share";

import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('screen');

const ProductList = ({navigation, route}) => {

    const url = 'https://www.softwebsystems.com/UTsarees-api/uploads/';
    const catelogId = route.params.id;
    const catelogName = route.params.name;

    const  [loading,setLoading ]= React.useState(false);
    const  [userId,setUserId ]= React.useState(null);
    const  [showFilter,setShowFilter ]= React.useState(false);
    const  [productList,setProductList ]= React.useState([]);
    const  [categoryList,setCategoryList ]= React.useState([]);
    const  [categoryIds,setCategoryIds ]= React.useState([0]);
    const  [toggleCat,setToggleCat ]= React.useState(false);

    

    const setCatIds = (catId) => {
        let hasCatId = categoryIds.some(n => {
            console.log(n);
            return catId == n
        });
        if(!hasCatId){
            setCategoryIds(categoryIds.push(Number(catId)));
        }
        setCategoryIds(categoryIds.filter(n => n != 0));
    }

    const restFilter = () => {
        let resetArr = [0];
        setCategoryIds(resetArr);
        getProductList();
    }


    const getCategoryList = async () => {
        setLoading(true);
        await endpoint.get(`/listcategory/${catelogId}`).then(response => {
            setLoading(false);
            setCategoryList(response.data);
        });
    }

    const getProductList = async () => {
        setLoading(true);
        let params = {            
            "catalog_id" : catelogId,
            "category_id" : categoryIds,
            "price_min" : null,
            "price_max" :null,
            "size" : []
        }
        
        let config = {
            headers: {'Content-Type': 'application/json'}
        }
        await endpoint.post(`/listproducts`, JSON.stringify(params), config).then(res => {
            setLoading(false);
            setShowFilter(false);
            setProductList(res.data);
        });
    }



    const sendSharedList = async (prodId) => {
        setLoading(true);
        let params = {            
            "product_ID" : prodId,
            "user_ID" : userId
        }
        
        let config = {
            headers: {'Content-Type': 'application/json'}
        }
        await endpoint.post(`/createshared`, JSON.stringify(params), config).then(res => {
            setLoading(false);
        });
    }

    const passProductDetail = async (prodId, prodName) => {
        navigation.dispatch(CommonActions.navigate({name: 'ProductDetail', params: {id: prodId, name: prodName}}));
    }


    // const getMinPrice = (array) => {
    //     array.reduce((min, p) => p.price < min.price ? p.price : min.price, array[0]);
    // }

    const ShareWatsapp = async (imgPath, prodId, prodName) => {
        setLoading(true);
        const shareOptions = {
            mimeType: 'image/jpeg',
            dialogTitle : prodName,
            UTI: 'image/jpeg'
        };
        const downloadResumable = FileSystem.createDownloadResumable(
            `https://www.softwebsystems.com/UTsarees-api/uploads/${imgPath}`,
            `${FileSystem.documentDirectory}/${imgPath}`,
            {},
        );
      
        const { uri, status } = await downloadResumable.downloadAsync();
        
        await Sharing.shareAsync(uri, shareOptions).then(res => {
            setLoading(false);
            sendSharedList(prodId);
            //console.log(res);
        }).catch(err => {
            setLoading(false);
            Alert.alert('Error!', 'Something went Wrong', [{ text: "OK"}]);
        });
    }


    const showfltr = () => {
        setShowFilter(!showFilter);
        getCategoryList();   
    }

    const passCart = async () => {
        //navigation.navigate('CatelogList', { screen: 'CheckOut', initial: false})
        navigation.dispatch(CommonActions.navigate({name: 'CheckOut'}));
    }


    React.useEffect(()=>{
        setTimeout(async () => {
            let userId;
            userId = null;
            try {
              userId = await AsyncStorage.getItem('userId')
            } catch (e) {
              console.log(e);
            }
            setUserId(userId);
          }, 1000);

        getProductList();
        
        navigation.addListener('focus', () => {
            getProductList();  
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
                <Text style={{fontFamily: 'Roboto_400Regular', fontSize:20}}>{catelogName}</Text>
                </Block>
                <TouchableOpacity onPress={() => passCart()} style={{alignItems: 'flex-end', paddingRight: theme.sizes.padding}}>
                    <Image style={{width:22, height:27}} source={require('../assets/images/addtocart.png')} resizeMode="contain" />
                </TouchableOpacity>
            </Block>
            <Block row flex={false} style={{backgroundColor:'#fff', borderColor: '#E4E4E4', borderTopWidth:1, height: height/12, position:'relative', zIndex: 9,}}>
                <TouchableOpacity style={{width: width/2, justifyContent: 'center', alignItems: 'center'}}>
                    <Block center row flex={false}>
                        <Image style={{width:14, height:8}} source={require('../assets/images/sort.png')} resizeMode="contain" />
                        <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform: 'uppercase', paddingLeft:5}}>Sort</Text>
                    </Block>
                    <Text color="gray" style={{fontFamily: 'Roboto_400Regular', fontSize:12}}>New Arrivals</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showfltr()} style={{width: width/2, borderColor:'#E4E4E4',borderLeftWidth:1,justifyContent: 'center', alignItems: 'center'}}>
                <Block center row flex={false}>
                        <Image style={{width:13, height:10}} source={require('../assets/images/filter.png')} resizeMode="contain" />
                        <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform: 'uppercase', paddingLeft:5}}>Filters</Text>
                    </Block>
                    <Text color="gray" style={{fontFamily: 'Roboto_400Regular', fontSize:12}}>Select Category</Text>
                    
                </TouchableOpacity>
                
                
            </Block>
            
            <SafeAreaView style={{flex: 1}}>
            {
    loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (
                <Block padding={theme.sizes.padding}>
                <FlatList
                data={productList}
                keyExtractor={(item, index)=> `${item.product_ID}`}
                renderItem={({item}) => (
                    
                    <Card>

                        {
                            item.assets.length > 0 ? (
                                    item.assets.length > 3 ? (
                                            <Block row flex={false} style={{height:height/5, overflow:'hidden', justifyContent: 'space-between', marginBottom:20}}>
                                                <Block flex={0.58}>
                                                    <Image style={{width:'100%', height:'100%', borderRadius:5}} source={{uri: url+item.assets[0].asset_path}} resizeMode="cover" />
                                                </Block>
                                                <Block flex={0.39}>
                                                    <Image style={{height:'48%',width:'100%', borderRadius:5}} source={{uri: url+item.assets[1].asset_path}} resizeMode="cover" />
                                                    <Block style={{position:'relative', height:'48%', marginTop:10}}>
                                                        <Image style={{height:'100%',width:'100%', borderRadius:5}} source={{uri: url+item.assets[3].asset_path}} resizeMode="cover" />
                                                        <Block middle center style={{position:'absolute', left:0, top:0, backgroundColor:'#00000080', width:'100%', height:'100%', borderRadius:5}}><Text color='white' style={{fontFamily: 'Roboto_700Bold', fontSize:18}}>+3</Text></Block>
                                                    </Block>
                                                </Block>
                                            </Block>
                                        
                                    ) : item.assets.length == 3 ? (
                                        <Block row flex={false} style={{height:height/5, overflow:'hidden', justifyContent: 'space-between', marginBottom:20}}>
                                            <Block flex={0.58}>
                                                <Image style={{width:'100%', height:'100%', borderRadius:5}} source={{uri: url+item.assets[0].asset_path}} resizeMode="cover" />
                                            </Block>
                                            <Block flex={0.39}>
                                                <Image style={{height:'48%',width:'100%', borderRadius:5}} source={{uri: url+item.assets[1].asset_path}} resizeMode="cover" />
                                                <Block style={{position:'relative', height:'48%', marginTop:10}}>
                                                    <Image style={{height:'100%',width:'100%', borderRadius:5}} source={{uri: url+item.assets[2].asset_path}} resizeMode="cover" />
                                                    {/* <Block middle center style={{position:'absolute', left:0, top:0, backgroundColor:'#00000080', width:'100%', height:'100%', borderRadius:5}}><Text color='white' style={{fontFamily: 'Roboto_700Bold', fontSize:18}}>+3</Text></Block> */}
                                                </Block>
                                            </Block>
                                        </Block>
                                    ) : (item.assets.length < 3 && item.assets.length > 1) ? (
                                        <Block row flex={false} style={{height:height/5, overflow:'hidden', justifyContent: 'space-between', marginBottom:20}}>
                                            <Block flex={0.58}>
                                                <Image style={{width:'100%', height:'100%', borderRadius:5}} source={{uri: url+item.assets[0].asset_path}} resizeMode="cover" />
                                            </Block>
                                            <Block flex={0.39}>
                                                <Image style={{height:'48%',width:'100%', borderRadius:5}} source={{uri: url+item.assets[1].asset_path}} resizeMode="cover" />
                                            </Block>
                                        </Block>
                                    ) : (
                                        <Block row flex={false} style={{height:height/5, overflow:'hidden', justifyContent: 'space-between', marginBottom:20}}>
                                            <Block flex={1}>
                                                <Image style={{width:'100%', height:'100%', borderRadius:5}} source={{uri: url+item.assets[0].asset_path}} resizeMode="cover" />
                                            </Block>
                                        </Block>
                                    )
                                
                            ) : null
                        }

                    <Text style={{fontFamily: 'Roboto_700Bold', fontSize:18}}>{item.product_name}</Text>
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#969696', marginBottom: 10}}>{item.description}</Text>

                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>STARTING AT 
                    <Text color="primary" style={{fontFamily: 'Roboto_700Bold', fontSize:14}}> ₹ {item.options[0].price}</Text>
                    {/* {item.options.length > 1 ? getMinPrice(item.options) : ( */}
                    </Text>
                    
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
                    </Block>     */}
                    <Block row style={{justifyContent:'space-between'}}>
                    <Button onPress={()=> passProductDetail(item.product_ID, item.product_name)} style={{backgroundColor:'#FF0076', display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', flex:1}}>
                        {/* <Image style={{width:23, height:23}} source={require('../assets/images/whatsapp-icn.png')} resizeMode='contain' /> */}
                        <Text color='white' style={{fontFamily: 'Roboto_700Bold', fontSize: 14, textTransform:'uppercase', paddingLeft:10}}>BUY NOW</Text>
                    </Button>
                    {
                        item.assets.length > 0 ? (<Button onPress={() => ShareWatsapp(item.assets[0].asset_path, item.product_ID, item.product_name)} style={{borderColor:'#D9D9D9', borderWidth:1, borderRadius:5, width:'15%', justifyContent:'center', alignItems:'center', marginLeft:10}}>
                        <Image source={require('../assets/images/share.png')} resizeMode='contain' style={{width:17, height:19}} />
                    </Button>) : null
                    }
                    
                    </Block>
                        
                    </Card>
                   
                )}
                />

                    

                </Block>
                )
            }
            </SafeAreaView>


            {
                    showFilter ? (<Block style={{position:'absolute', backgroundColor:'#F4F4F7', width:width, top:height/4, zIndex:9, height:height/1.7}}>
                    {/* <Block row flex={false} style={{height:50, backgroundColor:'#fff'}}>
                    <ScrollView horizontal pagingEnabled>    
                        <Button style={{marginLeft:10, marginRight:10, marginTop:0, borderRadius:0, borderBottomWidth:3, borderBottomColor:'#FF0076'}}><Text style={{fontFamily: 'Roboto_700Bold', fontSize:12, textTransform:'uppercase', color:'#2B2F52'}}>Category</Text></Button>
                        
                        
                    </ScrollView>    
                    </Block> */}
                    <ScrollView>
                
                        {loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (<Block row padding={theme.sizes.padding} style={{flexWrap: 'wrap', justifyContent:'space-between', position:'relative'}}>
                            {
                                categoryList.map((item) => (
                                    <Button
                                    style={categoryIds.some(n => n == item.categories_ID) ? style.catBtnAct : style.catBtn}
                                    onPress={() => setCatIds(item.categories_ID)} 
                                    key={item.categories_ID}>
                                        <Text style={categoryIds.some(n => n == item.categories_ID) ? style.btnTxtAct : style.btnTxt}>{item.categories_name}</Text>
                                    </Button>
                                ))
                            }
                        </Block>)}
                        
                    </ScrollView>
                    <Block row flex={false} style={{height:70,backgroundColor:'#fff', paddingLeft:10,paddingRight:10,justifyContent:'space-between'}}>
                        <Button onPress={() => restFilter()} style={{backgroundColor:'#f4f4f7', display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center',  width:'35%'}}>
                            <Text color='black' style={{fontFamily: 'Roboto_400Regular', fontSize: 14, textTransform:'uppercase', marginRight:10}}>Reset</Text>
                        </Button>
                        <Button onPress={() => getProductList()} style={{backgroundColor:'#FF0076', display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', width:'60%'}}>
                            <Text color='white' style={{fontFamily: 'Roboto_700Bold', fontSize: 14, textTransform:'uppercase', paddingLeft:10}}>Apply Filter</Text>
                        </Button>
                    </Block>
                </Block>) : null
                }

        </Block>
    )}
}




const style = StyleSheet.create({
    main: {
        backgroundColor: '#F4F4F7'
        
    },
    catBtn:{
        backgroundColor: '#fff', 
        justifyContent:'center', 
        width:'48%', 
        height: 50, 
        paddingLeft:10, 
        paddingRight:10
    },
    catBtnAct:{
        backgroundColor: '#fff', 
        justifyContent:'center', 
        width:'48%', 
        height: 50, 
        paddingLeft:10, 
        paddingRight:10,
        borderColor: '#000',
        borderWidth: 1
    },
    btnTxt: {
        fontFamily: 'Roboto_400Regular', 
        fontSize: 16, 
        color:'#9A9EB2', 
        textAlign:'center'
    },
    btnTxtAct: {
        fontFamily: 'Roboto_400Regular', 
        fontSize: 16, 
        color:'#000', 
        textAlign:'center'
    }

})

export default ProductList;