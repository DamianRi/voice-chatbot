import { Mic, MicOff } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AudioPulse from "./AudioPulse";

interface ChatInputProps {
  disabled: boolean
  onSendAudio: (audio: Blob) => void;
}

export function ChatInput({ disabled, onSendAudio }: ChatInputProps) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [showPermissionError, setShowPermissionError] = useState(false)
  const permissionError = 'No se cuenta con el permiso para utilizar el micrófono.'

  useEffect(() => {
    async function requestPermission() {
      setShowPermissionError(false)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder
        console.log('Permiso concedido')
      } catch (error) {
        setShowPermissionError(true)
        console.log('Permiso denegado')
      }
    }
    requestPermission()
  }, [])

  useEffect(() => {
    if (!recording) return;

    
    async function startRecord() {
      if (mediaRecorderRef.current === null) {
        setRecording(false)
        return
      }
      try {
        audioChunks.current = [];
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.current.push(e.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/webm",
          });
          onSendAudio(audioBlob);
        };
        mediaRecorderRef.current?.start();
      } catch (error) {
        console.log("Error on access mic: ", error);
      }
    }
    startRecord();

    return () => {
      mediaRecorderRef.current?.stream
        .getTracks()
        .forEach((track) => track.stop);
    };
  }, [recording, onSendAudio]);

  const stopRecord = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box position={'relative'} display={'flex'}>
        { recording && <AudioPulse isPlaying />}
        <IconButton
          color="error"
          size="large"
          disabled={disabled || showPermissionError}
          onClick={() => (recording ? stopRecord() : setRecording(true))}
          sx={{
            border: '1px solid'
          }}
        >
          {recording ? <Mic /> : <MicOff />}
        </IconButton>
      </Box>
      {/* <Typography variant="caption" color="textSecondary">
        {recording ? "Escuchando..." : "Clic para hablar"}
      </Typography> */}
      {
        showPermissionError &&
        <Typography variant="caption" color="error">{permissionError}</Typography>
      }
    </Box>
  );
}
