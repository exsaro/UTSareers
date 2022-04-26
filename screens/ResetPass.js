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



const validationSchema = Yup.object().shape({
    password: Yup.string().required().min(6).max(16).label('Password'),
    confirmpassword: Yup.string().required().label('Confirm Password').test('passwords-match', 'Passwords must match', function(value) {
        return this.parent.password === value;
    })
})

const ResetPassword = ({navigation, route}) => {

    const phone = route.params.phone;
    
    const [loading,setLoading ]= React.useState(false);

    //const {SignOut} = React.useContext(AuthContext);


    

    const ResetPassHandle = async (values) => {
        setLoading(true);
        
        let params = {
            'mobile' : phone,
            'password': values.password
        }
        let config = {
            headers: {'Content-Type': 'application/json'}
        }
        console.log(JSON.stringify(params));
        await endpoint.post(`/changepassword`, JSON.stringify(params), config)
        .then(res => {
            //console.log(res.data);
            setLoading(false);
            if(res.data.Status == "Success"){
                Alert.alert('Success!', 'Your Password has changed Successfully', [{ 
                    text: "OK", onPress: () => {
                        navigation.dispatch(CommonActions.navigate({name: 'Login'}));
                    }
                }]);
                
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
                <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 20, paddingLeft: 15}}>Reset Password</Text>
            </TouchableOpacity>
            <ScrollView>
            {loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (
                <Fragment>
                <Block center flex={false}>
                    <Image style={{height: height/5, marginBottom: 30}} source={require('../assets/images/logo.png')} resizeMode="contain" />
                </Block>
                {/* <Block center flex={false} style={{marginBottom: 30}}>
                    <Text color="secondary" style={{fontFamily: 'Roboto_300Light', fontSize: 35, textTransform: 'uppercase'}}>Reset Password</Text>
                    <Text style={{fontFamily: 'Roboto_300Light', textAlign: 'center', fontSize:14}}>You have received login credentials</Text>
                </Block> */}
                {/* (values) => LoginHandle(values) */}
                <Formik
                initialValues={{password: '', confirmpassword:''}}
                onSubmit={values => ResetPassHandle(values)}
                validationSchema={validationSchema}
                >

                    {({ handleChange, handleSubmit, errors, touched, handleBlur, values}) =>(
                        <>
                        <Text style={{color: '#9A9EB2', marginBottom: 5, fontFamily: 'Roboto_400Regular'}}>PASSWORD</Text>
                        <TextInput 
                        style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                        onChangeText={handleChange('password')} 
                        onBlur={handleBlur('password')}
                        secureTextEntry={true}
                        value={values.password}
                        />
                        <ErrorMessage error={errors.password} visible={touched.password} />

                        <Text style={{color: '#9A9EB2', marginBottom: 5, fontFamily: 'Roboto_400Regular'}}>CONFIRM PASSWORD</Text>
                        <TextInput 
                        style={{ height: 48, borderColor: '#D6E1F2', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} 
                        onChangeText={handleChange('confirmpassword')} 
                        onBlur={handleBlur('confirmpassword')}
                        secureTextEntry={true}
                        value={values.confirmpassword}
                        />
                        <ErrorMessage error={errors.confirmpassword} visible={touched.confirmpassword} />
                
                
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


export default ResetPassword;