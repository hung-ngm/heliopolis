import { Default } from 'components/layouts/Default';
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';

const HomePage: NextPage = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const { pathname } = Router;
    if (pathname === '/') {
      Router.push('/marketplace/explore');
    } else {
      setLoaded(true);
    }
  }, []);

  if (!loaded) {
    return (
      <Default pageName="Home">
        <></>
      </Default>
    );
  }
  return <></>;
};

export default HomePage;
