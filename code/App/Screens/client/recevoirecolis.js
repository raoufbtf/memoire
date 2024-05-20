import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Textedit from '../../Components/textedit';
import ButtonM from '../../Components/button';
function Recevoire({navigation}) {
   

    return (
       <View style={styles.container}>     
        <View style={styles.screen}>
         <Text style={styles.title } > Le livreur a-t-il toqué à ta porte ?</Text>
         <Text style={styles.text }> Donnez ce code seulement quand le livreur est arrivé. </Text>
         <View style={{flex:0.7,width:"100%",alignItems:"center", justifyContent:"center",}}>
         <Textedit label={"Code de confirmation de livraison "} style={styles.textedit}>le code generer automatique </Textedit>
         </View>
         <ButtonM fnc={()=>navigation.navigate('page1')} >Retourner</ButtonM>
     
     
        </View>
        </View>
  
    );
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
  
  },
  textedit:{width:"90%",height:"30%"}
  });
  export default Recevoire;