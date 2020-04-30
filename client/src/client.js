// Includes the hooks for the GraphQLclient that other components can reuse

import { useState, useEffect } from 'react';
import { GraphQLClient } from 'graphql-request';

import { GRAPHQL_SERVER_URI } from './settings';

// Creating useClient hook
export const useClient = () => {
    const [ idToken, setIdToken ] = useState('');
    
    useEffect(() => {
        const token = window.gapi.auth2.getAuthInstance()
                        .currentUser.get().getAuthResponse().id_token;
        setIdToken(token);
    }, [])

    return new GraphQLClient(GRAPHQL_SERVER_URI, {
        headers: { authorization: idToken }
      });
}
