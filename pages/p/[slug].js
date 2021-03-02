export async function getServerSideProps(context) {
  const { slug } = context.query;
  const { res } = context;
  res.writeHead(301, { location: `/${slug}` });
  res.end();
}

const RedirectURL = () => {
  return null;
};

export default RedirectURL;
