import * as THREE from "three";
import React, { Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import pic from "./assets/necro.webp";

function R3fImage() {
  const texture = useLoader(THREE.TextureLoader, pic) as THREE.Texture;
  return (
    <mesh>
      <planeGeometry attach="geometry" args={[3, 3]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
}

export function PicR3f() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <R3fImage />
      </Suspense>
    </Canvas>
  );
}
