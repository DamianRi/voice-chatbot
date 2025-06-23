import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  Fade,
  IconButton,
  Typography,
} from "@mui/material";
import { ChatInput } from "../components/ChatInput";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import type { Message } from "../types/Message";
import { Close } from "@mui/icons-material";

const USER_ID = uuid();
const CHAT_SESSION_ID = "chatSessionId";
// const API_SERVICE = 'http://localhost:3001'
const API_SERVICE = "https://207c-189-216-195-64.ngrok-free.app";
const WEB_SOCKET = "wss://207c-189-216-195-64.ngrok-free.app";

const infograhpyImages = {
  "estado de cuenta": "/voice-chatbot/santander-estado-cuenta.jpg",
  saldo: "/voice-chatbot/santander-saldo.jpg",
  clabe: "/voice-chatbot/santander-clabe.jpg",
};

export function ChatPage() {
  const [textMessage, setTextMessage] = useState<Message>();
  const chatRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(localStorage.getItem(CHAT_SESSION_ID) || USER_ID);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showInfography, setShowInfography] = useState(false);
  const [infographyImage, setInfographyImage] = useState<string>();
  const [openInfo, setOpenInfo] = useState(false);

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
      console.log("WebSocket Open");
      ws.send(
        JSON.stringify({ type: "register", sessionId: sessionId.current })
      );
    };
    ws.onmessage = (event) => {
      console.log("WebSocket Message");
      const response = JSON.parse(event.data) as Message;
      if (response.type === "text") {
        setShowInfography(false);
        if (response.content.includes("CLABE")) {
          setShowInfography(true);
          setInfographyImage(infograhpyImages.clabe);
        } else if (response.content.includes("estado de cuenta")) {
          setShowInfography(true);
          setInfographyImage(infograhpyImages["estado de cuenta"]);
        } else if (response.content.includes("saldo")) {
          setShowInfography(true);
          setInfographyImage(infograhpyImages.saldo);
        }
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

  const handleAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "user-message.webm");
    formData.append("sessionId", sessionId.current);

    await fetch(`${API_SERVICE}/api/chat-audio`, {
      method: "POST",
      body: formData,
    });
  };

  const handleOpenInfo = () => {
    setOpenInfo(true);
  };
  const handleCloseInfo = () => {
    setOpenInfo(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('santander.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(120, 120, 120, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Voice chat */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 320,
            minHeight: 320,
            maxWidth: 720,
            width: "fit-content",
            backgroundColor: "white",
            borderRadius: 4,
            padding: 2,
          }}
        >
          <Typography marginBottom={1}>Voice Chat</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 1,
              transition: "width 0.5s ease",
            }}
            width={showInfography ? "fit-content" : 320}
          >
            {/* Botcito */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                maxHeight: 320,
                maxWidth: 320,
                minWidth: 320,
                minHeight: 320,
                overflowY: "auto",
                borderRadius: 4,
                marginBottom: 1,
                backgroundImage: 'url("ejecutivoSantander.png")',
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                padding: 2,
                boxSizing: "border-box",
              }}
            >
              {textMessage?.content && (
                <Typography
                  variant="body1"
                  fontSize={12}
                  lineHeight={1}
                  color="white"
                  textAlign="justify"
                  padding={0.5}
                  borderRadius={1}
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {textMessage?.content}
                </Typography>
              )}
            </Box>
            {/* Infografías */}
            <Fade in={showInfography} mountOnEnter unmountOnExit timeout={500}>
              <Box
                ref={chatRef}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  //   maxHeight: 120, // Modo columna
                  maxHeight: 320, // Modo columna
                  maxWidth: 320,
                  //   minWidth: 320,
                  minHeight: 96,
                  overflowY: "auto",
                  border: "1px solid #c0c0c0",
                  borderRadius: 4,
                  marginBottom: 1,
                  padding: 2,
                  boxSizing: "border-box",
                }}
              >
                <Card sx={{ width: 96 }} onClick={handleOpenInfo}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={infographyImage}
                      alt="Infografía del mensaje"
                      height="auto"
                    />
                  </CardActionArea>
                </Card>
                <IconButton
                  size="small"
                  color="error"
                  title="Cerrar infografía"
                  sx={{
                    border: "1px solid",
                  }}
                  onClick={() => setShowInfography(!showInfography)}
                >
                  <Close />
                </IconButton>
              </Box>
            </Fade>
          </Box>
          <Box display={"flex"} alignItems={"baseline"} gap={1}>
            <ChatInput
              disabled={isPlayingAudio}
              onSendAudio={handleAudio}
            ></ChatInput>
          </Box>
        </Box>

        {/* Modal para mostrar infografías */}
        <Dialog open={openInfo} onClose={handleCloseInfo}>
          <Box>
            <img
              src={infographyImage}
              alt="Infografía del mensaje"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 2,
                boxShadow: "0 0 16px rgba(0, 0, 0, 0.5)",
              }}
            />
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
}
