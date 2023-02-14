import { config, useSpring } from "@react-spring/native";
import { a } from "@react-spring/three";
import {
  Canvas,
  MeshProps,
  useFrame,
  useThree,
} from "@react-three/fiber/native";
import { useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import * as T from "three";

export function SpringR3f() {
  return (
    <Canvas>
      <ambientLight />
      <Cubo position={[-1.2, 0, 0]} color={"green"} />
      <Cubo position={[1.2, 0, 0]} color={"red"} />
    </Canvas>
  );
}

function Cubo(props: MeshProps & { color: string }) {
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  //
  //   const [active, setActive] = useState(0);
  const cubo = useRef<T.Mesh>(null);
  const { pos } = useSpring({
    to: {
      pos: 0,
    },
    from: { pos: -20 },
    config: config.molasses,
  });
  const { scale } = useSpring({ scale: active ? 2 : 1 });
  const { rotation } = useSpring({ rotation: active ? Math.PI : 0 });
  const { colorA } = useSpring({ colorA: active ? "royalblue" : props.color });

  const { viewport } = useThree();
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
      <a.mesh
        {...props}
        rotation-x={rotation}
        scale={scale}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <a.meshStandardMaterial color={colorA} />
      </a.mesh>
    </>
  );
}
