export { default } from "app/pages/notifications";

export async function getServerSideProps() {
  return {
    props: {
      meta: {
        deeplinkUrl: `/notifications`,
      },
    },
  };
}
