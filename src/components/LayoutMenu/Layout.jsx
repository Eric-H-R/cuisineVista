import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Sidebar from './SideBar';
import Topbar from './TopBar';
import { Outlet } from 'react-router-dom';

const Layout = ({children}) => {
  return (
     <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: "#f5f5f5",
            p: 3,
            mt: 8,
            overflowY: "auto",
          }}
        >
          {children}
           <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
