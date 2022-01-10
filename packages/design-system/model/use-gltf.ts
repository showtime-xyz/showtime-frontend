// https://github.com/pmndrs/drei/blob/master/src/core/useGLTF.tsx

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import { useLoader } from "./react-three-fiber";

let dracoLoader: DRACOLoader | null = null;

function extensions(
  useDraco: boolean | string,
  useMeshopt: boolean,
  extendLoader?: (loader: GLTFLoader) => void
) {
  return (loader) => {
    if (extendLoader) {
      extendLoader(loader as GLTFLoader);
    }
    if (useDraco) {
      if (!dracoLoader) {
        dracoLoader = new DRACOLoader();
      }
      dracoLoader.setDecoderPath(
        typeof useDraco === "string"
          ? useDraco
          : "https://www.gstatic.com/draco/versioned/decoders/1.4.3/"
      );
      (loader as GLTFLoader).setDRACOLoader(dracoLoader);
    }
    // if (useMeshopt) {
    //   (loader as GLTFLoader).setMeshoptDecoder(
    //     typeof MeshoptDecoder === "function" ? MeshoptDecoder() : MeshoptDecoder
    //   );
    // }
  };
}

export function useGLTF<T extends string | string[]>(
  path: T,
  useDraco: boolean | string = true,
  useMeshOpt: boolean = true,
  extendLoader?: (loader: GLTFLoader) => void
) {
  const gltf = useLoader(
    GLTFLoader,
    path,
    extensions(useDraco, useMeshOpt, extendLoader)
  );
  return gltf;
}

useGLTF.preload = (
  path: string | string[],
  useDraco: boolean | string = true,
  useMeshOpt: boolean = true,
  extendLoader?: (loader: GLTFLoader) => void
) =>
  useLoader.preload(
    GLTFLoader,
    path,
    extensions(useDraco, useMeshOpt, extendLoader)
  );

useGLTF.clear = (input: string | string[]) =>
  useLoader.clear(GLTFLoader, input);
