import React, { Suspense } from "react";

import { Canvas, useFrame } from "./react-three-fiber";
import { useGLTF } from "./use-gltf";
import { Image } from "design-system/image";

type Props = {
  url: string;
  fallbackUrl: string;
  blurhash: string;
  count: number;
};

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  // useFrame(() => (scene.rotation.y += 0.01));

  return <primitive object={scene} />;
}

// TODO: implement touch events à la `OrbitControls`
// Event (prop)	Description	Implementation
// onPointerOver	called when mouse hover starts	onHoverIn
// onPointerOut	called when mouse hover ends	onHoverOut
// onClick	called when press triggers	onPress
// onPointerDown	called when press starts	onPressIn
// onPointerUp	called when press ends	onPressOut
// onPointerMove	called when press moves	onPressMove

function ModelViewer({ url, fallbackUrl, blurhash, count }: Props) {
  // return (
  //   <Image
  //     source={{
  //       uri: fallbackUrl,
  //     }}
  //     tw={count > 1 ? "w-[50vw] h-[50vw]" : "w-[100vw] h-[100vw]"}
  //     blurhash={blurhash}
  //     resizeMode="cover"
  //   />
  // );

  return (
    <Canvas>
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
    </Canvas>
  );
}

export { ModelViewer as Model };
