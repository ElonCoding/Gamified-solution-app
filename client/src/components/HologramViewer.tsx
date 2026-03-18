import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, onLoaded }: { url: string; onLoaded?: () => void }) {
    // Handling potential missing URL for the initial load
    const { scene } = useGLTF(url || '/models/trophy.glb'); 
    const ref = useRef<THREE.Group>(null);

    useEffect(() => {
        if (scene && onLoaded) {
            onLoaded();
        }
    }, [scene, onLoaded]);

    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.5;
        }
    });

    return <primitive object={scene} ref={ref} />;
}

interface HologramViewerProps {
    modelUrl: string | null;
    onLoaded?: () => void;
}

const HologramViewer = ({ modelUrl, onLoaded }: HologramViewerProps) => {
    return (
        <div className="w-full h-full min-h-100 relative rounded-[40px] overflow-hidden border border-white/10 bg-edu-surface/30 backdrop-blur-3xl shadow-2xl">
            {/* Grid floor / Tech overlay */}
            <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />
            
            {/* Corner Bracket Accents */}
            <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-edu-primary/30 z-20 rounded-tl-xl" />
            <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-edu-primary/30 z-20 rounded-tr-xl" />
            <div className="absolute bottom-8 left-8 w-10 h-10 border-b-2 border-l-2 border-edu-primary/30 z-20 rounded-bl-xl" />
            <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-edu-primary/30 z-20 rounded-br-xl" />

            {modelUrl ? (
                <Canvas shadows dpr={[1, 2]} camera={{ position: [2, 2, 4], fov: 45 }}>
                    <color attach="background" args={['#0a0a0f']} />

                    <ambientLight intensity={1.5} />
                    <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
                    <directionalLight position={[-5, 5, -5]} intensity={1} />

                    <Suspense fallback={null}>
                        <Stage intensity={0.5} environment="city" adjustCamera={1.5}>
                            <Model url={modelUrl} onLoaded={onLoaded} />
                        </Stage>
                    </Suspense>

                    <OrbitControls 
                        makeDefault 
                        autoRotate 
                        autoRotateSpeed={1} 
                        enableZoom={false}
                        minPolarAngle={Math.PI / 4} 
                        maxPolarAngle={Math.PI / 2} 
                    />
                </Canvas>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-edu-primary/40 font-mono tracking-widest z-0">
                    <div className="w-12 h-12 border-2 border-edu-primary/20 border-t-edu-primary/60 rounded-full animate-spin" />
                    <div className="text-[10px] uppercase font-bold">Initializing Holographic Projection...</div>
                </div>
            )}
        </div>
    );
};

export default HologramViewer;
