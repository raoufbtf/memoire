import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, Ionicons } from '@expo/vector-icons';

import Home_chauf from './principal';
import Profil from './profil';

const Tab = createBottomTabNavigator();

export default function Chauftab() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconComponent;
          if (route.name === 'home') {
            iconComponent = focused ? (
              <Entypo name="home" size={size} color="rgba(239, 32, 77, 1)" />
            ) : (
              <Entypo name="home" size={size} color="black" />
            );
          } else if (route.name === 'profil') {
            iconComponent = focused ? (
              <Ionicons name="person" size={size} color="rgba(239, 32, 77, 1)" />
            ) : (
              <Ionicons name="person" size={size} color="black" />
            );
          }
          return iconComponent;
        },
        tabBarOptions: {
          showLabel: false,
         
        },
        header: () => (
          <View style={styles.header}>
            <Image source={require('../assets/yourway.png')} />
          </View>
        ),
      })}
    >
      <Tab.Screen name="home" component={Home_chauf}  />
      <Tab.Screen name="profil" component={Profil} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5

  },
});
