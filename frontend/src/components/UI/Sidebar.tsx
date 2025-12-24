import React from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  Divider,
  Box,
  Avatar,
} from '@mui/material';
import { type Category } from '../../api/categoryApi';
import CategoryIcon from '@mui/icons-material/Category';

interface SidebarProps {
  categories: Category[];
  onSelect: (id: number | null) => void;
  showAllLabel?: string;
  selectedCategoryId: number | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  onSelect,
  showAllLabel,
  selectedCategoryId,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 3,
        background: '#ffffff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        minWidth: 240,
        maxWidth: 300,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CategoryIcon color="primary" fontSize="medium" />
        <Typography variant="h6" sx={{ fontWeight: 700, ml: 1 }}>
          Danh mục sản phẩm
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List component="nav" sx={{ px: 0 }}>
        {showAllLabel && (
          <ListItemButton
            selected={selectedCategoryId === null}
            onClick={() => onSelect(null)}
            sx={{
              borderRadius: 2,
              mb: 1,
              px: 2,
              '&.Mui-selected': {
                bgcolor: '#e3f2fd',
                color: '#1976d2',
              },
              '&:hover': {
                bgcolor: '#f5f7fa',
              },
            }}
          >
            <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: '#1976d2' }}>
              <CategoryIcon fontSize="small" sx={{ color: 'white' }} />
            </Avatar>
            <ListItemText
              primary={showAllLabel}
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: selectedCategoryId === null ? 700 : 500,
              }}
            />
          </ListItemButton>
        )}

        {categories.map((cat) => (
          <ListItemButton
            key={cat.id}
            selected={selectedCategoryId === cat.id}
            onClick={() => onSelect(cat.id)}
            sx={{
              borderRadius: 2,
              mb: 1,
              px: 2,
              '&.Mui-selected': {
                bgcolor: '#e3f2fd',
                color: '#1976d2',
              },
              '&:hover': {
                bgcolor: '#f5f7fa',
              },
            }}
          >
            <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: '#90caf9' }}>
              <CategoryIcon fontSize="small" sx={{ color: 'white' }} />
            </Avatar>
            <ListItemText
              primary={cat.name}
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: selectedCategoryId === cat.id ? 700 : 500,
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default Sidebar;
