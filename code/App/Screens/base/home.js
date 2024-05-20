import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Animated , Text, TouchableOpacity} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

function Home({navigation}) {
  const [animation] = useState(new Animated.Value(0));
  const [isVisible, setIsVisible] = useState(true);
  

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false); 
    });
  }, []);

  const cercle = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  

  return (
    <View style={styles.flash}>
      {isVisible && (
        <>
          <Image fadeDuration={1000} source={require("../assets/logo2.png")} />
          <Animated.View style={[styles.cercleContainer, { transform: [{ rotate: cercle }] }]}>
            <FontAwesome name="circle-o-notch" size={40} color="black" />
          </Animated.View>
        </>
      )}
      {!isVisible  && (
        <View style={styles.container}>
          <View style={styles.viewPhoto}>
            <View style={{ flex: 0.2,  alignItems: 'center',justifyContent: 'center'}}><Image style={{ flex:1,resizeMode: 'contain' }} source={require("../assets/yourway.png")} /></View>
            <View style={{ flex: 0.8,  alignItems: 'center',justifyContent: 'center'}}><Image style={{ flex:1, resizeMode: 'contain' }} source={require("../assets/caricature.png")} /></View>
          </View>
          <View style={styles.viewText}>
            <View style={{flex:1,flexDirection:"column", padding:10,alignItems: 'center',justifyContent:"space-between"}}>
              <View style={{ padding:10,alignItems: 'center'}}>
              <Text style={{fontWeight:"700",fontSize:25,textAlign:"center"}}>Bonjour et Bienvenue à Bord!</Text>
              <Text style={{fontWeight:"400",fontSize:18,textAlign:"center"}}>Découvrez la révolution du covoiturage de colis en Algérie ! Simplifiez vos envois et économisez ensemble</Text>
              </View>
              <TouchableOpacity onPress={()=>navigation.navigate("Login")} 
              style={{borderRadius:25,backgroundColor:'rgba(239, 32, 77, 1)',height:30,width:"70%",alignItems: 'center',justifyContent:"center"}}>
                <Text style={{fontWeight:"700",fontSize:18}}>Connectez-vous </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(239, 32, 77, 0.1)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewPhoto: {
    flex: 0.5,
    width: '100%',
  },
  viewText: {borderRadius:25,
    flex: 0.5,
    backgroundColor: '#fff',
    alignContent: 'center',
    justifyContent: 'center',
  },
  flash: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cercleContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
