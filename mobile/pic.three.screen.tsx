import * as React from "react";
import { Suspense } from "react";
import { TextureLoader, THREE } from "expo-three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber/native";
import pic from "./assets/necro.webp";
import earth from "./assets/earth.jpeg";
import earthImg from "./assets/earth.jpeg";
import bumpImg from "./assets/bump.jpeg";
import cloudImg from "./assets/cloud.png";
import { Group } from "three";
/** //todo: no transform-controls in native since it usues html dom by default
 * @see https://threejs.org/docs/#examples/en/controls/TransformControls
 * @see https://codesandbox.io/s/btsbj?file=/src/App.js:121-138
 */
import { TransformControls } from "@react-three/drei/native";

export function PicThreeScreen() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <pointLight position={[10, 10, 10]} />
        {/* <TransformControls mode="translate"> */}
          <Globe />
        {/* </TransformControls> */}
      </Suspense>
    </Canvas>
  );
}

function Globe() {
  const ref = React.useRef<Group>(null!);
  const map = useLoader(TextureLoader, earthImg) as THREE.Texture;
  const bumpMap = useLoader(TextureLoader, bumpImg) as THREE.Texture;
  useFrame(({ clock }) => {
    ref.current.rotation.y = -(clock.getElapsedTime() / 12);
  });
  return (
    <group ref={ref}>
      <rectAreaLight
        intensity={1}
        position={[10, 10, 10]}
        width={10}
        height={1000}
        onUpdate={(self) => self.lookAt(new THREE.Vector3(0, 0, 0))}
      />
      <rectAreaLight
        intensity={1}
        position={[-10, -10, -10]}
        width={1000}
        height={10}
        onUpdate={(self) => self.lookAt(new THREE.Vector3(0, 0, 0))}
      />
      <mesh visible castShadow position={[0, 0, 0]}>
        <sphereGeometry args={[2, 64, 32]} />
        <meshPhongMaterial map={map} bumpMap={bumpMap} />
      </mesh>
    </group>
  );
}

/** @see https://github.com/expo/expo-three#loading-a-texture */

function ThreeImage() {
  const earthMap = useLoader(TextureLoader, earth) as THREE.Texture;
  return (
    <mesh>
      <planeGeometry args={[3, 3]} />
      <meshPhongMaterial map={earthMap} />
    </mesh>
  );
}
