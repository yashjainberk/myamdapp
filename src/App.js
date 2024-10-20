import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';

function App({ msalInstance }) {
  const navigate = useNavigate();

  useEffect(() => {
    msalInstance.handleRedirectPromise().then((response) => {
      if (response && response.account) {
        // User is authenticated, you can proceed to  app
        // navigate("/Dashboard", { replace: true });
      }
    });
    // Check if the user is already signed in
    const account = msalInstance.getActiveAccount();
    if (account) {
      // User is already signed in, you can proceed to  app
      // navigate("/Dashboard", { replace: true });
    } else {
      // If the user is not signed in, initiate the login process
      msalInstance.initialize();
    }
  }, []);


  return (
      <Dashboard />
  );
}

export default App;
