
import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

export default function Container({children,title,text}) {
  return (
    <View style={styles.container}>     
   <View style={styles.screen}>
    <Image source={require("../Screens/assets/yourway.png")}/>
    <Text style={styles.title } >{title}</Text>
    <Text style={styles.text }>{text}</Text>
    
   {children}

   </View>
   </View>
)
}
const styles = StyleSheet.create({
  container:{
    backgroundColor: 'rgba(239, 32, 77, 0.1)',
     flex: 1,alignItems:"center", 
     justifyContent:"center",
    },
screen: {
  flex: 1,
  backgroundColor: '#fff',
  width:"95%",
  alignItems:"center",
  alignSelf:"center",
  justifyContent:"flex-start",
  margin:20,
  borderRadius:25,
  paddingTop:10,
  
},
title:{
  
    fontSize:25,
    fontWeight:"700",
    textAlign:"center", 
    paddingTop:10
},
text:{
    fontSize:18,
    fontWeight:"500",
    textAlign:"center",
    paddingTop:10

}
});


