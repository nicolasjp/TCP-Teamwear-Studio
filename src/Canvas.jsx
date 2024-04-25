import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, AccumulativeShadows, RandomizedLight, Decal, Environment, Center } from '@react-three/drei'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { state } from './store'

export const App = ({ position = [0, 0, 2.5], fov = 25 }) => {
  const snap = useSnapshot(state)
  // console.log(snap.hoodie);

  return (
    <Canvas shadows camera={{ position, fov }} gl={{ preserveDrawingBuffer: true }} eventSource={document.getElementById('root')} eventPrefix="client">
      <ambientLight intensity={0.5} />
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
      <CameraRig>
        <Backdrop />
        <Center>
        {snap.hoodie ? <Hoodie /> : <Shirt />}
        </Center>
      </CameraRig>
    </Canvas>
  );
};

function Backdrop() {
  const shadows = useRef()
  useFrame((state, delta) => easing.dampC(shadows.current.getMesh().material.color, state.color, 0.25, delta))
  return (
    <AccumulativeShadows ref={shadows} temporal frames={60} alphaTest={0.85} scale={10} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.14]}>
      <RandomizedLight amount={4} radius={9} intensity={0.55} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  )
}

function CameraRig({ children }) {
  const group = useRef()
  const snap = useSnapshot(state)
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [snap.intro ? -state.viewport.width / 4 : 0, 0, 2.2], 0.25, delta)
    easing.dampE(group.current.rotation, [state.pointer.y / 10, -state.pointer.x / 5, 0], 0.25, delta)
  })
  return <group ref={group}>{children}</group>
}


function Hoodie(props) {
  const snap = useSnapshot(state)
  // console.log(snap.decal);
  const texture = useTexture(`./${snap.decal}.png`)
  const { nodes, materials } = useGLTF('./hoodieV3bis.glb')
  useFrame((state, delta) => easing.dampC(materials.colH.color, snap.color, 0.25, delta))
  return (
    <mesh position={[0, 0.03, 0]} scale={0.7} rotation={[0, -0.1, -0.01]} castShadow geometry={nodes.T_Shirt_male.geometry} material={materials.colH} material-roughness={1} {...props} dispose={null}>
      <Decal position={[0.11, 0.12, 0.24]} rotation={[0, 0, 0]} scale={0.22} map={texture} /*map-anisotropy={16}*/ />
    </mesh>
  )
}

// Hoodie
// function Hoodie(props) {
//   const snap = useSnapshot(state)
//   // console.log(snap.decal);
//   const texture = useTexture(`/${snap.decal}.png`)
//   const { nodes, materials } = useGLTF('/shirtMod3.glb')
//   useFrame((state, delta) => easing.dampC(materials.col.color, snap.color, 0.25, delta))
//   return (
//     <mesh position={[0, -0.01, 0]} scale={0.65} rotation={[0, -0.1, 0.02]} castShadow geometry={nodes.T_Shirt_male.geometry} material={materials.col} material-roughness={1} {...props} dispose={null}>
//       <Decal position={[0.12, 0.06, 0.24]} rotation={[0, 0, 0]} scale={0.2} map={texture} /*map-anisotropy={16}*/ />
//     </mesh>
//   )
// }

// function Hoodie(props) {
//   const snap = useSnapshot(state)
//   // console.log(snap.decal);
//   const texture = useTexture(`/${snap.decal}.png`)
//   const { nodes, materials } = useGLTF('/hoodieV3.glb')
//   useFrame((state, delta) => easing.dampC(materials.col.color, snap.color, 0.25, delta))
//   return (
//     <mesh position={[0, 0.08, 0]} scale={0.8} rotation={[0, -0.1, 0.02]} castShadow geometry={nodes.T_Shirt_male.geometry} material={materials.col} material-roughness={1} {...props} dispose={null}>
//       <Decal position={[0.12, 0.06, 0.24]} rotation={[0, 0, 0]} scale={0.2} map={texture} /*map-anisotropy={16}*/ />
//     </mesh>
//   )
// }



// T Shirt
function Shirt(props) {
  const snap = useSnapshot(state)
  const texture = useTexture(`./${snap.decal}.png`)
  const { nodes, materials } = useGLTF('./shirt_baked_collapsed.glb')
  useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta))
  return (
    <mesh position={[0, 0.04, 0]} scale={0.9} castShadow geometry={nodes.T_Shirt_male.geometry} material={materials.lambert1} material-roughness={1} {...props} dispose={null}>
      <Decal position={[-0.01, 0.04, 0.15]} rotation={[0, 0, 0]} scale={0.25} map={texture} /*map-anisotropy={16}*/ />
    </mesh>
  )
}


// Hoodie2
// function Shirt(props) {
//   const snap = useSnapshot(state)
//   // console.log(snap.decal);
//   const texture = useTexture(`/${snap.decal}.png`)
//   const { nodes, materials } = useGLTF('/hoodie.glb')
//   useFrame((state, delta) => easing.dampC(materials.matHood.color, snap.color, 0.25, delta))
//   return (
//     <mesh castShadow geometry={nodes.T_Shirt_male.geometry} material={materials.matHood} /*material-roughness={1}*/ {...props} dispose={null}>
//       <Decal position={[0.11, 0.08, 0.21]} rotation={[0, 0, 0]} scale={0.2} map={texture} /*map-anisotropy={16}*/ />
//     </mesh>
//   )
// }

useGLTF.preload('./shirtMod3.glb')
;['./logo.png', './logoV0.png', './logoV1.png', './logoV2.png', './logoV3.png', './logoV4.png'].forEach(useTexture.preload)
