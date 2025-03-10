"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/**
 * Generate a small circular sprite in memory.
 * We'll use this as the 'map' for the points, so they appear round.
 */
function useCircleTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Draw a circle in the center
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

/**
 * A procedural "galaxy" made of points.
 */
function Galaxy({
  count = 20000,
  branches = 5,
  radius = 5,
  insideColor = "#f25d62",
  outsideColor = "#5c60c6",
  spin = 1.5,
  randomness = 1.5,
}) {
  const pointsRef = useRef();
  const circleTexture = useCircleTexture(); // Our circular sprite

  // Generate positions and colors for all points
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorInside = new THREE.Color(insideColor);
    const colorOutside = new THREE.Color(outsideColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.random() ** 1.5 * radius;
      const branch = i % branches;
      const branchAngle = (branch / branches) * 2 * Math.PI;
      const spinAngle = r * spin;
      const randomX = (Math.random() - 0.5) * randomness;
      const randomY = (Math.random() - 0.5) * randomness * 0.5;
      const randomZ = (Math.random() - 0.5) * randomness;

      positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      const mixedColor = colorInside.clone().lerp(colorOutside, r / radius);
      colors[i3 + 0] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    const galaxyGeometry = new THREE.BufferGeometry();
    galaxyGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return galaxyGeometry;
  }, [count, branches, radius, insideColor, outsideColor, spin, randomness]);

  // Slow rotation of the galaxy
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        // Use circular sprite for round points
        map={circleTexture}
        // Make points opaque
        opacity={0.90}
        transparent={true}
        // Increase size for better visibility
        size={0.05}
        sizeAttenuation
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * GalaxyScene renders the galaxy in a Canvas that fills its container.
 */
export default function GalaxyScene() {
  return (
    <Canvas
      gl={{ alpha: true }}
      // Move the camera closer and narrow the FOV to zoom in by default
      camera={{ position: [0, 20, 0], fov:10 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
    >
      <ambientLight intensity={0.1} />
      <directionalLight position={[1, 8, 10]} intensity={0.1} />
      <Galaxy
        count={25000}
        branches={1}
        radius={4}
        insideColor="#1C90BF"
        outsideColor="#5c60c6"
        spin={5.0}
        randomness={1.0}
      />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
