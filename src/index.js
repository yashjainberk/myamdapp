import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter here
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
    PublicClientApplication,
    EventType,
    EventMessage,
    AuthenticationResult,
} from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

//get initialize msalInstance
msalInstance.initialize().then(r => {
    console.log("msalInstance initialized");
});

const activeAccount = msalInstance.getActiveAccount();

if (!activeAccount) {
    // Account selection
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
    }
}

//set the account
msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const authenticationResult = event.payload;
        const account = authenticationResult.account;
        msalInstance.setActiveAccount(account);
    }
});

//enable account storage event
msalInstance.enableAccountStorageEvents();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* This is the only BrowserRouter you should have */}
      <App msalInstance={msalInstance}/>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
