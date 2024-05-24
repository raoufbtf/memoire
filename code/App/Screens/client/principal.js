import React from 'react';
import { StyleSheet, View, Text,TouchableOpacity,Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { createStackNavigator } from '@react-navigation/stack';
import Envoi from './envoicolis';
import Listenvoi from './listenvoi';
import Devenirchauf from './devenirchauf';
import Recevoire from './recevoirecolis';
import Enregistre from './enregistremap';

function Page1({ navigation }) { 
  return (
    <View style={styles.container}>
      <View style={styles.animation}>
        <Swiper   autoplay={true} autoplayTimeout={6}>
          <View style={styles.slide}><Image source={require('../assets/liv.png')} style={styles.backgroundImage} /></View>
          <View style={styles.slide}><Image source={require('../assets/secu.png')} style={styles.backgroundImage} /></View>
          <View style={styles.slide}><Image source={require('../assets/gps.png')} style={styles.backgroundImage} /></View>
        </Swiper>

      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('envoi')}> 
      <Text>Envoier un colis </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Listenvoi')}> 
      <Text>Liste de colis envoyer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Recevoire')}> 
      <Text>Recevoire un colis </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  slide:{flex:1,margin:5, borderRadius:25,justifyContent: "center",alignItems: "center",},
  backgroundImage: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    margin:5,
    borderRadius:25
  },
  animation:{
    width:"95%",
    height:"40%",
    borderRadius:25

  },
  button: {
    backgroundColor: 'rgba(239, 32, 77, 1)',
    width:"95%",
    height:"15%",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:25

  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: 'rgba(239, 32, 77, 0.1)'
  }
});



function Home_client() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName='page1' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='page1' component={Page1} />
      <Stack.Screen name='envoi' component={Envoi} />
      <Stack.Screen name='Listenvoi' component={Listenvoi} />
      <Stack.Screen name='Recevoire' component={Recevoire} />
      <Stack.Screen name='Devenirchauf' component={Devenirchauf} />
      <Stack.Screen name='Enregistre' component={Enregistre} />
      

    </Stack.Navigator>
  );
}

export default Home_client;
