import React from "react";
import { Box, Typography } from "@mui/material";
import "../../styles/Footer.css";

const Footer: React.FC = () => {
  return (
    <Box component="footer" className="minimal-footer">
      <Typography variant="body2" className="footer-copyright-only">
        © {new Date().getFullYear()} SmartZone Store. Thiết kế bởi SmartZone Team. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;