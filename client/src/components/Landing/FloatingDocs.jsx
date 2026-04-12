import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

const DocumentBox = ({ position, rotation, speed, scale, color, text }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Subtle floating rotation
    meshRef.current.rotation.x = rotation[0] + Math.sin(time * 0.1 * speed) * 0.2;
    meshRef.current.rotation.y = rotation[1] + Math.cos(time * 0.15 * speed) * 0.2;
    // Parallax effect based on scroll (simulated here with mouse for now, 
    // but we can pass real scroll offset later)
    meshRef.current.position.y += Math.sin(time * 0.2 * speed) * 0.002;
  });

  return (
    <Float speed={2 * speed} rotationIntensity={1.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[1, 1.4, 0.05]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.2}
          chromaticAberration={0.02}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={color}
          color={color}
          opacity={0.3}
          transparent
        />
        {/* Subtle text inside the glass */}
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.08}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.8}
          textAlign="center"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
          opacity={0.5}
        >
          {text}
        </Text>
      </mesh>
    </Float>
  );
};

const DocumentsScene = () => {
  const { viewport } = useThree();
  
  const documents = useMemo(() => {
    const docs = [];
    const legalKeywords = ["IPC 302", "Justice", "Constitution", "Verdict", "Appeal", "Evidence", "Affidavit", "Summons"];
    
    for (let i = 0; i < 15; i++) {
      docs.push({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 10,
          (Math.random() - 1) * 5
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        speed: 0.5 + Math.random(),
        scale: 0.8 + Math.random() * 0.5,
        color: i % 2 === 0 ? "#6c5dd3" : "#ff754c",
        text: legalKeywords[i % legalKeywords.length]
      });
    }
    return docs;
  }, []);

  return (
    <group>
      {documents.map((doc, i) => (
        <DocumentBox key={i} {...doc} />
      ))}
    </group>
  );
};

const FloatingDocs = () => {
    return (
        <div style={{ 
            width: '100%', 
            height: '100vh', 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            zIndex: -1,
            pointerEvents: 'none',
            background: 'radial-gradient(circle at 50% 50%, #1a1d2d 0%, #0b0d14 100%)'
        }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <DocumentsScene />
            </Canvas>
        </div>
    );
};

export default FloatingDocs;
