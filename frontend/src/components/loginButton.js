import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'antd';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (!isAuthenticated && <Button onClick={() => loginWithRedirect()} className="fixed bottom-40 left-1/2 transform -translate-x-1/2 text-black mr-4 mt-4 px-10 py-10 h-12 bg-grey rounded-lg shadow-lg font-bold text-4xl" >Log In</Button>);
};

export default LoginButton;