import { Mic } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  disabled: boolean
  onSendAudio: (audio: Blob) => void;
}

export function ChatInput({ disabled, onSendAudio }: ChatInputProps) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    if (!recording) return;

    async function startRecord() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunks.current = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.current.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/webm",
          });
          onSendAudio(audioBlob);
        };
        mediaRecorder.start();
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
      <IconButton
        color="error"
        size="large"
        disabled={disabled}
        onClick={() => (recording ? stopRecord() : setRecording(true))}
      >
        {recording ? <CircularProgress size={24} /> : <Mic />}
      </IconButton>
      {/* <Typography variant="caption" color="textSecondary">
        {recording ? "Escuchando..." : "Clic para hablar"}
      </Typography> */}
    </Box>
  );
}
