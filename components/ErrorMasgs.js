import React from 'react';
import Text from "./Text";

function ErrorMessage({error, visible}){
    if(!error || !visible) return null;
    return(
        
        <Text style={{color:'red', fontSize:12, marginBottom:10, marginTop:-10}}>{error}</Text>
    )
}

export default ErrorMessage;