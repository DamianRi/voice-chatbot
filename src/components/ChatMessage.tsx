import { Box, Paper, Typography } from "@mui/material";
import type { Message } from "../types/Message";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.author === "user";
  return (
    <Box
      display="none"
      justifyContent={isUser ? "flex-end" : "flex-start"}
      mb={1}
    >
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          justifyContent: isUser ? "flex-end" : "flex-start",
          alignItems: "center",
          px: 1.5,
          py: 0.5,
          bgcolor: isUser ? "primary.main" : "grey.300",
          color: isUser ? "white" : "black",
          borderRadius: 8,
          maxWidth: "75%",
        }}
      >
        {message.type === "text" ? (
          <Typography>{message.content}</Typography>
        ) : isUser ? (
          <audio controls src={message.content} style={{ width: "100%" }} />
        ) : (
          <audio
            controls
            src={message.content}
            style={{ width: "100%" }}
            autoPlay
          />
        )}
      </Paper>
    </Box>
  );
}
