"use client";
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '@/lib/postsSlice';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { RootState } from '../lib/store';
import { useEffect, useState } from 'react';
import CreatePost from '@/_component/createpost/page';
import { createComment, updateComment, deleteComment } from '@/lib/commentSlice';
import { Box, Button, CircularProgress, TextField, Container, Menu, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { fetchUserProfile } from '@/lib/userProfileSlice';
import { deletePost, updatePost } from '@/lib/userPostsSlice';

interface ExpandMoreProps {
  expand: boolean;
  onClick: () => void;
  'aria-expanded': boolean;
  'aria-label': string;
}

const ExpandMore = ({ expand, onClick, ...other }: ExpandMoreProps) => (
  <IconButton {...other} onClick={onClick}>
    <CommentIcon />
  </IconButton>
);

const Home = () => {
  const dispatch = useDispatch();
  const { allposts, loading, error } = useSelector((state: RootState) => state.posts);
  const [commentContent, setCommentContent] = useState('');
  const token = useSelector((state: RootState) => state.auth.token);
  const [postId, setPostId] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const userProfile = useSelector((state: RootState) => state.userProfile.userInfo);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchUserProfile(token)); 
  }, [dispatch, token]);

  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const handleExpandClick = (postId: string) => {
    setExpandedId(expandedId === postId ? null : postId);
  };

  const [postSettingsAnchorEl, setPostSettingsAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handlePostSettingsClick = (event, postId) => {
    setPostSettingsAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handlePostSettingsClose = () => {
    setPostSettingsAnchorEl(null);
    setSelectedPostId(null);
  };

  const handlePostUpdate = async (postId, updatedBody, updatedPhotoFile) => {
    await dispatch(updatePost({ postId, body: updatedBody, photoFile: updatedPhotoFile }));
    handlePostSettingsClose();
  };

  const handlePostDelete = async (postId) => {
    await dispatch(deletePost({ postId }));
    handlePostSettingsClose();
  };

  const handleCommentSubmit = async (postId: string) => {
    if (commentContent.trim()) {
      await dispatch(createComment({ content: commentContent, postId, token }));
      console.log("Comment added successfully!");
      setCommentContent('');
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      await dispatch(updateComment({ commentId, content, token }));
      console.log('Comment updated successfully!');
      setEditingCommentId(null); 
      dispatch(fetchPosts());
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await dispatch(deleteComment({ commentId, token }));
      console.log('Comment deleted successfully!');
      dispatch(fetchPosts());
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <div className='w-full mx-auto flex justify-center items-center'>
        <p className='text-xl'>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <CreatePost />
      <Grid container justifyContent="center" sx={{ paddingInline: { xs: 2, sm: 0 }, marginTop: 3 }}>
        {allposts.map((post) => (
          <Grid item key={post._id} xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ maxWidth: 600, width: '100%', marginBottom: 10 }}>
              <CardHeader
                avatar={<Avatar alt={post.user.name} src={post.user.photo} />}
                action={
                  post.user._id === userProfile?._id && (
                    <IconButton aria-label="settings" onClick={(event) => handlePostSettingsClick(event, post._id)}>
                      <MoreVertIcon />
                    </IconButton>
                  )
                }
                title={
                  <Typography variant="h6" color="inherit" component="a" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {post.user.name}
                  </Typography>
                }
                subheader={`Posted on ${new Date(post.createdAt).toDateString()}`}
              />
              {post.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image}
                  alt="Post image"
                  style={{ width: '100%', objectFit: 'cover', height: '400px' }}
                />
              )}
              <CardContent sx={{ flex: '1 1 auto' }}>
                <Typography variant="body2" color="text.secondary">
                  {post.body}
                </Typography>
              </CardContent>
              <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
                <IconButton aria-label="add to favorites"><FavoriteIcon /></IconButton>
                <IconButton aria-label="share"><ShareIcon /></IconButton>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {post.comments.length}
                  </Typography>
                  <ExpandMore
                    expand={expandedId === post._id}
                    onClick={() => handleExpandClick(post._id)}
                    aria-expanded={expandedId === post._id}
                    aria-label="show comments"
                  />
                </div>
              </CardActions>
              <Collapse in={expandedId === post._id} timeout="auto" unmountOnExit>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Add a comment"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleCommentSubmit(post._id)}
                      sx={{ ml: 2, mb: 2, paddingBlock: 2 }}
                    >
                      Submit
                    </Button>
                  </Box>
                  <Typography paragraph>Comments:</Typography>
                  {post.comments.map((comment) => (
                    <div key={comment._id} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        <Avatar alt={comment.commentCreator.name} src={comment.commentCreator.photo} style={{ marginRight: 8 }} />
                        <Typography sx={{ fontSize: '16px' }} variant="body2" color="black">
                          {comment.commentCreator.name}
                        </Typography>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingInline: '50px', color: 'black' }}>
                        {editingCommentId === comment._id ? (
                          <Box display="flex" alignItems="center" ml={2}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              value={editedCommentContent}
                              onChange={(e) => setEditedCommentContent(e.target.value)}
                            />
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleUpdateComment(comment._id, editedCommentContent)}
                              sx={{ ml: 2 }}
                            >
                              Update
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleDeleteComment(comment._id)}
                              sx={{ ml: 2 }}
                            >
                              Delete
                            </Button>
                          </Box>
                        ) : (
                          <Typography sx={{ fontSize: '18px' }} variant="body2" color="text.secondary">
                            {comment.content}
                          </Typography>
                        )}
                        <div>
                          {editingCommentId !== comment._id && (
                            <>
                              <IconButton aria-label="like comment">
                                <FavoriteBorderIcon fontSize="small" />
                              </IconButton>
                              <IconButton aria-label="dislike comment">
                                <ThumbDownOffAltIcon fontSize="small" />
                              </IconButton>
                              {comment.commentCreator._id === userProfile?._id && (
                                <IconButton
                                  aria-label="settings"
                                  onClick={() => {
                                    setEditingCommentId(comment._id);
                                    setEditedCommentContent(comment.content);
                                  }}
                                >
                                  <SettingsIcon />
                                </IconButton>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Collapse>
              {/* Conditional rendering of update and delete buttons */}
              {post.user._id === userProfile?._id && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePostUpdate(post._id, post.body, null)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handlePostDelete(post._id)}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
        <Menu
          anchorEl={postSettingsAnchorEl}
          open={Boolean(postSettingsAnchorEl)}
          onClose={handlePostSettingsClose}
        >
          <MenuItem onClick={() => handlePostUpdate(selectedPostId, 'New body', null)}>Edit Post</MenuItem>
          <MenuItem onClick={() => handlePostDelete(selectedPostId)}>Delete Post</MenuItem>
        </Menu>
      </Grid>
    </>
  );
};

export default Home;
