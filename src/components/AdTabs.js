import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import {
  MemoryRouter,
  Route,
  Routes,
  Link,
  matchPath,
  useLocation,
} from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import Ads from '../pages/MyAds/Ads'

function Router(props) {
  const { children } = props;
  if (typeof window === 'undefined') {
    return <StaticRouter location="/drafts">{children}</StaticRouter>;
  }

  return (
    <MemoryRouter initialEntries={['/drafts']} initialIndex={0}>
      {children}
    </MemoryRouter>
  );
}

Router.propTypes = {
  children: PropTypes.node,
};

function useRouteMatch(patterns) {
  const { pathname } = useLocation();

  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i];
    const possibleMatch = matchPath(pattern, pathname);
    if (possibleMatch !== null) {
      return possibleMatch;
    }
  }

  return null;
}

function MyTabs() {
  // You need to provide the routes in descendant order.
  // This means that if you have nested routes like:
  // users, users/new, users/edit.
  // Then the order should be ['users/add', 'users/edit', 'users'].
  const routeMatch = useRouteMatch(['/myads', '/favourites']);
  const currentTab = routeMatch?.pattern?.path;

  return (
    <Tabs value={currentTab} sx={{
      width: '100%', position: "absolute",
      top: "15%"
    }}>
      <Tab label="Ads" value="/myads" to="/myads" component={Link} />
      <Tab label="favourites" value="/favourites" to="/favourites" component={Link} />
    </Tabs>
  );
}

function CurrentRoute() {
  const location = useLocation();
  console.log(location.pathname)

  return (
    <>
      {location.pathname === "/myads" && <Ads />}
    </>
  );
}

export default function TabsRouter() {
  return (
    <Box  >
      <Routes>
        <Route path="*" element={<CurrentRoute />} />
      </Routes>
      <MyTabs />
    </Box>
  );
}

