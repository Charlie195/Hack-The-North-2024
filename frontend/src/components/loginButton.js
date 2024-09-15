import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'antd';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (!isAuthenticated && <Button onClick={() => loginWithRedirect()} className="text-black mr-4 mt-4 px-3 h-12 bg-grey rounded-lg shadow-lg font-semibold" >Log In</Button>);
};

export default LoginButton;