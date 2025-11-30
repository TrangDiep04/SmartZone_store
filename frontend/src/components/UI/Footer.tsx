import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#222",
        color: "white",
        padding: "20px 16px",
        textAlign: "center",
        borderTop: "1px solid rgba(255, 255, 255, 0.2)",
      }}
      className="footer-inner"
    >
      <Typography variant="body2" sx={{ marginBottom: "10px" }}>
        © {new Date().getFullYear()} SmartZone Store. All rights reserved.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
        <Link href="/about" color="inherit" underline="hover" sx={{ margin: "0 16px" }}>
          Giới thiệu
        </Link>
        <Link href="/contact" color="inherit" underline="hover" sx={{ margin: "0 16px" }}>
          Liên hệ
        </Link>
        <Link href="/policy" color="inherit" underline="hover" sx={{ margin: "0 16px" }}>
          Chính sách
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;