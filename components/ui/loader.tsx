"use client"
import React from 'react'
import { motion } from 'framer-motion'

interface SpiralLoaderProps {
  size?: number
  color?: string
}

const SpiralLoader: React.FC<SpiralLoaderProps> = ({ 
  size = 50, 
  color = '#10B981' 
}) => {
  const dotCount = 8
  const spiralRadius = size / 2

  return (
    <div 
      className="flex items-center justify-center"
      style={{ 
        width: `${size}px`, 
        height: `${size}px` 
      }}
    >
      {[...Array(dotCount)].map((_, index) => {
        const progress = index / (dotCount - 1)
        const angle = progress * Math.PI * 3 // Multiple spiral rotations
        
        const x = Math.cos(angle) * spiralRadius * progress
        const y = Math.sin(angle) * spiralRadius * progress

        return (
          <motion.div
            key={index}
            className="absolute rounded-full"
            style={{
              width: `${size / dotCount}px`,
              height: `${size / dotCount}px`,
              backgroundColor: color,
              x: x + spiralRadius,
              y: y + spiralRadius,
            }}
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut"
            }}
          />
        )
      })}
    </div>
  )
}

export default SpiralLoader