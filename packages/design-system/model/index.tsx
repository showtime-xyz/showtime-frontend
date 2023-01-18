import { Suspense } from "react";

import { Image, ResizeMode } from "@showtime-xyz/universal.image";
import { styled } from "@showtime-xyz/universal.tailwind";

import { useGLTF, Stage, OrbitControls } from "./react-three-drei";
import { Canvas, useFrame } from "./react-three-fiber";

export type Props = {
  url: string;
  fallbackUrl: string;
  tw?: string;
  blurhash?: string;
  resizeMode?: ResizeMode;
  numColumns: number;
  style?: object;
  width: number;
  height: number;
};

const StyledCanvas = styled(Canvas);

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
  style,
  numColumns,
  width,
  height,
}: Props) {
  if (fallbackUrl && numColumns > 1) {
    return (
      <Image
        source={{
          uri: fallbackUrl,
        }}
        tw={tw}
        style={style}
        blurhash={blurhash}
        resizeMode={resizeMode}
        width={width}
        height={height}
      />
    );
  }

  return (
    <StyledCanvas style={style} tw={`${tw} mx-auto`}>
      <ambientLight />
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
    </StyledCanvas>
  );
}

export { ModelViewer as Model };
