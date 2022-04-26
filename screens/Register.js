import React, { useState, useEffect, Fragment } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import RadioGroup from 'react-native-custom-radio-group';
import {Button, Block, Text, Card, ErrorMessage} from '../components';
import {theme} from '../constants';
import { Formik } from 'formik';
import * as Yup from 'yup';
import endpoint from '../api/endpoint';
import { CommonActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
    name: Yup.string().required().min(4).label('Name'),
    occupation: Yup.string().required().label('Occupation'),
    gender: Yup.string().required().label('Gender'),
    phone: Yup.string().required().max(13).matches(phoneRegExp, 'Phone number is not valid').label('Phone'),
    email: Yup.string().required().email().label('Email'),
    address: Yup.string().required().label('Address'),
    city: Yup.string().required().label('City'),
    state: Yup.string().required().label('State'),
    pincode: Yup.string().required().label('Pincode'),
    country: Yup.string().required().label('Country')
})

const Register = ({navigation, Gender}) => {
    
    const [loading,setLoading ]= React.useState(false);

    
    const register = async (values) => {
        setLoading(true);
        //let mob = phone.split(" ").join("");
        let params = {
            'fname' : values.name,
            'occupation' : values.occupation,
            'gender' : values.gender,
            'mobile' : values.phone,
            'email' : values.email,
            'address' : values.address,
            'city' : values.city,
            'state' : values.state,
            'pincode' : values.pincode,
            'country' : values.country
        }
        
        let config = {
            headers: {'Content-Type': 'application/json'}
        }
        console.log(JSON.stringify(params))
        await endpoint.post(`/signup`, JSON.stringify(params), config).then(res => {
            console.log(res.data);
            if(res.data.Status == "Success"){
                setLoading(false);
                navigation.dispatch(CommonActions.navigate({name: 'Notify', params: {id: res.data.User_info.user_ID, motp:res.data.User_info.motp, mobile:res.data.User_info.mobile}}));
            }
            
        }).catch(error => {
            setLoading(false);
            console.log('info', error.data);
            if(error){
                Alert.alert('Error!', 'Something went wrong Please try again Later.', [{ text: "OK"}]);
                return;
            }
        })
    }
    

    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
      });
      if (!fontsLoaded) {
        return <AppLoading />;
      } else {
    return(
        <Block style={style.main} padding={theme.sizes.padding}>
            {
                loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (
                    <Fragment>
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginBottom:20, marginTop: 20}} onPress={()=> navigation.goBack()}>
                        <Image style={{width: 19, height: 13}} source={require('../assets/images/left-arrow-pink.png')} resizeMode="contain" /> 
                        <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 20, paddingLeft: 15}}>Create Account</Text>
                    </TouchableOpacity>
                    <ScrollView>
                        <Block>

                            <Formik
                            initialValues={{
                                name:'', 
                                occupation:'',
                                gender:'',
                                phone:'',
                                email:'',
                                address:'',
                                city:'',
                                state:'',
                                pincode:'',
                                country:''}}
                            onSubmit={(values) => register(values)}
                            validationSchema={validationSchema}
                            >
                                {({handleChange, handleSubmit, errors, touched, handleBlur, values}) => (
                                    <>
                                        <Text color="secondary" style={{fontFamily: 'Roboto_700Bold', fontSize: 18, textTransform: 'uppercase', marginBottom: 25, marginTop: 30}}>Personal </Text>
                                <Text style={{color: '#9A9EB2', marginBottom: 5}}>FULL NAME</Text>
                                <TextInput 
                                style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                                onChangeText={handleChange('name')} 
                                onBlur={handleBlur('name')}
                                value={values.name}
                                />
                                <ErrorMessage error={errors.name} visible={touched.name} />
                                <Text style={{color: '#9A9EB2', marginBottom: 5}}>OCCUPATION</Text>
                                <TextInput 
                                style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                                onChangeText={handleChange('occupation')} 
                                onBlur={handleBlur('occupation')}
                                value={values.occupation}
                                />
                                <ErrorMessage error={errors.occupation} visible={touched.occupation} />
                                {/* <Text style={{color: '#9A9EB2', marginBottom: 5}}>DATE OF BIRTH</Text>
                                <TextInputMask 
                                style={{height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}}
                                placeholder="YYYY/MM/DD"
                                type={'datetime'}
                                options={{
                                    format: 'YYYY/MM/DD',
                                }}
                                value={dt}
                                onChangeText={handleChange('dob')}
                                /> */}
                                <Text style={{color: '#9A9EB2', marginBottom: 5}}>GENDER</Text>
                                <RadioGroup 
                                radioGroupList={Gender}
                                buttonContainerActiveStyle = {{backgroundColor: '#fff', flex:1, marginRight:3,marginLeft:3, borderColor: '#2B2F52', borderWidth: 1, height: 50,fontFamily: 'Roboto_400Regular', fontSize: 14, fontWeight: 'normal'}}
                                buttonContainerInactiveStyle = {{backgroundColor: '#fff', flex:1,marginRight:3,marginLeft:3, borderColor: '#D9DBDE', borderWidth: 1, height: 50,fontFamily: 'Roboto_400Regular', fontSize: 14}}
                                buttonTextActiveStyle = {{color: '#2B2F52'}}
                                buttonTextInactiveStyle = {{color: '#9A9EB2'}}
                                onChange={handleChange('gender')}
                                onBlur={handleBlur('gender')}
                                value={values.gender}
                                />
                                <ErrorMessage error={errors.gender} visible={touched.gender} />
                                <Text color="secondary" style={{fontFamily: 'Roboto_700Bold', fontSize: 18, textTransform: 'uppercase', marginBottom: 25, marginTop: 30}}>Contact</Text>
                                <Text style={{color: '#9A9EB2', marginBottom: 5}}>PHONE - WHATSAPP</Text>
                                <TextInput 
                                style={{height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}}
                                placeholder="9999999999"
                                onBlur={handleBlur('phone')}
                                onChangeText={handleChange('phone')}
                                value={values.phone}
                                />
                                <ErrorMessage error={errors.phone} visible={touched.phone} />
                                <Text style={{color: '#9A9EB2', marginBottom: 5}}>EMAIL</Text>
                                <TextInput 
                                keyboardType='email-address' 
                                style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                                onChangeText={handleChange('email')} 
                                onBlur={handleBlur('email')} value={values.email} />
                                <ErrorMessage error={errors.email} visible={touched.email} />
                                <Text color="secondary" style={{fontFamily: 'Roboto_700Bold', fontSize: 18, textTransform: 'uppercase', marginBottom: 25, marginTop: 30}}>Location</Text>
                                <Text style={{color: '#9A9EB2', marginBottom: 5}}>ADDRESS</Text>
                                <TextInput 
                                style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                                onChangeText={handleChange('address')} 
                                onBlur={handleBlur('address')}
                                value={values.address}
                                />
                                <ErrorMessage error={errors.address} visible={touched.address} />
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
                                <Button color="primary" onPress={handleSubmit}><Text bold white center>REGISTER</Text></Button>
                                    </>
                                        
                                )} 
                                </Formik>

                            
                            
                        </Block>
                    </ScrollView>
                    
                    </Fragment>
                )
            }
            
            
        </Block>
    )
    }
}

Register.defaultProps = {
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

const style = StyleSheet.create({
    
    main: {
        backgroundColor: '#fff'
    }
  })


export default Register;