import { Suspense } from "react";
import { StyleSheet, ViewStyle } from "react-native";

import { ResizeMode } from "expo-av";

import { Image } from "@showtime-xyz/universal.image";
import { tw as tailwind } from "@showtime-xyz/universal.tailwind";

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
  style,
  numColumns,
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
      />
    );
  }

  return (
    <Canvas
      style={
        StyleSheet.flatten([
          tailwind.style("mx-auto"),
          tailwind.style(tw),
          style,
        ]) as ViewStyle
      }
    >
      <ambientLight />
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
    </Canvas>
  );
}

export { ModelViewer as Model };
