import React, { Fragment } from 'react';
import { useFonts, Roboto_300Light } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import {Button, Block, Text, Card, ErrorMessage} from '../components';
import { TextInputMask } from 'react-native-masked-text';
import {AuthContext} from '../context/context';
import {theme} from '../constants';

import { Formik } from 'formik';
import * as Yup from 'yup';
import endpoint from '../api/endpoint';

const { width, height } = Dimensions.get('window');

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
    phone: Yup.string().required().max(13).matches(phoneRegExp, 'Phone number is not valid').label('Phone'),
    password: Yup.string().required().min(6).max(16).label('Password')
})

const Login = ({navigation}) => {

    
    const [loading,setLoading ]= React.useState(false);

    const {SignIn} = React.useContext(AuthContext);


    

    const LoginHandle = async (values) => {
        setLoading(true);
        debugger;
        if(values.phone == '' && values.password == ''){
            setLoading(false);
            Alert.alert('Error!', 'Please Enter Username and Password', [{ text: "OK"}]);
            return;
        }

        //let phone = username.split(" ").join("");
        let params = {
            'username' : values.phone,
            'password' : values.password
        }
        let config = {
            headers: {'Content-Type': 'application/json'}
        }
        console.log(JSON.stringify(params));
        await endpoint.post(`/login`, JSON.stringify(params), config)
        .then(res => {
            setLoading(false);
            console.log(res);
            if(res.data.status == "Success"){
                SignIn(res.data.access_token, res.data.userid);
            }
        }).catch(error => {
            setLoading(false);
            console.log('info', error.data);
            if(error){
                Alert.alert('Warning!', 'Your Credentials has Incorrect or Your profile Yet to be Active from our Team', [{ text: "OK"}]);
                return;
            }
        })
        
    }

    let [fontsLoaded] = useFonts({
        Roboto_300Light,
      });
      if (!fontsLoaded) {
        return <AppLoading />;
      } else {
    return(
        <Block style={style.main} padding={theme.sizes.padding}>
            <Image style={style.container} source={require('../assets/images/welcome-bg.png')} resizeMode="contain" />
            <ScrollView>
            {loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (
                <Fragment>
                <Block center flex={false}>
                    <Image style={{height: height/5, marginBottom: 30}} source={require('../assets/images/logo.png')} resizeMode="contain" />
                </Block>
                <Block center flex={false} style={{marginBottom: 30}}>
                    <Text color="secondary" style={{fontFamily: 'Roboto_300Light', fontSize: 35, textTransform: 'uppercase'}}>Welcome Back!</Text>
                    <Text style={{fontFamily: 'Roboto_300Light', textAlign: 'center', fontSize:14}}>You have received login credentials</Text>
                </Block>
                {/* (values) => LoginHandle(values) */}
                <Formik
                initialValues={{phone: '', password: ''}}
                onSubmit={values => LoginHandle(values)}
                validationSchema={validationSchema}
                >

                    {({ handleChange, handleSubmit, errors, touched, handleBlur, values}) =>(
                        <>
                    <Text style={{color: '#9A9EB2', marginBottom: 5}}>USER ID</Text>
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
                
                
                
                <Text style={{color: '#9A9EB2', marginBottom: 5}}>PASSWORD</Text>
                <TextInput 
                style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                onChangeText={handleChange('password')} 
                onBlur={handleBlur('password')}
                secureTextEntry={true}
                value={values.password}
                />
                <ErrorMessage error={errors.password} visible={touched.password} />
                {/* {touched.password && <Text style={{color:'red', fontSize:12, marginBottom:10, marginTop:-10}}>{errors.password}</Text>} */}
                
                
                
                <Button onPress={handleSubmit} color="primary" style={{marginBottom: 30}}><Text bold white center>ENTER</Text></Button>
                        </>
                    )}
                    
                </Formik>
                <TouchableOpacity onPress={()=> navigation.navigate('ForgotPassword')} style={{alignItems: 'center', marginBottom:20}}><Text color="secondary">FORGOT PASSWORD <Image style={{width: 9, height: 6}} source={require('../assets/images/right-arrow-pink-sm.png')} resizeMode="contain" /></Text></TouchableOpacity>
                <TouchableOpacity onPress={()=> navigation.navigate('Register')} style={{alignItems: 'center'}}><Text color="secondary">CREATE NEW ACCOUNT <Image style={{width: 9, height: 6}} source={require('../assets/images/right-arrow-pink-sm.png')} resizeMode="contain" /></Text></TouchableOpacity>
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


export default Login;