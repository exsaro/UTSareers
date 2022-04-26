import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import {Button, Block, Text} from '../components';
import {theme} from '../constants';
import { DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

// import AsyncStorage from '@react-native-async-storage/async-storage';

import {AuthContext} from '../context/context';

export function UserDrawer({props, navigation}){

    const {SignOut} = React.useContext(AuthContext);
    // const  [userId,setUserId ]= React.useState(null);

    const passUserPage = async () => {
        navigation.navigate('User', { screen: 'UserProfile', initial: false})
    }
    const passRewardPage = async () => {
        navigation.navigate('User', { screen: 'UserReward', initial: false})
    }

    // React.useEffect(() => {
    //     setTimeout(async () => {
    //       let userId;
    //       userId = null;
    //       try {
    //         userId = await AsyncStorage.getItem('userId')
    //       } catch (e) {
    //         console.log(e);
    //       }
    //       setUserId(userId);
    //     }, 1000);
    //   });
    

    return(
        <Block flex={false} padding={[theme.sizes.padding*4,theme.sizes.padding*2]}>
            <TouchableOpacity onPress={()=> passUserPage()}>
            <Block flex={false} row center style={{marginBottom:30}}>
                <Image source={require('../assets/images/user-icon.png')} resizeMode="contain" style={{width:20, height:21, marginRight:15}} />
                <Text h2 color="blue">Profile</Text>
            </Block>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={()=> passRewardPage()}>
            <Block flex={false} row center style={{marginBottom:30}}>
                <Image source={require('../assets/images/earning-icon.png')} resizeMode="contain" style={{width:22, height:25, marginRight:15}} />
                <Text h2 color="blue">My Earnings</Text>
            </Block>
            </TouchableOpacity> */}
            {/* <Block flex={false} row center>
                <Image source={require('../assets/images/notification-icon.png')} resizeMode="contain" style={{width:20, height:21, marginRight:15}} />
                <Button><Text h2 color="blue">Notification</Text></Button>
            </Block>
            <Block flex={false} row center>
                <Image source={require('../assets/images/faq-icon.png')} resizeMode="contain" style={{width:22, height:22, marginRight:15}} />
                <Button><Text h2 color="blue">FAQ’s</Text></Button>
            </Block>
            <Block flex={false} row center>
                <Image source={require('../assets/images/help-icon.png')} resizeMode="contain" style={{width:23, height:23, marginRight:15}} />
                <Button><Text h2 color="blue">Need Help?</Text></Button>
            </Block> */}
            <TouchableOpacity onPress={() => SignOut()}>
            <Block flex={false} row center>
                <Image source={require('../assets/images/logout-icon.png')} resizeMode="contain" style={{width:23, height:23, marginRight:15}} />
                <Text h2 color="blue">Logout</Text>
            </Block>
            </TouchableOpacity>

        </Block>
    )
}

