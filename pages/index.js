import { withRouter } from 'next/router';

export default withRouter(({ router }) => {
  router.push('/search');
  return null;
});
