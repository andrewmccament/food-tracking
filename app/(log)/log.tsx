import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Audio } from "expo-av";

export default function LoggingScreen() {
  const [listening, setListening] = React.useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recording, setRecording] = React.useState({} as Audio.Recording);

  const startLogging = async () => {
    setListening(true);
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("waiting for permission");
        await requestPermission();
      }
      Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error(err);
    }
  };

  const stopLogging = async () => {
    setListening(false);
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    await recording.stopAndUnloadAsync();
    const { sound, status } = await recording.createNewLoadedSoundAsync();

    const uri = recording.getURI();
    sound.replayAsync();
  };

  return (
    <View style={styles.container}>
      {listening ? (
        <Button
          title="Stop Logging"
          onPress={() => {
            stopLogging();
          }}
        />
      ) : (
        <Button
          title="Log"
          onPress={() => {
            startLogging();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flexGrow: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
});
