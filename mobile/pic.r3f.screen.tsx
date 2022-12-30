// import { TextureLoader } from "three";
import { TextureLoader, THREE } from 'expo-three';
import React, { Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber/native";
import pic from "./assets/earth.jpeg";

function R3fImage() {
  const texture = useLoader(TextureLoader, pic) as THREE.Texture;
  return (
    <mesh visible>
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
