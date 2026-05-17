import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const MorphingConstellation = () => {
    const pointsRef = useRef();
    const particleCount = 2500; // Optimized for performance

    const targets = useMemo(() => {
        const chaos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const r = Math.pow(Math.random(), 0.5) * 60;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            chaos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            chaos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
            chaos[i * 3 + 2] = r * Math.cos(phi) * 0.5;
        }
        return { chaos };
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (pointsRef.current) {
            pointsRef.current.rotation.y = time * 0.05;
            pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={targets.chaos}
                    itemSize={3}
                />
            </bufferGeometry>
            <PointMaterial
                transparent
                color="#6c5dd3"
                size={0.2}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const AIModel = () => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -1,
            opacity: 0.95,
            pointerEvents: 'none'
        }}>
            <Canvas 
                camera={{ position: [0, 0, 30], fov: 35 }} 
                style={{ pointerEvents: 'none' }}
                dpr={[1, 1.5]} // Performance optimization for high-res screens
                gl={{ antialias: false, powerPreference: "high-performance" }}
            >
                <ambientLight intensity={0.5} />
                <MorphingConstellation />
            </Canvas>
        </div>
    );
};

export default AIModel;
