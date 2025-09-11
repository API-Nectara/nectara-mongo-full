import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";

useGLTF.preload("/public/mariposa_02.glb");

const Model = ({ scale = 1 }) => {
  const ref = useRef();
  const { scene, animations } = useGLTF("/public/mariposa_02.glb");
  const { actions } = useAnimations(animations, ref);

  useEffect(() => {
    if (actions && animations.length > 0) {
      actions[animations[0].name]?.play();
    }
  }, [actions, animations]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const radius = 1.2;
    const height = 2 + Math.sin(t * 3) * 0.3;

    ref.current.position.set(
      Math.cos(t) * radius,
      height,
      Math.sin(t) * radius
    );

    ref.current.rotation.set(
      0,
      Math.PI + t,
      Math.sin(t * 5) * 0.2
    );
  });

  return (
    <group ref={ref}>
      {/* Ajuste fino: reducir escala y centrar verticalmente */}
      <primitive object={scene} scale={0.02 * scale} position={[0, 2, 0]} />
    </group>
  );
};


export default Model;
