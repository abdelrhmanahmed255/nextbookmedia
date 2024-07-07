"use client";
import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, Button, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';

let ChangeProfilePhoto = () => {
  let router = useRouter();
  let [photo, setPhoto] = useState<File | null>(null);
  let [error, setError] = useState('');
  let [success, setSuccess] = useState('');
  let token = useSelector((state: RootState) => state.auth.token);

  let handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;
    if (files && files.length > 0) {
      let selectedFile = files[0];
      if (selectedFile.size > 4 * 1024 * 1024) { 
        setError('Maximum file size limit exceeded (4 MB)');
      } else {
        setPhoto(selectedFile);
        setError('');
      }
    }
  };

  let handleUploadPhoto = () => {
    if (!photo) {
      setError('Please select a photo to upload');
      return;
    }

    let formData = new FormData();
    formData.append('photo', photo);
    if (!token) {
        throw new Error('Token not found');
      }
    fetch('https://linked-posts.routemisr.com/users/upload-photo', {
      method: 'PATCH',
      headers: {
        'token': token
      },
      body: formData
    })
    .then(response => {
      if (response.ok) {
        setSuccess('Profile photo uploaded successfully');
        setPhoto(null); 
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        return response.json().then(data => {
          setError(data.message || 'Failed to upload photo');
        });
      }
    })
    .catch(error => {
      setError('An error occurred');
      console.error('Error uploading profile photo:', error);
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
              Change Profile Photo
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              style={{ marginBottom: '10px' }}
            />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleUploadPhoto}
            >
              Upload Photo
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ChangeProfilePhoto;
