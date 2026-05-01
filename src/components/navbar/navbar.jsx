// components/navbar/ModernNavbar.js
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useScrollTrigger, Slide } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../controller/reducer/reducer';

const navItems = [
  { label: 'Home', to: '/', ariaLabel: 'Home', hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' } }
];
const protectedItems = [
  { label: 'Home', to: '/', ariaLabel: 'Home', hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' } },
  { label: 'Itinerary', to: '/itineraries', ariaLabel: 'Itinerary', hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' } },
  { label: 'Expenses', to: '/expenses', ariaLabel: 'Expenses', hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' } },
  { label: 'Pictures', to: '/pictures', ariaLabel: 'Pictures', hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' } },
];

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return <Slide appear={false} direction="down" in={!trigger}>{children}</Slide>;
}

function ModernNavbar(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  
  // State for mobile menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    handleMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  // Mobile menu items
  const mobileMenuItems = isLoggedIn
    ? [
        ...protectedItems,
        { label: 'Logout', action: handleLogout }
      ]
    : [
        ...navItems,
        { label: 'Login', to: '/login' },
        { label: 'Sign up', to: '/signup' }
      ];

  const desktopButtons = (
    <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2, alignItems: 'center' }}>
      {!isLoggedIn
        ? navItems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              to={item.to}
              aria-label={item.ariaLabel}
              sx={{
                color: '#333',
                fontWeight: 500,
                textTransform: 'capitalize',
                '&:hover': {
                  backgroundColor: item.hoverStyles.bgColor,
                  color: item.hoverStyles.textColor,
                  borderRadius: 2,
                },
              }}
            >
              {item.label}
            </Button>
          ))
        : protectedItems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              to={item.to}
              aria-label={item.ariaLabel}
              sx={{
                color: '#333',
                fontWeight: 500,
                textTransform: 'capitalize',
                '&:hover': {
                  backgroundColor: item.hoverStyles.bgColor,
                  color: item.hoverStyles.textColor,
                  borderRadius: 2,
                },
              }}
            >
              {item.label}
            </Button>
          ))}

      {!isLoggedIn ? (
        <>
          <Button component={Link} to="/login" sx={{ color: '#333', fontWeight: 500 }}>
            Login
          </Button>
          <Button
            component={Link}
            to="/signup"
            sx={{
              backgroundColor: '#3b82f6',
              color: '#fff',
              fontWeight: 600,
              px: 2,
              borderRadius: 2,
              '&:hover': { backgroundColor: '#2563eb' },
            }}
          >
            Sign up
          </Button>
        </>
      ) : (
        <Button
          onClick={handleLogout}
          sx={{
            backgroundColor: '#ef4444',
            color: '#fff',
            fontWeight: 600,
            px: 2,
            borderRadius: 2,
            '&:hover': { backgroundColor: '#dc2626' },
          }}
        >
          Logout
        </Button>
      )}
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar
          component="nav"
          color="transparent"
          elevation={0}
          sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.8)' }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ fontWeight: 'bold', cursor: 'pointer', color: '#111', textDecoration: 'none' }}
            >
              Test
            </Typography>

            {desktopButtons}

            {/* Mobile menu */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                aria-controls={open ? 'mobile-menu' : undefined}
                aria-haspopup="true"
                onClick={handleMenuOpen}
                sx={{ color: '#333' }}
              >
                <MenuIcon />
              </IconButton>
              
              <Menu
                id="mobile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'mobile-menu',
                }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    borderRadius: 2,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  }
                }}
              >
                {mobileMenuItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={() => {
                      if (item.to) {
                        handleNavigation(item.to);
                      } else if (item.action) {
                        item.action();
                      }
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      '&:hover': {
                        backgroundColor: item.hoverStyles?.bgColor || '#f3f4f6',
                        color: item.hoverStyles?.textColor || 'inherit',
                      }
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </Box>
  );
}

ModernNavbar.propTypes = {
  window: PropTypes.func,
};

export default ModernNavbar;