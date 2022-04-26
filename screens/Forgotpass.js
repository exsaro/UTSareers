import React, { Fragment } from 'react';
import { useFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import {Button, Block, Text, Card, ErrorMessage} from '../components';
import { TextInputMask } from 'react-native-masked-text';
import {AuthContext} from '../context/context';
import {theme} from '../constants';
import { CommonActions } from '@react-navigation/native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import endpoint from '../api/endpoint';

const { width, height } = Dimensions.get('window');

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
    phone: Yup.string().required().max(13).matches(phoneRegExp, 'Phone number is not valid').label('Phone')
})

const ForgotPassword = ({navigation}) => {

    
    const [loading,setLoading ]= React.useState(false);

    //const {SignOut} = React.useContext(AuthContext);


    

    const LoginHandle = async (values) => {
        setLoading(true);
        
        let params = {
            'mobile' : values.phone
        }
        let config = {
            headers: {'Content-Type': 'application/json'}
        }
        console.log(JSON.stringify(params));
        await endpoint.post(`/forgot`, JSON.stringify(params), config)
        .then(res => {
            //console.log(res.data);
            setLoading(false);
            if(res.data.status == "Success"){
                navigation.dispatch(CommonActions.navigate({name: 'ResetPassword', params: {phone: values.phone}}));
            }else{
                Alert.alert(`${res.data.status}!`, res.data.message, [{ text: "OK"}]);
                return;
            }
        }).catch(error => {
            setLoading(false);
            console.log('info', error.data);
            if(error){
                Alert.alert('Error!', 'Something went wrong please try again later', [{ text: "OK"}]);
                return;
            }
        })
        
    }

    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
      });
      if (!fontsLoaded) {
        return <AppLoading />;
      } else {
    return(
        <Block style={style.main} padding={theme.sizes.padding}>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginBottom:20, marginTop: 20}} onPress={()=> navigation.goBack()}>
                <Image style={{width: 19, height: 13}} source={require('../assets/images/left-arrow-pink.png')} resizeMode="contain" /> 
                <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 20, paddingLeft: 15}}>Forgot Password</Text>
            </TouchableOpacity>
            <ScrollView>
            {loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (
                <Fragment>
                <Block center flex={false}>
                    <Image style={{height: height/5, marginBottom: 30}} source={require('../assets/images/logo.png')} resizeMode="contain" />
                </Block>
                {/* <Block center flex={false} style={{marginBottom: 30}}>
                    <Text color="secondary" style={{fontFamily: 'Roboto_300Light', fontSize: 35, textTransform: 'uppercase'}}>Welcome Back!</Text>
                    <Text style={{fontFamily: 'Roboto_300Light', textAlign: 'center', fontSize:14}}>You have received login credentials</Text>
                </Block> */}
                {/* (values) => LoginHandle(values) */}
                <Formik
                initialValues={{phone: ''}}
                onSubmit={values => LoginHandle(values)}
                validationSchema={validationSchema}
                >

                    {({ handleChange, handleSubmit, errors, touched, handleBlur, values}) =>(
                        <>
                    <Text style={{color: '#9A9EB2', fontFamily: 'Roboto_400Regular', marginBottom: 5}}>MOBILE NO</Text>
                <TextInput 
                style={{height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}}
                placeholder="9999999999"
                type={'cel-phone'}
                onBlur={handleBlur('phone')}
                onChangeText={handleChange('phone')}
                value={values.phone}
                />
                <ErrorMessage error={errors.phone} visible={touched.phone} />
                {/* {touched.phone && <Text style={{color:'red', fontSize:12, marginBottom:10, marginTop:-10}}>{errors.phone}</Text>} */}
                
                <Button onPress={handleSubmit} color="primary" style={{marginBottom: 30}}><Text bold white center>ENTER</Text></Button>
                        </>
                    )}
                    
                </Formik>
                
                </Fragment>
                )}
            </ScrollView>
        </Block>
    )
    }
}


const style = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: -20,
        bottom:0,
        width: width,
        height: height/2,
        backgroundColor: '#fff'
    },
    main: {
        backgroundColor: '#fff',
        textAlign: 'center'
    }
  })


export default ForgotPassword;