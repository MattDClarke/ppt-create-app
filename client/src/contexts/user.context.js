import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { backendEndpoint } from '../config';

export const userContext = createContext({});
export function UserProvider({ children }) {
  const [userObject, setUserObject] = useState();
  const location = useLocation();

  useEffect(() => {
    axios({
      method: 'GET',
      // cross site access request, send cookie
      withCredentials: true,
      url: `${backendEndpoint}/getuser`,
    })
      .then((res) => {
        setUserObject(res.data);
      })
      .catch(function () {
        console.log('Error');
      });
    // Check UpdateName.js. If name changed, location state changed (passing success message), push to /create.
    // I want this effect to run so that the context state (over here) updates. Else I nav to account and old name shown
    // unless page refreshed.
  }, [location.state?.detail]);
  return (
    <userContext.Provider value={userObject}>{children}</userContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
