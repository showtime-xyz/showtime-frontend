export async function getServerSideProps({ query: { slug } }) {
  return {
    redirect: {
      destination: `/${slug}`,
      permanent: true,
    },
  };
}

const RedirectURL = () => null;

export default RedirectURL;
