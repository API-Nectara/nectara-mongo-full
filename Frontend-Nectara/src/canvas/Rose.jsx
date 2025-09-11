import { useGLTF } from "@react-three/drei";

useGLTF.preload("/public/jasmine.glb");

const Rose = ({ scale = 2, position = [0, 0, 0] }) => {
  const { scene } = useGLTF("/public/jasmine.glb");

  return (
    <group position={position}>
      {/* Ajuste fino: bajar el modelo internamente */}
      <primitive object={scene} scale={scale} position={[0, -1.4, 0]} />
    </group>
  );
};

export default Rose;
