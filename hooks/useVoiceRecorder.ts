import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import React from "react";

export type RecordingStartResult = "started" | "permission-denied" | "error";

export function useVoiceRecorder() {
  const recording = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recorderState = useAudioRecorderState(recording, 100);
  const operationInFlight = React.useRef(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isBusy, setIsBusy] = React.useState(false);

  const startRecording = async (): Promise<RecordingStartResult> => {
    if (operationInFlight.current) return "error";
    operationInFlight.current = true;
    setIsBusy(true);

    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) return "permission-denied";

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await recording.prepareToRecordAsync();
      recording.record();
      setIsRecording(true);
      return "started";
    } catch {
      setIsRecording(false);
      return "error";
    } finally {
      operationInFlight.current = false;
      setIsBusy(false);
    }
  };

  const stopRecording = async () => {
    if (operationInFlight.current) return null;
    operationInFlight.current = true;
    setIsBusy(true);

    try {
      await recording.stop();
      await setAudioModeAsync({ allowsRecording: false });
      return recording.uri;
    } catch {
      return null;
    } finally {
      setIsRecording(false);
      operationInFlight.current = false;
      setIsBusy(false);
    }
  };

  const discardRecording = async () => {
    await stopRecording();
  };

  return {
    isRecording,
    isBusy,
    metering: recorderState.metering,
    startRecording,
    stopRecording,
    discardRecording,
  };
}
