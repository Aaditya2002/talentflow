import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

const VoiceAnimation = () => {
    return (
        <Box
            sx={{
                position: 'relative',
                width: '600px',
                height: '600px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 8,
                mx: 'auto',
            }}
        >
            {/* Outer Circle with rotating arc */}
            <motion.div
                style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    border: '2px solid rgba(66, 153, 225, 0.2)',
                }}
            >
                {/* Rotating Arc */}
                <motion.div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '4px solid transparent',
                        borderTopColor: '#4299e1',
                        borderRightColor: '#4299e1',
                    }}
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </motion.div>

            {/* Center Blue Circle */}
            <motion.div
                style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    backgroundColor: '#4299e1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                animate={{
                    boxShadow: [
                        '0 0 20px rgba(66, 153, 225, 0.5)',
                        '0 0 40px rgba(66, 153, 225, 0.7)',
                        '0 0 20px rgba(66, 153, 225, 0.5)',
                    ]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <MicIcon sx={{ color: 'white', fontSize: 60 }} />
            </motion.div>

            {/* Audio Wave Visualization */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '80px',
                    display: 'flex',
                    gap: '3px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '300px',
                }}
            >
                {[...Array(30)].map((_, index) => (
                    <motion.div
                        key={`wave-${index}`}
                        style={{
                            width: '4px',
                            backgroundColor: '#4299e1',
                            borderRadius: '2px',
                        }}
                        animate={{
                            height: ['15px', '45px', '15px'],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: index * 0.05,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default VoiceAnimation; 