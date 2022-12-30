import React, { useRef, useState } from "react";
import * as T from "three";
import { a } from "@react-spring/three";
import { Image as DreiImage } from "@react-three/drei/native";
import type { MeshProps } from "@react-three/fiber/native";
import { Canvas, useFrame } from "@react-three/fiber/native";

function Box(props: MeshProps) {
  const mesh = useRef<T.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "purple" : "royalblue"} />
    </mesh>
  );
}

export function DreiPic() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <DreiImage position={[-1.2, 1.4, 1]} url={"./assets/earth.jpeg"} />
      <Cubo position={[1.2, 0, 0]} color={"red"} />
    </Canvas>
  );
}

function Cubo(props: MeshProps) {
  const cubo = useRef<T.Mesh>(null);
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
      <a.mesh {...props}>
        <planeGeometry args={[2, 2]} />
        <a.meshStandardMaterial color={props.color} />
      </a.mesh>
    </>
  );
}
