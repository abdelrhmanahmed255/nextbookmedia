"use client";
import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
let ChangePassword = () => {
  let [currentPassword, setCurrentPassword] = useState('');
  let [newPassword, setNewPassword] = useState('');
  let [error, setError] = useState('');
  let [success, setSuccess] = useState('');
let router = useRouter();

  let handleChangePassword = () => {
    setError('');
    setSuccess('');
  
    let token = localStorage.getItem('userToken');
  
    fetch('https://linked-posts.routemisr.com/users/change-password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'token': token 
      },
      body: JSON.stringify({
        password: currentPassword,
        newPassword: newPassword
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json().then(() => {
          setSuccess('Password changed successfully');
          setCurrentPassword('');
          setNewPassword('');
          setTimeout(() => {
            router.push('/');
          }, 2000);
        });
      } else {
        return response.json().then(data => {
          setError(data.error || 'Failed to change password');
        });
      }
    })
    .catch(error => {
      setError('An error occurred');
      console.error('Error changing password:', error);
    });
  };
  
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <Card sx={{ width: '100%', p: 2 }}>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              Change Password
            </Typography>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ChangePassword;
