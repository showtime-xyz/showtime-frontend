import { Suspense } from "react";

import { Image } from "design-system/image";

import { useGLTF, Stage, OrbitControls } from "./react-three-drei";
import { Canvas, useFrame } from "./react-three-fiber";

type Props = {
  url: string;
  fallbackUrl: string;
  tw?: string;
  blurhash?: string;
  resizeMode?: "contain" | "cover";
  numColumns: number;
};

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  useFrame(() => (scene.rotation.y += 0.01));

  scene.scale.setScalar(1000);

  return (
    <Stage
      shadows
      adjustCamera
      intensity={1}
      environment="city"
      preset="rembrandt"
    >
      <primitive object={scene} />
      <OrbitControls enableZoom={false} />
    </Stage>
  );
}

// TODO: implement touch events à la `OrbitControls`
// https://docs.pmnd.rs/react-three-fiber/api/events

// Event (prop)	Description	Implementation
// onPointerOver	called when mouse hover starts	onHoverIn
// onPointerOut	called when mouse hover ends	onHoverOut
// onClick	called when press triggers	onPress
// onPointerDown	called when press starts	onPressIn
// onPointerUp	called when press ends	onPressOut
// onPointerMove	called when press moves	onPressMove

function ModelViewer({
  url,
  fallbackUrl,
  tw,
  blurhash,
  resizeMode,
  numColumns,
}: Props) {
  if (fallbackUrl && numColumns > 1) {
    return (
      <Image
        source={{
          uri: fallbackUrl,
        }}
        tw={tw}
        blurhash={blurhash}
        resizeMode={resizeMode}
      />
    );
  }

  return (
    <Canvas>
      <ambientLight />
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
    </Canvas>
  );
}

export { ModelViewer as Model };
