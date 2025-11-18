import React from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";

const LoadingComponent = ({ message = "Cargando...", overlay = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        py: 6,
        gap: 2,
        ...(overlay && {
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(163, 177, 138, 0.35)", 
          backdropFilter: "blur(4px)",
          zIndex: 2000,
        }),
      }}
    >
      {/* Contenedor estilizado */}
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "#EDE0D4", // paper
          padding: "24px 32px",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          border: "2px solid #A3B18A", // secondary
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: "#588157", // primary
            animation: "spin 1.4s ease-in-out infinite",
          }}
        />

        <Typography
          sx={{
            mt: 1,
            fontSize: "1.15rem",
            color: "#333333", // text
            fontWeight: 600,
            textAlign: "center",
            letterSpacing: "0.6px",
          }}
        >
          {message}
        </Typography>
      </Paper>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default LoadingComponent;
