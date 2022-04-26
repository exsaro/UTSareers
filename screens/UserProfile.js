import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView, ActivityIndicator, FlatList, Alert } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import RadioGroup from 'react-native-custom-radio-group';
import {Button, Block, Text, Card, HomeList, ErrorMessage} from '../components';
import {theme} from '../constants';
import endpoint from '../api/endpoint';
import { CommonActions } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormData from 'form-data'

import AsyncStorage from '@react-native-async-storage/async-storage';





const { width, height } = Dimensions.get('screen');

const validationSchema = Yup.object().shape({
  password: Yup.string().required().min(6).max(16).label('Password'),
  confirmpassword: Yup.string().required().label('Confirm Password').test('passwords-match', 'Passwords must match', function(value) {
      return this.parent.password === value;
  })
})

const UserProfile = ({navigation, route}) => {

  // const userId = route.params.id;

  const refRBSheet = useRef();

  const url = 'https://www.softwebsystems.com/UTsarees-api/uploads/profiles/';
  

    
    const  [loading,setLoading ]= React.useState(false);
    const  [sheetLoading,setSheetLoading ]= React.useState(false);
    // const  [userId,setUserId ]= React.useState(null);
    const  [userDetail,setUserDetail ]= React.useState({});

    // const askCameraRoll = async () => {

    //   const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    //   if (permission.status !== 'granted') {
    //     const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //     if (newPermission.status === 'granted') {
    //       const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    //     }
    //   }
      
    // }


    const changeProfileImg = async () => {

      let userId;
      userId = null;
      try {
        userId = await AsyncStorage.getItem('userId')
      } catch (e) {
        console.log(e);
      }

      const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      if (permission.status !== 'granted') {
        const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (newPermission.status === 'granted') {
          //const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
          let pickerResult = await ImagePicker.launchImageLibraryAsync();
      
          let profileData = new FormData();
          profileData.append('profileimg', pickerResult.uri);
          profileData.append('userid', userId);
    
          console.log(profileData);
    
          let config = {
            headers: {
              'accept': 'application/json',
              'Accept-Language': 'en-US,en;q=0.8',
              'Content-Type': 'multipart/form-data'
            }
        }
        await endpoint.post(`/changeprofileimg`, profileData, config).then(res => {
          getUser();
        });

        }else{
          Alert.alert('Error!', 'Please enable camera permission', [{ text: "OK"}]);
        }
      }else if(permission.status == 'granted'){
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
      
          let profileData = new FormData();
          profileData.append('profileimg', pickerResult.uri);
          profileData.append('userid', userId);
    
          console.log(profileData);
    
          let config = {
            headers: {
              'accept': 'application/json',
              'Accept-Language': 'en-US,en;q=0.8',
              'Content-Type': 'multipart/form-data'
            }
        }
        await endpoint.post(`/changeprofileimg`, profileData, config).then(res => {
          getUser();
        });
      }
      
      

    }


    const ResetPassHandle = async (values) => {
      setSheetLoading(true);
      let params = {
          'mobile' : userDetail.mobile,
          'password': values.password
      }
      let config = {
          headers: {'Content-Type': 'application/json'}
      }
      console.log(JSON.stringify(params));
      await endpoint.post(`/changepassword`, JSON.stringify(params), config)
      .then(res => {
          //console.log(res.data);
          setSheetLoading(false);
          if(res.data.Status == "Success"){
              Alert.alert('Success!', 'Your Password has changed Successfully', [{ 
                  text: "OK", onPress: () => {refRBSheet.current.close()}
              }]);
              
          }
      }).catch(error => {
        setSheetLoading(false);
          console.log('info', error.data);
          if(error){
              Alert.alert('Error!', 'Something went wrong please try again later', [{ text: "OK", onPress: () => {refRBSheet.current.close()}}]);
              return;
          }
      })   
  }

    const getUser = async () => {
      setLoading(true);
      let userId;
      userId = null;
      try {
        userId = await AsyncStorage.getItem('userId')
      } catch (e) {
        console.log(e);
      }

      let params = {            
          "userid" : userId
      }
      let config = {
          headers: {'Content-Type': 'application/json'}
      }
      await endpoint.post(`/viewuser`, JSON.stringify(params), config).then(res => {
          setLoading(false);
          console.log(res.data)
          if(res.data.Status == 'Success'){
            setUserDetail(res.data.User_info);
          }
      }).catch(err => {
        setLoading(false);
        console.log('Error', err);
      });
      console.log(userDetail.fname);
  }

  
    
  
    React.useEffect(() => {
      // setTimeout(async () => {
      //   let userId;
      //   userId = null;
      //   try {
      //     userId = await AsyncStorage.getItem('userId')
      //   } catch (e) {
      //     console.log(e);
      //   }
      //   setUserId(userId);
      // }, 1000);
      //askCameraRoll();
      getUser();
      navigation.addListener('focus', () => {
        getUser();
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
        <Block style={style.main} padding={theme.sizes.padding}>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginBottom:20, marginTop: 20}} onPress={()=> navigation.goBack()}>
                <Image style={{width: 19, height: 13}} source={require('../assets/images/left-arrow-pink.png')} resizeMode="contain" /> 
                <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 20, paddingLeft: 15}}>Profile</Text>
            </TouchableOpacity>
            { loading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (<>
            <ScrollView>
            
              <Block>
                <Block center>
                  <Block middle center style={{width:136, height:136, backgroundColor:'#fff', borderRadius:70, position:'relative', marginBottom:20}}>
                    <Image style={{width:'100%', height:'100%', borderRadius:70}} source={{uri: url+userDetail.user_img}} resizeMode="cover" /> 
                    {/* <Block style={{position:'absolute', bottom:8, right:8}}>
                      <TouchableOpacity onPress={() => changeProfileImg()}>
                        <Image style={{width:27, height:27}} source={require('../assets/images/edit-user-icon.png')} resizeMode="contain" />
                      </TouchableOpacity>
                    </Block> */}
                  </Block>
                </Block>
                <Block center style={{marginBottom:20}}>
                  <Text style={{fontFamily: 'Roboto_700Bold', fontSize: 16, color:'#1A1C29', paddingBottom:5}}>{userDetail.fname} {userDetail.lname}</Text>
                  <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 14, color:'#848B9F'}}>{userDetail.occupation}</Text>
                </Block>
                <Block style={{justifyContent: 'flex-start',}}>
                  <Text style={{fontFamily: 'Roboto_700Bold', fontSize: 16, color:'#9A9EB2', paddingBottom:10}}>Contact Details</Text>
                  <Block row style={{alignItems:'center',paddingBottom:10}}>
                    <Image style={{width: 13, height: 14}} source={require('../assets/images/user-email.png')} resizeMode="contain" />
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 14, color:'#000', paddingLeft:5}}>{userDetail.email_id}</Text>
                  </Block>
                  <Block row style={{alignItems:'center',paddingBottom:10}}>
                    <Image style={{width: 13, height: 14}} source={require('../assets/images/user-phone.png')} resizeMode="contain" />
                    <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 14, color:'#000',paddingLeft:5}}>{userDetail.mobile}</Text>
                  </Block>
                </Block>

                {/* <Button onPress={() => refRBSheet.current.open()} style={{alignItems:'center', backgroundColor:'#fff', marginTop:25}}><Text style={{fontFamily: 'Roboto_700Bold', fontSize:14, textTransform:'uppercase', color:'#003170'}}><Image source={require('../assets/images/blue-edit.png')} resizeMode="contain" style={{width:13, height:16}} /> Change Password</Text></Button> */}

              </Block>
              
            
              </ScrollView>

              <Block flex={false}><Button onPress={() => refRBSheet.current.open()} color='primary' style={{alignItems:'center'}}><Text color='white' style={{fontFamily: 'Roboto_700Bold', fontSize:14, textTransform:'uppercase'}}>Change Password</Text></Button></Block>
              <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={350}
        animationType='slide'
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.8)"
          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}
      >
        <Block padding={theme.sizes.padding}>
          {
            sheetLoading ? (<Block center middle><ActivityIndicator size="large" /></Block>) : (
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
                )}
        </Block>
      </RBSheet>
              </>
              )}

        </Block>
    )
    }
}



const style = StyleSheet.create({
    
    main: {
        backgroundColor: '#F4F4F7',
    }
  })


export default UserProfile;