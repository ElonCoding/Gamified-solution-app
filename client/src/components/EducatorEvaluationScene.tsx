import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll, Image } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { Suspense } from "react";

const AcademyCrest = () => {
    const scroll = useScroll();
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!group.current) return;

        const offset = scroll.offset;

        group.current.position.z = -offset * 30;
        group.current.position.x = Math.sin(offset * Math.PI * 2) * 2;
        group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5 + Math.cos(offset * Math.PI * 4) * 1;

        group.current.rotation.z = Math.cos(offset * Math.PI * 2) * -0.2;
        group.current.rotation.x = 0.1;
    });

    return (
        <group ref={group} dispose={null}>
            <Image
                url="/images/academy_crest.png"
                scale={[4, 4]}
                transparent
                position={[0, 0, 0]}
            />
        </group>
    );
};



const SceneContent = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00FFFF" />
            <pointLight position={[-10, 5, -10]} intensity={0.5} color="#0088FF" />

            <AcademyCrest />
        </>
    );
};

const EducatorEvaluationScene = () => {
    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <style>{`
                ::-webkit-scrollbar {
                    display: none;
                }
                * {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes scroll-pulse {
                    0%, 100% { opacity: 0.6; transform: translate(-50%, 0) scale(0.95); }
                    50% { opacity: 1; transform: translate(-50%, 0) scale(1.05); }
                }
                .animate-scroll-pulse {
                    animation: scroll-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
            <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
                <Suspense fallback={null}>
                    <ScrollControls pages={5} damping={0.2}>
                        <SceneContent />

                        <Scroll html style={{ width: '100%' }}>
                            <div className="w-full h-screen flex flex-col items-center justify-center p-10 pointer-events-none relative">
                                <h1 className="text-4xl md:text-6xl font-black text-white text-center drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
                                    ACADEMIC FLOW
                                </h1>
                                <div className="absolute bottom-10 left-1/2 flex flex-col items-center gap-2 animate-scroll-pulse">
                                    <span className="text-cyber-neon text-[10px] md:text-xs tracking-[0.2em] font-mono uppercase bg-black/60 px-3 py-1 rounded-full border border-cyber-neon/30 backdrop-blur-sm">
                                        Scroll to Explore
                                    </span>
                                    <div className="w-px h-8 bg-gradient-to-b from-cyber-neon to-transparent" />
                                </div>
                            </div>

                            <div className="w-full h-screen flex items-center justify-end p-20 pointer-events-none">
                                <div className="max-w-md text-right">
                                    <h2 className="text-3xl font-bold text-cyber-neon mb-4">Neural Grading</h2>
                                    <p className="text-lg text-gray-200 bg-black/50 p-6 rounded-xl backdrop-blur-md border border-white/10">
                                        Advanced OCR technology instantly digitizes handwritten test scripts.
                                        Capturing knowledge with quantum precision.
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-screen flex items-center justify-start p-20 pointer-events-none">
                                <div className="max-w-md text-left">
                                    <h2 className="text-3xl font-bold text-blue-400 mb-4">Fast-Track Eval</h2>
                                    <p className="text-lg text-gray-200 bg-black/50 p-6 rounded-xl backdrop-blur-md border border-white/10">
                                        Immediate score generation from semantic analysis.
                                        From submission to result in milliseconds.
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-screen flex items-center justify-end p-20 pointer-events-none">
                                <div className="max-w-md text-right">
                                    <h2 className="text-3xl font-bold text-cyber-neon mb-4">AR Milestone</h2>
                                    <p className="text-lg text-gray-200 bg-black/50 p-6 rounded-xl backdrop-blur-md border border-white/10">
                                        Visualize your academic achievements in your real-world space.
                                        3D Reward visualization initialized.
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-screen flex items-center justify-start p-20 pointer-events-none">
                                <div className="max-w-md text-left">
                                    <h2 className="text-3xl font-bold text-green-400 mb-4">Verified Certification</h2>
                                    <p className="text-lg text-gray-200 bg-black/50 p-6 rounded-xl backdrop-blur-md border border-white/10">
                                        Blockchain-verified academic records active.
                                        Only authorized educators release credential tokens.
                                    </p>
                                </div>
                            </div>
                        </Scroll>
                    </ScrollControls>
                </Suspense>
            </Canvas>
        </div>
    );
};

export default EducatorEvaluationScene;
