import Error from 'next/error';
import { StatusCodes } from 'http-status-codes';
import React from 'react';
import { authStore } from '../../stores/authStore';

// inspired by https://stackoverflow.com/a/70071683
function withAuth<T>(Component: React.ComponentType<T>) {
  const Auth = (props: T) => {
    const authState = authStore((state) => state.authState);

    if (!authState) {
      return <Error statusCode={StatusCodes.UNAUTHORIZED} />;
    }

    return (
      <Component {...props} />
    );
  };

  return Auth;
}

export default withAuth;
