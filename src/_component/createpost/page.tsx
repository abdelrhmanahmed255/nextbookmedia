"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../lib/store';
import { fetchUserPosts, createPost } from '../../lib/userPostsSlice';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';

const CreatePost = () => {
  const [body, setBody] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state: RootState) => state.userPosts);
  const userId = useSelector((state: RootState) => state.userProfile.userInfo?.id);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserPosts({ userId, limit: 10 }));
    }
  }, [userId, dispatch]);

  const handleCreatePost = () => {
    if (body && photoFile) {
      dispatch(createPost({ body, photoFile }));
      setBody('');
      setPhotoFile(null);
    } else {
      alert('Please provide post content and select a photo');
    }
  };

  useEffect(() => {
    console.log('posts state:', posts);
  }, [posts]);

  return (
    <Box  sx={{ paddingInline:"5px",
         width: {
          xs: "100%",
          sm: "80%", 
          md: "50%", 
          lg: "40%", 
          xl: "40%", 
       }, marginInline: 'auto', position: "relative" ,marginTop:"8px" }}>
      <Typography sx={{ color: "gray", paddingLeft: '5px' }} variant="h5">Create a New Post</Typography>
      <TextField
        label="Post Content"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        fullWidth
        multiline
        sx={{ color: 'gray' }}
        rows={3}
        margin="normal"
      />
      <input
        type="file"
        className='mb-2 text-blue-600'
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setPhotoFile(file);
          }
        }}
      />
      <Button variant="contained" fullWidth color="primary" onClick={handleCreatePost} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Create Post'}
      </Button>

      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default CreatePost;
