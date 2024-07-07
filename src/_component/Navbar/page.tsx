"use client";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearAuthToken } from '@/lib/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { fetchUserProfile } from '@/lib/userProfileSlice';
import { useEffect, useState } from 'react';


const settings = ['Account',  'Logout'];

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  const userProfile = useSelector((state: RootState) => state.userProfile.userInfo);
  const handleLogout = () => {
    dispatch(clearAuthToken());
    localStorage.removeItem('userToken');
    router.push('/login');
  };
  useEffect(() => {
    dispatch(fetchUserProfile(token)); 
  }, [dispatch, token]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LibraryBooksIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            NextBook
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {token ? (
                <>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link href="/" passHref>
                      <Typography textAlign="center">Home</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link href="/profile" passHref>
                      <Typography textAlign="center">Profile</Typography>
                    </Link>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link href="/signup" passHref>
                      <Typography textAlign="center">Signup</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link href="/login" passHref>
                      <Typography textAlign="center">Login</Typography>
                    </Link>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {token ? (
              <>
                <Button
                  component={Link}
                  href="/"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Home
                </Button>
                <Button
                  component={Link}
                  href="/profile"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Profile
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/signup"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Signup
                </Button>
                <Button
                  component={Link}
                  href="/login"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Login
                </Button>
              </>
            )}
          </Box>

          {token && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src={`${userProfile?.photo}`} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem 
                    key={setting}  
                    onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}
                  >
                    {setting === 'Account' ? (
                      <Link href="/accountsetting" passHref>
                        <Typography textAlign="center">{setting}</Typography>
                      </Link>
                    ) : (
                      <Typography textAlign="center">{setting}</Typography>
                    )}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
