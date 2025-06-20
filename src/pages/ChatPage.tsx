import { Box, Container, Typography } from "@mui/material";
import { ChatInput } from "../components/ChatInput";
// import { ChatMessage } from "../components/ChatMessage";
import { useEffect, useRef, useState } from "react";
// import { v4 as uuid } from "uuid";
import type { Message } from "../types/Message";
import AudioPulse from "../components/AudioPulse";

const USER_ID = "9144fa21-f84a-4ed8-874c-76e448121afd";
const CHAT_SESSION_ID = "chatSessionId";
// const API_SERVICE = 'http://localhost:3001'
const API_SERVICE = "https://207c-189-216-195-64.ngrok-free.app";
const WEB_SOCKET = "ws://207c-189-216-195-64.ngrok-free.app";

export function ChatPage() {
  //   const [audioMessages, setAudioMessages] = useState<Message[]>([]);
  const [textMessage, setTextMessage] = useState<Message>();
  const chatRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(localStorage.getItem(CHAT_SESSION_ID) || USER_ID);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  function onPlayAudio() {
    setIsPlayingAudio(true);
  }
  function onEndAudio(audio: HTMLAudioElement) {
    setIsPlayingAudio(false);
    audio.removeEventListener("play", onPlayAudio);
    audio.removeEventListener("ended", () => onEndAudio(audio));
  }

  useEffect(() => {
    localStorage.setItem(CHAT_SESSION_ID, sessionId.current);
  }, []);

  useEffect(() => {
    const ws = new WebSocket(WEB_SOCKET);
    ws.onopen = () => {
      console.log("onOpen webSocket");
      ws.send(
        JSON.stringify({ type: "register", sessionId: sessionId.current })
      );
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data) as Message;
      if (response.type === "text") {
        setTextMessage(response);
      }
      if (response.type === "audio") {
        const audio = new Audio(response.content);
        audio.addEventListener("play", onPlayAudio);
        audio.addEventListener("ended", () => onEndAudio(audio));
        audio.play();
      }
    };
    ws.onerror = (error) => {
      console.log("Websocket error: ", error);
    };
    ws.onclose = () => {
      console.log("Websocket closed");
    };
    return () => ws.close();
  }, []);

  // Polling connection
  //   useEffect(() => {
  //     const interval = setInterval(async () => {
  //       try {
  //         const res = await fetch(
  //           `${API_SERVICE}/api/messages/${sessionId.current}`,
  //           {
  //             headers: {
  //               "ngrok-skip-browser-warning": "true",
  //             },
  //           }
  //         );
  //         const data = await res.json();
  //         if (data.messages?.length) {
  //           const messages: Message[] = data.messages;
  //           const textMessages = messages.filter((msg) => msg.type === "text");
  //           const audioMessages = messages.filter((msg) => msg.type === "audio");
  //           console.log("Text messages ", textMessages);
  //           console.log("Audio messages ", audioMessages);
  //           audioMessages.forEach((msg) => {
  //             const audio = new Audio(msg.content);
  //             audio.addEventListener("play", onPlayAudio);
  //             audio.addEventListener("ended", () => onEndAudio(audio));
  //             audio.play();
  //           });
  //           setMessages(() => [...textMessages]);
  //         }
  //       } catch (error) {
  //         console.error("Error al consultar mensajes : ", error);
  //       }
  //     }, 3_000);
  //     return () => clearInterval(interval);
  //   }, []);

  //   useEffect(() => {
  //     chatRef.current?.scrollTo({
  //       top: chatRef.current.scrollHeight,
  //       behavior: "smooth",
  //     });
  //   }, [audioMessages]);

  const handleAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "user-message.webm");
    formData.append("sessionId", sessionId.current);

    await fetch(`${API_SERVICE}/api/chat-audio`, {
      method: "POST",
      body: formData,
    });
  };
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          maxWidth: 320,
          minWidth: 320,
          minHeight: 320,
        }}
      >
        <Typography marginBottom={1}>Voice Chat</Typography>
        <Box
          ref={chatRef}
          sx={{
            position: "relative",
            maxHeight: 320,
            maxWidth: 320,
            minWidth: 320,
            minHeight: 320,
            overflowY: "auto",
            // overflow: 'hidden',
            border: "1px solid #c0c0c0",
            borderRadius: 4,
            // p: 1,
            marginBottom: 1,
            backgroundImage: 'url("ejecutivoSantander.png")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {/* {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg}/>
        ))} */}
          <AudioPulse isPlaying={isPlayingAudio} />
        </Box>
        <Typography
          variant="body2"
          fontSize={12}
          lineHeight={1}
          color="textSecondary"
        >
          {textMessage?.content}
        </Typography>
        <ChatInput onSendAudio={handleAudio}></ChatInput>
      </Box>
    </Container>
  );
}
