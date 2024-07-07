'use client'
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../../lib/userProfileSlice';
import { fetchUserPosts, updatePost, deletePost } from '../../lib/userPostsSlice';
import { createComment, updateComment, deleteComment } from '../../lib/commentSlice';
import { RootState } from '../../lib/store';
import { useState, useEffect } from 'react';
import {Container,Box,Card,CardHeader,CardMedia,CardContent,CardActions,Collapse,Avatar,IconButton,Typography,Grid,CircularProgress,
  TextField,
Button,Menu,MenuItem,Snackbar} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import Account from '../accountsetting/page';

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

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userInfo, loading: profileLoading, error: profileError } = useSelector((state: RootState) => state.userProfile);
  const { posts, loading: postsLoading, error: postsError } = useSelector((state: RootState) => state.userPosts);
  const token = useSelector((state: RootState) => state.auth.token);
  const [commentContent, setCommentContent] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const [postSettingsAnchorEl, setPostSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatedPostContent, setUpdatedPostContent] = useState<string>(''); // State to hold updated post content

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(fetchUserPosts({ userId: userInfo._id, limit: 50 }));
    }
  }, [dispatch, userInfo]);

  const handleCommentSubmit = async (postId: string) => {
    if (commentContent.trim()) {
      await dispatch(createComment({ content: commentContent, postId, token }));
      setCommentContent('');
      dispatch(fetchUserPosts({ userId: userInfo._id, limit: 50 }));
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      await dispatch(updateComment({ commentId, content, token }));
      setEditingCommentId(null);
      dispatch(fetchUserPosts({ userId: userInfo._id, limit: 50 }));
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await dispatch(deleteComment({ commentId, token }));
      dispatch(fetchUserPosts({ userId: userInfo._id, limit: 50 }));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleExpandClick = (postId: string) => {
    setExpandedId(expandedId === postId ? null : postId);
  };

  const handlePostSettingsClick = (event: React.MouseEvent<HTMLElement>, postId: string) => {
    setPostSettingsAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handlePostSettingsClose = () => {
    setPostSettingsAnchorEl(null);
    setSelectedPostId(null);
  };

  const handlePostUpdate = async (postId: string, body: string, image: File | null) => {
    handlePostSettingsClose(); 
    try {
      await dispatch(updatePost({ postId, body, image, token }));
      dispatch(fetchUserPosts({ userId: userInfo._id, limit: 50 }));
    } catch (error) {
      console.error('Failed to update post:', error);
      setError('Failed to update post');
    }
  };

  const handlePostDelete = async (postId: string) => {
    try {
      await dispatch(deletePost({ postId, token }));
      handlePostSettingsClose(); 
      dispatch(fetchUserPosts({ userId: userInfo._id, limit: 50 }));
    } catch (error) {
      console.error('Failed to delete post:', error);
      setError('Failed to delete post');
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (profileLoading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // if (profileError) {
  //   return (
  //     <Container maxWidth="md">
  //       <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
  //         <Typography variant="h5" gutterBottom>
  //           Error: {profileError}
  //         </Typography>
  //       </Box>
  //     </Container>
  //   );
  // }

  return (
    <>
    <Container sx={{ marginTop: '30px' }} maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center">
                {userInfo && (
                  <>
                    <Avatar alt="User Avatar" src={userInfo.photo} sx={{ width: '50%', height: 200, mb: 1 }} />
                    <Typography variant="h6" component="div" align="center">
                      {userInfo.name}
                    </Typography>
                    <Typography variant="body1" align="center">
                      Email: {userInfo.email}
                    </Typography>
                    <Typography variant="body1" align="center">
                      Date of Birth: {userInfo.dateOfBirth}
                    </Typography>
                    <Typography variant="body1" align="center">
                      Gender: {userInfo.gender}
                    </Typography>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
          <Account/>

        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Posts</Typography>
              {postsLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" height={100}>
                  <CircularProgress />
                </Box>
              )}
              {postsError && (
                <Typography variant="body1">Failed to load user posts: {postsError}</Typography>
              )}
              {!postsLoading && !postsError && posts.length === 0 && (
                <Typography variant="body1">No posts yet.</Typography>
              )}
              {posts.length > 0 &&
                posts.map((post) => (
                  <Card key={post?._id} sx={{ marginBottom: '20px' }}>
                    <CardHeader
                      avatar={<Avatar alt={post?.user?.name} src={post?.user?.photo} />}
                      action={
                        <IconButton aria-label="settings" onClick={(event) => handlePostSettingsClick(event, post._id)}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={post?.user?.name}
                      subheader={new Date(post?.createdAt).toLocaleString()}
                    />
                    {post?.image && <CardMedia component="img" height="194" image={post?.image} alt="Post image" />}
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {selectedPostId === post._id ? (
                          <>
                            <TextField
                              fullWidth
                              variant="outlined"
                              defaultValue={post.body}
                              onChange={(e) => {
                                setUpdatedPostContent(e.target.value); 
                              }}
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handlePostUpdate(post._id, updatedPostContent, null)}
                              sx={{ mt: 1 }}
                            >
                              Update
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              sx={{ mt: 1 }}
                              onClick={() => handlePostDelete(post._id)}
                            >
                              Delete
                            </Button>
                          </>
                        ) : (
                          post?.body
                        )}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton aria-label="add to favorites">
                        <FavoriteBorderIcon />
                      </IconButton>
                      <IconButton aria-label="share">
                        <ShareIcon />
                      </IconButton>
                      <div style={{ flexGrow: 1 }} />
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {post?.comments?.length}
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
                              <Avatar
                                alt={comment.commentCreator.name}
                                src={comment.commentCreator.photo}
                                style={{ marginRight: 8 }}
                              />
                              <Typography variant="subtitle2">{comment.commentCreator.name}</Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingInline: '50px',
                                color: 'black'
                              }}
                            >
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
                                    {comment.commentCreator._id === userInfo?._id && (
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
                  </Card>
                ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={error}
      />
    </Container>
    </>
  );
};

export default UserProfile;