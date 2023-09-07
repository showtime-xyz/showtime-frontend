export { default } from "app/pages/creator-channels";

export async function getServerSideProps() {
  return {
    props: {
      meta: {
        deeplinkUrl: `/channels`,
      },
    },
  };
}
