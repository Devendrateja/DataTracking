import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PlayInstallReferrer} from 'react-native-play-install-referrer';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TextInput,
  Alert
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import analytics from '@react-native-firebase/analytics';

function App() {
  const [name, setName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false)
   const [refererData, setRefererData] = useState({
    name: '',
    time: '',
    googlePlayInstant: '',
  });
  const [refererDataErrorMessage, setRefererDataErrorMessage] = useState();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const getfirstLaunchKey = async () => {
    try {
      const value = await AsyncStorage.getItem('is_first_launch');
      if (value !== null) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      // error reading value
      console.log(error);
      return true;
    }
  };

  const saveFirstLaunchKey = async value => {
    try {
      await AsyncStorage.setItem('is_first_launch', value);
    } catch (err) {
      // saving error
      console.log(err);
    }
  };

  const sendRefererDetails = () => {
    if (Platform.OS === 'android') {
      saveFirstLaunchKey('1');
      PlayInstallReferrer.getInstallReferrerInfo(
        async (installReferrerInfo, error) => {
          if (!error) {
            const refererData = installReferrerInfo.installReferrer
              .split('&')
              .reduce((value, data) => {
                const utmValues = data.split('=');
                value[utmValues[0]] = utmValues[1];
                return value;
              }, {});

            const analyticsData = {
              ...refererData,
              name: installReferrerInfo.installReferrer,
              time: installReferrerInfo.referrerClickTimestampSeconds,
              googlePlayInstant: installReferrerInfo.googlePlayInstant,
              installVersion: installReferrerInfo.installVersion,
            };

            await analytics().logEvent(
              'install_referrer_on_first_launch',
              analyticsData,
            );

            Alert.alert(
              'install_referrer_on_first_launch',
              JSON.stringify(analyticsData),
            );

            console.log('Install referrer = ', installReferrerInfo);
            // setRefererName(installReferrerInfo.installReferrer)
            console.log(
              'Referrer click timestamp seconds = ' +
                installReferrerInfo.referrerClickTimestampSeconds,
            );
            console.log(
              'Install begin timestamp seconds = ' +
                installReferrerInfo.installBeginTimestampSeconds,
            );
            console.log(
              'Referrer click timestamp server seconds = ' +
                installReferrerInfo.referrerClickTimestampServerSeconds,
            );
            console.log(
              'Install begin timestamp server seconds = ' +
                installReferrerInfo.installBeginTimestampServerSeconds,
            );
            console.log(
              'Install version = ' + installReferrerInfo.installVersion,
            );
            console.log(
              'Google Play instant = ' + installReferrerInfo.googlePlayInstant,
            );
          } else {
            console.log('Failed to get install referrer info!', error);
            console.log('Response code: ' + error.responseCode);
            console.log('Message: ' + error.message);
            setRefererDataErrorMessage(error.message);
          }
        },
      );
    }
  };
  const dude = () => {
    if (Platform.OS === 'android') {
      PlayInstallReferrer.getInstallReferrerInfo(
        async (installReferrerInfo, error) => {
          if (!error) {
            console.log('Install referrer = ', installReferrerInfo);
            console.log(
              'Referrer click timestamp seconds = ' +
                installReferrerInfo.referrerClickTimestampSeconds,
            );
            console.log(
              'Install begin timestamp seconds = ' +
                installReferrerInfo.installBeginTimestampSeconds,
            );
            console.log(
              'Referrer click timestamp server seconds = ' +
                installReferrerInfo.referrerClickTimestampServerSeconds,
            );
            console.log(
              'Install begin timestamp server seconds = ' +
                installReferrerInfo.installBeginTimestampServerSeconds,
            );
            console.log(
              'Install version = ' + installReferrerInfo.installVersion,
            );
            console.log(
              'Google Play instant = ' + installReferrerInfo.googlePlayInstant,
            );
          } else {
            console.log('Failed to get install referrer info!', error);
            console.log('Response code: ' + error.responseCode);
            console.log('Message: ' + error.message);
          }
        },
      );
    }
  }

  const logRefererDetails = async () => {
  
    const isFirstLaunch =  await getfirstLaunchKey()
       if(isFirstLaunch){
        sendRefererDetails()
       }
  };

  useEffect(() => {
    logRefererDetails();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[backgroundStyle]}>
        {!isRegistered && <View style={{padding: 20}}>
          <Text style={{marginBottom: 5}}>enter your name</Text>
          <TextInput
            editable
            multiline
            numberOfLines={4}
            onChangeText={text => setName(text)}
            value={name}
            placeholder="please enter your name here"
            style={{
              padding: 2,
              borderWidth: 1,
              borderColor: 'black',
              height: 50,
              marginBottom: 20,
            }}
          />
          <Button
            onPress={async () => {
              await analytics().logEvent('userRegistered', {name});
              Alert.alert("userRegistered", JSON.stringify({name}))
              setIsRegistered(true)
            }}
            title="Register"
          />
          {/* <Text>{refererData.name?  `name:- ${refererData.name}`:null}</Text>
        <Text>{refererData.time? `time:- ${refererData.time}`:null}</Text>
        <Text>{refererData.googlePlayInstant? `Google play instant:- ${refererData.googlePlayInstant}`:null}</Text>
        <Text>{refererDataErrorMessage? `error:- ${refererDataErrorMessage}`:null}</Text>
        <Button
       
          onPress={sendRefererDetails}
          title="log referer"
        /> */}
        </View>}
        {isRegistered && <View style={{display:"flex", justifyContent:"center",alignItems:"center",marginTop:"50%", borderColor:"green",borderWidth:2, height:100, width:"100%"}}><Text style={{color:"green"}} >Successfully registered as {name}</Text></View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
