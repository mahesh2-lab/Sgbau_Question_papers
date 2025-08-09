'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function AnimatedButton({ children, className, ...props }: AnimatedButtonProps) {
  return (
    <button
      className={cn(
        "relative w-24 h-10 border-2 border-blue-500 outline-none bg-transparent text-white transition-all duration-1000 rounded-md text-sm font-bold cursor-pointer overflow-hidden",
        "before:content-[''] before:absolute before:top-[-2px] before:left-[3%] before:w-[95%] before:h-[40%] before:bg-gray-800 before:transition-all before:duration-500 before:origin-center",
        "after:content-[''] after:absolute after:top-[80%] after:left-[3%] after:w-[95%] after:h-[40%] after:bg-gray-800 after:transition-all after:duration-500 after:origin-center",
        "hover:before:scale-0 hover:after:scale-0 hover:shadow-[inset_0px_0px_25px_#1479EA]",
        className
      )}
      style={{
        borderStyle: 'ridge',
        borderWidth: '2px',
        borderColor: '#149CEA'
      }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}
