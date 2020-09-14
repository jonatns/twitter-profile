import React from 'react';
import Router from 'next/router';

const Index = () => {
  React.useEffect(() => {
    Router.replace('/[screenName]', '/jonat_ns');
  }, []);

  return null;
};

export default Index;
