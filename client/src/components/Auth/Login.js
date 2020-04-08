import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogin } from 'react-google-login';
import { GraphQLClient} from 'graphql-request';
import Typography from "@material-ui/core/Typography";

import Context from '../../context';
import { ME_QUERY } from '../../graphql/queries';

import { OAUTH_CLIENT_ID, GRAPHQL_SERVER_URI } from '../../settings';

const Login = ({ classes }) => {

  const { dispatch } = useContext(Context);

  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(GRAPHQL_SERVER_URI, {
        headers: { authorization: idToken}
      });
      const data = await client.request(ME_QUERY);
      dispatch({type: 'LOGIN_USER', payload: data.me});
      dispatch({type: 'IS_LOGGED_IN', payload: googleUser.isSignedIn() })

    } catch (err) {
      onFailure(err);
    }
  }

  const onFailure = err => {
    console.error('Error logging in ', err);
  }

  return (
    <div className={classes.root}>
      <Typography
       component='h1' variant='h3'
       gutterBottom noWrap
       style={{ color: 'rgb(66,133,246)' }}>
        Welcome
      </Typography>
      <GoogleLogin clientId={OAUTH_CLIENT_ID} 
            onSuccess={onSuccess} isFailure={onFailure} 
            isSignedIn={true} theme={'dark'}
            buttonText='Login with Google'/>
    </div>
    );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
