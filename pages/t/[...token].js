import { useState, useEffect } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../../components/layout";
import useAuth from "../../hooks/useAuth";
import useMyLikes from "../../hooks/useMyLikes";
import { useRouter } from "next/router";
import Select from "react-dropdown-select";
import backend from "../../lib/backend";
import Link from "next/link";
import LikeButton from "../../components/LikeButton";
import ShareButton from "../../components/ShareButton";
import TokenGrid from "../../components/TokenGrid";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app

export async function getServerSideProps(context) {
  const { token: token_array } = context.query;
  const contract_address = token_array[0];
  const token_id = token_array[1];

  const response_token = await backend.get(
    `/v1/token/${contract_address}/${token_id}`
  );
  const token = response_token.data.data;

  /*
  // Get list of collections
  const response_collection_list = await backend.get(`/v1/collection_list`);
  const collection_list = response_collection_list.data.data;

  const selected_collection =
    collection_list.filter((item) => item.value === collection).length > 0
      ? collection_list.filter((item) => item.value === collection)[0]
      : null;

  // Get collection items
  const response_collection_items = await backend.get(
    `/v1/collection?collection=${collection}&limit=40&order_by=${selected_collection.order_by}&order_direction=${selected_collection.order_direction}`
  );
  const collection_items = response_collection_items.data.data;
*/

  return {
    props: {
      token,
    }, // will be passed to the page component as props
  };
}

export default function Token({ token }) {
  //const [isChanging, setIsChanging] = useState(false);
  //const { collection } = router.query;

  const { user } = useAuth();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Set up my likes
  const [item, setItem] = useState(token);
  const [myLikes, setMyLikes] = useState([]);
  const [myLikesLoaded, setMyLikesLoaded] = useState(false);
  const { data: like_data } = useMyLikes(user, myLikesLoaded);
  useEffect(() => {
    if (like_data) {
      setMyLikesLoaded(true);
      setMyLikes(like_data.data);
    }
  }, [like_data]);

  return (
    <Layout key={item.asset_contract.address + "_" + item.token_id}>
      <Head>
        <title>{item.name}</title>
      </Head>

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto">{item.name}</div>
      </div>

      {lightboxOpen && (
        <Lightbox
          mainSrc={item.image_original_url}
          //nextSrc={images[(photoIndex + 1) % images.length]}
          //prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setLightboxOpen(false)}
          //enableZoom={false}
          /*
          onMovePrevRequest={() =>
            this.setState({
              photoIndex: (photoIndex + images.length - 1) % images.length,
            })
          }
          onMoveNextRequest={() =>
            this.setState({
              photoIndex: (photoIndex + 1) % images.length,
            })
          }*/
        />
      )}

      <div className="flex flex-row mt-8">
        <div className="flex w-2/3 pr-4">
          <div className="w-full" style={{ position: "relative" }}>
            <button
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: 10,
                margin: 10,
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 7,
              }}
              type="button"
              onClick={() => setLightboxOpen(true)}
              onMouseOver={() => setIsHovering(true)}
              onMouseOut={() => setIsHovering(false)}
              className="flex flex-row"
            >
              <img
                style={
                  isHovering
                    ? { opacity: 1, width: 20 }
                    : { opacity: 0.7, width: 20 }
                }
                src={"/icons/expand-white.svg"}
                alt="expand"
                className="flex"
              />
              <div
                className="flex ml-2"
                style={
                  isHovering
                    ? { opacity: 1, fontSize: 14 }
                    : { opacity: 0.7, fontSize: 14 }
                }
              >
                Original size
              </div>
            </button>
            <TokenGrid
              hasHero
              isDetail
              columnCount={1}
              items={[item]}
              myLikes={myLikes}
              setMyLikes={setMyLikes}
            />
          </div>
        </div>
        <div className="flex w-1/3  pl-4">
          <p>
            {item.creator ? (
              <>
                {"Created by "}

                <Link href="/p/[slug]" as={`/p/${item.creator.address}`}>
                  <a className="showtime-link">
                    {item.creator.user && item.creator.user.username
                      ? item.creator.user.username
                      : "[Unnamed]"}
                  </a>
                </Link>
              </>
            ) : (
              "\u00A0"
            )}
            <br />
            Owned by{" "}
            {item.owner ? (
              <Link href="/p/[slug]" as={`/p/${item.owner.address}`}>
                <a className="showtime-link">
                  {item.owner.user ? item.owner.user.username : "[Unnamed]"}
                </a>
              </Link>
            ) : null}
            <br />
            <br />
            <a
              href={`https://opensea.io/assets/${item.asset_contract.address}/${item.token_id}`}
              target="_blank"
              class="showtime-white-button-icon"
            >
              <span>View on OpenSea</span>
              <img
                style={{ paddingLeft: 6, width: 20, height: 20 }}
                src={"/icons/external-link-alt-solid.svg"}
                alt="external"
              />
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
