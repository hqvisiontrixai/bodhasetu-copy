"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Flower() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const W = containerRef.current.clientWidth;
const H = containerRef.current.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 1);
    containerRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.01, 100);
    camera.position.set(2, 1, 4);
camera.lookAt(0, 0.3, 0);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xd0eeff,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });

    const wireBrightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.95,
    });

    const group = new THREE.Group();
    scene.add(group);

    function buildPetal(length: number, width: number, curvature: number, segments: number) {
      const geo = new THREE.BufferGeometry();
      const segsU = segments;
      const segsV = segments;
      const positions: number[] = [];
      const indices: number[] = [];

      for (let iu = 0; iu <= segsU; iu++) {
        const t = iu / segsU;
        const halfW = width * Math.sin(Math.PI * t) * 0.5;
        const z = length * t;
        const y = curvature * Math.sin(Math.PI * t) * t;

        for (let iv = 0; iv <= segsV; iv++) {
          const s = (iv / segsV) * 2 - 1;
          const x = halfW * s;
          const cup = 0.18 * (1 - s * s) * Math.sin(Math.PI * t);
          positions.push(x, y + cup, z);
        }
      }

      for (let iu = 0; iu < segsU; iu++) {
        for (let iv = 0; iv < segsV; iv++) {
          const a = iu * (segsV + 1) + iv;
          const b = a + segsV + 1;
          indices.push(a, b, a + 1);
          indices.push(b, b + 1, a + 1);
        }
      }

      geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return geo;
    }

    function buildInnerPetal(length: number, width: number, curvature: number, segments: number) {
      return buildPetal(length, width, curvature, segments);
    }

    const OUTER_COUNT = 7;
    for (let i = 0; i < OUTER_COUNT; i++) {
      const angle = (i / OUTER_COUNT) * Math.PI * 2;
      const tilt = 0.55;
      const geo = buildPetal(1.55, 0.82, 0.28, 14);
      const mesh = new THREE.Mesh(geo, wireMat);
      mesh.rotation.y = -angle;
      mesh.rotation.x = tilt;
      mesh.rotation.z = (Math.random() - 0.5) * 0.12;
      group.add(mesh);
    }

    const MID_COUNT = 6;
    for (let i = 0; i < MID_COUNT; i++) {
      const angle = ((i + 0.5) / MID_COUNT) * Math.PI * 2;
      const tilt = 0.28;
      const geo = buildInnerPetal(1.15, 0.6, 0.42, 12);
      const mesh = new THREE.Mesh(geo, wireMat);
      mesh.rotation.y = -angle;
      mesh.rotation.x = tilt;
      group.add(mesh);
    }

    const INNER_COUNT = 5;
    for (let i = 0; i < INNER_COUNT; i++) {
      const angle = (i / INNER_COUNT) * Math.PI * 2;
      const tilt = 0.06;
      const geo = buildInnerPetal(0.75, 0.36, 0.6, 10);
      const mesh = new THREE.Mesh(geo, wireBrightMat);
      mesh.rotation.y = -angle;
      mesh.rotation.x = tilt;
      group.add(mesh);
    }

    const stamenGeo = new THREE.SphereGeometry(0.22, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const stamen = new THREE.Mesh(stamenGeo, wireBrightMat);
    stamen.position.y = 0.04;
    group.add(stamen);

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const lineGeo = new THREE.BufferGeometry();
      const r0 = 0.22, r1 = 0.38 + Math.random() * 0.1;
      lineGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([
          Math.cos(a) * r0 * 0.7, 0.18, Math.sin(a) * r0 * 0.7,
          Math.cos(a) * r1, 0.08 + Math.random() * 0.22, Math.sin(a) * r1,
        ], 3)
      );
      const line = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 })
      );
      group.add(line);
    }

    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.08, -0.6, 0),
      new THREE.Vector3(0.12, -1.4, 0),
      new THREE.Vector3(0.05, -2.2, 0),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 20, 0.018, 5, false);
    const stem = new THREE.Mesh(
      stemGeo,
      new THREE.MeshBasicMaterial({ color: 0xb0d8ef, wireframe: true, transparent: true, opacity: 0.7 })
    );
    group.add(stem);

    group.rotation.z = 0.25;
    group.rotation.x = -0.01;
    group.position.y = 0.40;

    const glowGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.045,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(0, 0.15, 0);
    group.add(glow);

    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.004;
      group.rotation.y = t * 0.18;
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
  if (!containerRef.current) return;

  const w = containerRef.current.clientWidth;
  const h = containerRef.current.clientHeight;
  
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} 
//   style={{ width: "100vw", height: "100vh" }} 
className="w-full h-full"
  />;
}
