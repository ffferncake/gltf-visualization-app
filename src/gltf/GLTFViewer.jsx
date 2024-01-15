import React, { useRef, useState } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import "../App.css";

const modelFiles = [
  "/models/smallHouseDesign.gltf",
  "/models/davika_house_th.gltf",
  "/models/smallHouse_2.gltf",
  "/models/Modular House by CPAC Low-Rise Building Solution.gltf",
  "/models/LHH.gltf",
];

function GLTFViewer() {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModelFileName, setCurrentModelFileName] = useState(
    modelFiles[0]
  );
  const [modelScale, setModelScale] = useState(0.08); // Set the default zoom level here
  const canvasRef = useRef();

  const loadNextModel = async () => {
    setIsLoading(true);
    const nextIndex = (currentModelIndex + 1) % modelFiles.length;
    const nextFileName = modelFiles[nextIndex];
    const nextModel = await new Promise((resolve) => {
      const loader = new GLTFLoader();
      loader.load(nextFileName, (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material.flatShading = true;
          }
        });
        resolve(gltf);
      });
    });
    setCurrentModelIndex(nextIndex);
    setCurrentModelFileName(nextFileName);
    setIsLoading(false);
    return nextModel;
  };

  const handleNextModel = async () => {
    await loadNextModel();
    canvasRef.current.scene = loadNextModel().scene;
    setModelScale(1); // Reset the model scale when changing models
  };

  const handlePreviousModel = () => {
    const prevIndex =
      (currentModelIndex - 1 + modelFiles.length) % modelFiles.length;
    setCurrentModelIndex(prevIndex);
    setModelScale(1); // Reset the model scale when changing models
  };

  // Function to zoom in (increase model scale)
  const zoomIn = () => {
    setModelScale(modelScale * 1.2); // You can adjust the scale factor as needed
  };

  // Function to zoom out (decrease model scale)
  const zoomOut = () => {
    setModelScale(modelScale / 1.2); // You can adjust the scale factor as needed
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 2, 0], rotation: [Math.PI, Math.PI, 0] }}
      >
        <directionalLight
          position={[3.3, 1.0, 4.4]}
          castShadow
          intensity={Math.PI * 2}
        />
        <primitive
          object={useLoader(GLTFLoader, modelFiles[currentModelIndex]).scene}
          position={[0, 0, 0]}
          rotation={[Math.PI, 0, 0]}
          scale={[modelScale, modelScale, modelScale]} // Apply the scale here
        />

        <OrbitControls />
        <axesHelper args={[5]} />
      </Canvas>

      {/* Conditional rendering of loading indicator */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "9999", // Ensure it's on top
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <div>Loading...</div>
          {/* You can add loading icons here */}
        </div>
      )}

      {/* Display current model file name */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: "9999", // Ensure it's on top
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        Current Model: {currentModelFileName}
      </div>

      <div style={{ position: "absolute", top: 60, left: 10 }}>
        <button onClick={handlePreviousModel}>Previous Model</button>
        <button onClick={handleNextModel}>Next Model</button>
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>
    </div>
  );
}

export default GLTFViewer;
