"use client";
import * as React from 'react';
import { Container, Box, Card, CardContent, Typography, Link, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Account() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <Container maxWidth="sm">
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        paddingTop='50px'
        minHeight="100vh"
        gap={2}
      >
        <Card sx={{ width: '100%', p: 2 }}>
          <CardContent>
            <Typography sx={{textAlign:'center'}} variant="h6" component="div" gutterBottom>
              Account Settings
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={() => handleNavigation('/changepassword')}
              sx={{ mb: 2 }}
            >
              Change Password
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={() => handleNavigation('/changeprofilephoto')}
            >
              Change Profile Photo
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

