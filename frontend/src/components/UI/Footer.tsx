import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#222",
        color: "white",
        padding: "20px",
        marginTop: "40px",
        textAlign: "center",
      }}
    >
      <Typography variant="body1">
        © {new Date().getFullYear()} SmartZone Store. All rights reserved.
      </Typography>
      <Box sx={{ marginTop: "10px" }}>
        <Link href="/about" color="inherit" underline="hover" sx={{ margin: "0 10px" }}>
          Giới thiệu
        </Link>
        <Link href="/contact" color="inherit" underline="hover" sx={{ margin: "0 10px" }}>
          Liên hệ
        </Link>
        <Link href="/policy" color="inherit" underline="hover" sx={{ margin: "0 10px" }}>
          Chính sách
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;