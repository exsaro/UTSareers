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
    ToastAndroid } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Button, Block, Text, Card} from '../components';
import {theme} from '../constants';
import endpoint from '../api/endpoint';
import { CommonActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Otp = ({navigation, route}) => {

    const [otp, onChangeOtp] = React.useState(null);
    const [loading,setLoading ]= React.useState(false);
    
    const userId = route.params.id;
    const motp = route.params.motp;
    const mobile = route.params.mobile;

    const sendOtp = async () => {
        //setLoading(true);
        let params = {
            'mobile' : mobile,
            'otp' : otp,
        }
        
        let config = {
            headers: {'Content-Type': 'application/json'}
        }
        console.log(params)
        await endpoint.post(`/verify`, JSON.stringify(params), config).then(res => {
            setLoading(false);
            console.log(res.data);
            if(res.data.verify_info.Code == "200"){
                setLoading(false);
                navigation.dispatch(CommonActions.navigate({name: 'Notify'}));
            }else if(res.data.verify_info.Code == "201"){
                ToastAndroid.show(`OTP Invalid`, ToastAndroid.LONG);
            }

        })
    };


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
                            <Block>
                                <Text style={{fontFamily: 'Roboto_700Bold', fontSize: 18, textAlign: 'center', color:'#1A1C29', textTransform: 'uppercase', marginBottom: 25, marginTop: 30}}>Verify Otp </Text>
                                <TextInput style={{ height: 48, borderColor: '#D6E1F2', textAlign: 'center', borderWidth: 1, marginBottom: 20, paddingRight:15, paddingLeft:15}} onChangeText={text => onChangeOtp(text)} />
                                <Button color="primary" onPress={() => sendOtp()}><Text bold white center>VERIFY FOR REVIEW</Text></Button>
                            </Block>
                    </Fragment>
                )
            
                }
            
        </Block>
    )
    }
}


const style = StyleSheet.create({
    
    main: {
        backgroundColor: '#fff'
    }
  })


export default Otp;