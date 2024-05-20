
import React from 'react';
import { TouchableOpacity,Text, StyleSheet } from 'react-native';

export default function buttonM({ children ,fnc,style}) {
  return (
  <TouchableOpacity onPress={fnc} 
  style={[styles.button,style]}> 
       <Text style={{fontWeight:"700",fontSize:25}}>{children} </Text>
 </TouchableOpacity>
  
  );
}

const styles = StyleSheet.create({
  button: {
   borderRadius:25,
   backgroundColor:'rgba(239, 32, 77, 1)',
   height:50,
   width:"60%",
   alignItems: 'center',
   justifyContent:"center"
              
  },
});
