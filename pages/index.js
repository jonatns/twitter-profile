const Index = () => {
  return null;
};

Index.getInitialProps = ({ res }) => {
  if (res) {
    res.writeHead(301, {
      Location: '/search',
    });
    res.end();
  }

  return {};
};

export default Index;
