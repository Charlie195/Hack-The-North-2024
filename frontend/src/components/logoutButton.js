import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'antd';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (isAuthenticated &&
    <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="mr-4 mt-4 px-3 h-12 bg-grey rounded-lg shadow-lg font-semibold">
      Log Out
    </Button>
  );
};

export default LogoutButton;