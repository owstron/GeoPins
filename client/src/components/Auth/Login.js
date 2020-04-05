import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogin } from 'react-google-login';
import { GraphQLClient} from 'graphql-request';
// import Typography from "@material-ui/core/Typography";

require('dotenv').config();

const GRAPHQL_SERVER_URI = 'http://localhost:4000/graphql';
const ME_QUERY = `
{
  me{
    _id
    name
    email
    picture
  }
}
`;

const Login = ({ classes }) => {
  const onSuccess = async googleUser => {
    const idToken = googleUser.getAuthResponse().id_token;
    const client = new GraphQLClient(GRAPHQL_SERVER_URI, {
      headers: { authorization: idToken}
    });
    const data = await client.request(ME_QUERY);
    console.log({data});
  }
  return <GoogleLogin clientId='49234056293-khtnao83br3kj6dvg3v109960uo62ic0.apps.googleusercontent.com' 
          onSuccess={onSuccess} isSignedIn={true}/>;
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
