import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import RadioGroup from 'react-native-custom-radio-group';
import {Button, Block, Text, Card, HomeList, ErrorMessage} from '../components';
import {theme} from '../constants';
import { CommonActions } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import endpoint from '../api/endpoint';

const { width, height } = Dimensions.get('screen');

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
    name: Yup.string().required().min(4).label('Name'),
    phone: Yup.string().required().max(13).matches(phoneRegExp, 'Phone number is not valid').label('Phone'),
    address: Yup.string().required().label('Address'),
    locality: Yup.string().required().label('Locality'),
    city: Yup.string().required().label('City'),
    state: Yup.string().required().label('State'),
    pincode: Yup.string().required().max(7).label('Pincode'),
    country: Yup.string().required().label('Country'),
    addtype: Yup.string().required().label('Address Type')
})

const AddAddress = ({navigation,route}) => {

    const userId = route.params.id;

    const  [loading,setLoading ]= React.useState(false);

    // const [value, onChangeText] = React.useState(null);
    // const [phone, onChangePhone] = React.useState(null);
    // const [address, onChangeAddress] = React.useState(null);
    // const [locality, onChangeLocality] = React.useState(null);
    // const [city, onChangeCity] = React.useState(null);
    // const [state, onChangeState] = React.useState(null);
    // const [pincode, onChangePincode] = React.useState(null);
    // const [country, onChangeCountry] = React.useState(null);
    // const [addtype, onChangeAddtype] = React.useState(null);

    
    //const [validInput, setValidInput] = React.useState(true);

   
    //   const validateInput = (val) => {
    //     if(val.trim().length > 4){
    //         setValidInput(false);
    //     }else{
    //         setValidInput(true);
    //     }
    //   }

      const addAddress = async (values) => {
        setLoading(true);
        //let mob = phone.split(" ").join("");
        let params = {            
            "user_ID" : userId,
            "name" : values.name,
            "mobile" : values.phone,
            "pincode" : values.pincode,
            "locality" : values.locality,
            "address" : values.address,
            "city" : values.city,
            "state" : values.state,
            "country" : values.country,
            "add_type" : values.addtype
        }

        console.log(params);

        let config = {
            headers: {'Content-Type': 'application/json'}
        }
        await endpoint.post(`/createaddress`, JSON.stringify(params), config).then(res => {
            setLoading(false);
            //console.log(res.data);
            if(res.data){
                navigation.dispatch(CommonActions.navigate({name: 'ListAddress', params: {id: userId}}));
            }
        });
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
            <Block flex={false} row style={{height: height/7, paddingTop:20, alignItems: 'center', backgroundColor: '#fff'}}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{alignItems: 'flex-end', paddingLeft: theme.sizes.padding}}>
                    <Image style={{width:18, height:13}} source={require('../assets/images/left-arrow-pink.png')} resizeMode="contain" />
                </TouchableOpacity>
                <Block style={{paddingLeft: theme.sizes.padding}}>
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:20}}>Checkout</Text>
                </Block>
            </Block>
            <Block row middle center flex={false} style={{backgroundColor:'#fff', height: height/12, paddingBottom:20}}>
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

            <ScrollView>
                {
                    loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (
                    <Block style={{backgroundColor:'#fff',padding: theme.sizes.padding, borderColor:'#E4E4E4', borderTopWidth:1}}>
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase', paddingBottom:20}}>ADD Delivery Address</Text>
                    <Block style={{marginBottom:20}}>

                    <Formik
                    initialValues={{
                        name:'',
                        phone:'',
                        address:'',
                        locality:'',
                        city:'',
                        state:'',
                        pincode:'',
                        country:'',
                        addtype:''
                    }}
                    onSubmit={(values) => addAddress(values)}
                    validationSchema={validationSchema}
                    >
                        {({handleChange, handleSubmit, errors, touched, handleBlur, values}) => (
                            <>
                                <Text style={{color: '#9A9EB2', marginBottom: 5}}>FULL NAME</Text>
                            <TextInput 
                            style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                            onChangeText={handleChange('name')} 
                            onBlur={handleBlur('name')}
                            value={values.name} 
                            />
                            <ErrorMessage error={errors.name} visible={touched.name} />
                            <Text style={{color: '#9A9EB2', marginBottom: 5}}>PHONE - WHATSAPP</Text>
                            <TextInput 
                            style={{height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}}
                            placeholder="9999999999"
                            type={'cel-phone'}
                            onChangeText={handleChange('phone')}
                            onBlur={handleBlur('phone')}
                            value={values.phone} 
                            />
                            <ErrorMessage error={errors.phone} visible={touched.phone} />
                            <Text style={{color: '#9A9EB2', marginBottom: 5}}>ADDRESS</Text>
                            <TextInput 
                            style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                            onChangeText={handleChange('address')} 
                            onBlur={handleBlur('address')}
                            value={values.address} 
                            />
                            <ErrorMessage error={errors.address} visible={touched.address} />
                            <Text style={{color: '#9A9EB2', marginBottom: 5}}>LOCALITY</Text>
                            <TextInput 
                            style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                            onChangeText={handleChange('locality')} 
                            onBlur={handleBlur('locality')}
                            value={values.locality} 
                            />
                            <ErrorMessage error={errors.locality} visible={touched.locality} />
                            <Text style={{color: '#9A9EB2', marginBottom: 5}}>CITY</Text>
                            <TextInput 
                            style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                            onChangeText={handleChange('city')} 
                            onBlur={handleBlur('city')}
                            value={values.city} 
                            />
                            <ErrorMessage error={errors.city} visible={touched.city} />
                            <Text style={{color: '#9A9EB2', marginBottom: 5}}>STATE</Text>
                            <TextInput 
                            style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                            onChangeText={handleChange('state')} 
                            onBlur={handleBlur('state')}
                            value={values.state} 
                            />
                            <ErrorMessage error={errors.state} visible={touched.state} />
                            <Text style={{color: '#9A9EB2', marginBottom: 5}}>PINCODE</Text>
                            <TextInput 
                            keyboardType='numeric' 
                            style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                            onChangeText={handleChange('pincode')} 
                            onBlur={handleBlur('pincode')}
                            value={values.pincode} 
                            />
                            <ErrorMessage error={errors.pincode} visible={touched.pincode} />
                            <Text style={{color: '#9A9EB2', marginBottom: 5}}>COUNTRY</Text>
                            <TextInput 
                            style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                            onChangeText={handleChange('country')} 
                            onBlur={handleBlur('country')}
                            value={values.country} 
                            />
                            <ErrorMessage error={errors.country} visible={touched.country} />
                            <Text style={{color: '#9A9EB2', marginBottom: 5}}>ADDRESS TYPE (Ex: Home or Work)</Text>
                            <TextInput 
                            style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                            onChangeText={handleChange('addtype')} 
                            onBlur={handleBlur('addtype')}
                            value={values.addtype} 
                            />
                            <ErrorMessage error={errors.addtype} visible={touched.addtype} />
                            {/* <Text style={{color: '#9A9EB2', marginBottom: 5}}>LAND MARK</Text>
                            <TextInput 
                            style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                            onChangeText={handleChange('addtype')} 
                            onBlur={handleBlur('addtype')}
                            value={values.addtype} 
                            /> */}

                            <Button color='primary' onPress={handleSubmit} style={{alignItems:'center'}}><Text color='white' style={{fontFamily: 'Roboto_700Bold', fontSize:14, textTransform:'uppercase'}}>Add Address</Text></Button>
                            </>
                        )}

                    </Formik>


                            
                            
                        </Block>
                        {/* <Card style={{backgroundColor:'f9f9fb', borderColor:'#EAEAEA', borderWidth:1}}>
                            <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase', paddingBottom:15}}>From Address</Text>
                            <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14, textTransform:'uppercase'}}>CHITRA KAILASH</Text>
                            <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>Flat No. 5, Victoria Garden, 106, J.N. Salai, Koyambedu, Chennai - 600107</Text>
                            <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>PHONE: 900 900 9000</Text>
                            <Text color='secondary' style={{fontFamily: 'Roboto_400Regular', fontSize:14}}>Near by Reliance trends</Text>
                        </Card> */}
                        
                </Block>
                )}
                
            </ScrollView>


            
        </Block>
    )}

}

const style = StyleSheet.create({
    main: {
        backgroundColor: '#fff'
    }
})

AddAddress.defaultProps = {
    Gender : [
    {
        id: 0,
        label: 'Male',
        value: 'male'
    },
    {
        id: 1,
        label: 'Female',
        value: 'female'
    },
    {
        id: 2,
        label: 'Transgender',
        value: 'transgender'
    }

    ]
  }

export default AddAddress;