import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { theme } from "../constants";


const CartNavigation = ({navigation}) => {

    const passCart = async () => {
        navigation.navigate('CatelogList', { screen: 'CheckOut', initial: false})
    }


    return(
        <TouchableOpacity onPress={() => passCart()} style={{alignItems: 'flex-end', paddingRight: theme.sizes.padding}}>
            <Image style={{width:22, height:27}} source={require('../assets/images/search-icn.png')} resizeMode="contain" />
        </TouchableOpacity>
    )
}

export default CartNavigation;