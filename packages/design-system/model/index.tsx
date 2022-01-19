import React, { Suspense } from "react";

import { Canvas, useFrame } from "./react-three-fiber";
import { useGLTF } from "./use-gltf";
import { Image } from "design-system/image";

// import iphoneModelPath from "./iphone.glb";

type Props = {
  url: string;
  fallbackUrl: string;
  blurhash: string;
  count: number;
};

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  useFrame(() => (scene.rotation.y += 0.01));

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
  if (url.endsWith(".gltf")) {
    return (
      <Image
        source={{
          uri: fallbackUrl,
        }}
        tw={count > 1 ? "w-[50vw] h-[50vw]" : "w-[100vw] h-[100vw]"}
        blurhash={blurhash}
        resizeMode="cover"
      />
    );
  }

  console.log(url);

  return (
    <Canvas>
      <color attach="background" args={[0xe2f4df]} />
      <ambientLight />
      <directionalLight intensity={1.1} position={[0.5, 0, 0.866]} />
      <directionalLight intensity={0.8} position={[-6, 2, 2]} />
      <Suspense fallback={null}>
        <Model url={url} />
        {/* <Model url={iphoneModelPath} /> */}
      </Suspense>
    </Canvas>
  );
}

export { ModelViewer as Model };
