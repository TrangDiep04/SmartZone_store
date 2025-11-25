import React from "react";
import { Box, Typography } from "@mui/material";

const Banner = () => {
  return (
    <Box sx={{ backgroundImage: 'url("/images/banner.jpg")', height: 300, backgroundSize: "cover", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Typography variant="h3" color="white">SmartZone Store – Điện thoại chính hãng</Typography>
    </Box>
  );
};

export default Banner;