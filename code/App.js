import React from 'react';
import { StyleSheet, StatusBar, Platform, SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './App/Screens/base/home';
import Clientab from './App/Screens/client/clientab';
import Login from './App/Screens/base/login';
import Signup from './App/Screens/base/signup';
import Emailconfig from './App/Screens/base/emailconfig';
import Mdpconfig from './App/Screens/base/mdpconfig';
import Chauftab from './App/Screens/chauffeur/chauftab';
import { UserProvider } from './App/UserContext';


export default function App() {
  const Stack = createStackNavigator();
  return (
     <UserProvider>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='Signup' component={Signup} />
          <Stack.Screen name='Emailconfig' component={Emailconfig} />
          <Stack.Screen name='Mdpconfig' component={Mdpconfig} />
         <Stack.Screen name='Home2' component={Clientab} />
         <Stack.Screen name='Home3' component={Chauftab} />
        </Stack.Navigator> 
        </SafeAreaView>
      </NavigationContainer></UserProvider>
      
   
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    alignContent:"center",
    justifyContent:"center"
  },
});
