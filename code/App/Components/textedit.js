
import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function Textedit({ children ,label,button,fnc,style}) {
  return (
  <View style={[styles.Container,style]}>
    <View style={{padding:10}}>
    <Text style={{fontSize:20,fontWeight:"700"}}>{label}:</Text>
    <Text style={{fontSize:18,fontWeight:"400"}}>{children}</Text>
    </View>
    { button &&
    <TouchableOpacity onPress={fnc}>
    <AntDesign name="edit" size={24} color="black" />
    </TouchableOpacity>
    }

  </View>
  
  );
}

const styles = StyleSheet.create({
  Container: {
    padding:10,
    marginTop: 10,
    height: "20%",
    width: "80%",
    alignItems: 'center',
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "grey" ,
    borderRadius:20

  },
});
