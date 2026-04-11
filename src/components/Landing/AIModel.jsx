import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const MorphingConstellation = () => {
    const pointsRef = useRef();
    const particleCount = 8000;

    // Using refs for crucial animation data to avoid React state delays and jitter
    const targetRef = useRef(0);
    const phaseRef = useRef('drifting');
    const timerRef = useRef(0);

    const targets = useMemo(() => {
        const addPos = (arr, i, x, y, z) => {
            arr[i * 3] = x;
            arr[i * 3 + 1] = y;
            arr[i * 3 + 2] = z;
        };

        const chaos = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Chaos (Beautiful Galaxy/Nebula Distribution)
            // Use a mix of spherical and boxy to create a dense center and wide spray
            const r = Math.pow(Math.random(), 0.5) * 60;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            addPos(chaos, i,
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta) * 0.6, // Flattened galaxy look
                r * Math.cos(phi) * 0.5
            );
        }

        return { chaos };
    }, []);

    useFrame((state, delta) => {
        const positions = pointsRef.current.geometry.attributes.position.array;
        const time = state.clock.getElapsedTime();

        let targetPosArr = targets.chaos;
        let lerpSpeed = 0.005; // Very slow drift for elegance

        for (let i = 0; i < particleCount * 3; i++) {
            // Add a slow "living" wave to each particle
            const wave = Math.sin(time * 0.2 + (i % 100)) * 0.2;
            const shimmer = Math.sin(time * 2 + (i % 500)) * 0.02;

            // Lerp towards the initial chaos position but with wavy offsets
            positions[i] += (targetPosArr[i] - positions[i]) * lerpSpeed + shimmer + wave * 0.001;

            // Subtle expansion/contraction over time
            positions[i] *= (1 + Math.sin(time * 0.1) * 0.0001);
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.rotation.y = time * 0.05; // Slow ambient rotation
        pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={new Float32Array(targets.chaos)}
                    itemSize={3}
                />
            </bufferGeometry>
            <PointMaterial
                transparent
                color="#6c5dd3"
                size={0.16} // EVEN BIGGER PARTICLES as requested
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
            zIndex: 0,
            opacity: 0.95
        }}>
            <Canvas camera={{ position: [0, 0, 30], fov: 35 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2.5} />
                <MorphingConstellation />
            </Canvas>
        </div>
    );
};

export default AIModel;
