'use client'

import React, { useState, useEffect } from 'react'

export default function HowItWorksSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 bg-blue-500/15 rounded-full animate-pulse`}
            style={{
              top: `${[15, 70, 85, 25, 10, 50][i]}%`,
              left: `${[10, 80, 25, 75, 60, 5][i]}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '8s'
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div 
        className={`relative bg-gray-800/90 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 shadow-2xl transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
        }`}
        style={{
          boxShadow: `
            0 16px 32px rgba(0, 0, 0, 0.3),
            0 8px 16px rgba(56, 189, 248, 0.1),
            inset 0 1px 0 rgba(56, 189, 248, 0.1)
          `
        }}
      >
        {/* Top Border Gradient */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/80 to-transparent rounded-t-2xl" />
        
        {/* Glow Effect */}
        <div 
          className="absolute top-1/2 left-1/2 w-48 h-48 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            animation: 'glow 4s ease-in-out infinite'
          }}
        />

        {/* Header */}
        <div className="mb-6 text-left relative z-10">
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            How it Works
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Follow these simple steps to contribute and earn credits
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 relative z-10">
          {[
            {
              number: 1,
              title: "Enter Upload Code",
              description: "Use a valid upload code to unlock file upload",
              isPulse: true
            },
            {
              number: 2,
              title: "Verify Code",
              description: "Code of the PDF will be verified"
            },
            {
              number: 3,
              title: "Earn 10 Credits",
              description: "Successfully uploaded files earn you 10 credits"
            }
          ].map((step, index) => (
            <div
              key={step.number}
              className={`flex items-start gap-4 py-3 transition-all duration-800 hover:translate-x-2 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              style={{ transitionDelay: `${600 + index * 200}ms` }}
            >
              {/* Step Number */}
              <div 
                className={`w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-500/40 flex-shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-blue-500/60 relative overflow-hidden ${
                  step.isPulse ? 'animate-pulse' : ''
                }`}
                style={{
                  boxShadow: step.isPulse ? '0 0 0 0 rgba(56, 189, 248, 0.7)' : undefined,
                  animation: step.isPulse ? 'pulse-ring 2s infinite' : undefined
                }}
              >
                {step.number}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full transition-transform duration-600 group-hover:translate-x-full" />
              </div>

              {/* Step Content */}
              <div className="flex-1 pt-0.5">
                <h3 className="text-lg font-semibold text-white mb-1 transition-colors duration-300 hover:text-blue-400">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Divider Line */}
              {index < 2 && (
                <div className="absolute left-14 mt-12 w-px h-6 bg-gradient-to-b from-blue-500/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes glow {
          0%, 100% { 
            opacity: 0.3; 
            transform: translate(-50%, -50%) scale(1); 
          }
          50% { 
            opacity: 0.6; 
            transform: translate(-50%, -50%) scale(1.1); 
          }
        }

        @keyframes pulse-ring {
          0% { 
            box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7); 
          }
          70% { 
            box-shadow: 0 0 0 10px rgba(56, 189, 248, 0); 
          }
          100% { 
            box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); 
          }
        }
      `}</style>
    </div>
  )
}
