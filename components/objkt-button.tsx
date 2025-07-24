"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { siteConfig } from "@/lib/content"

export default function ObjktButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="w-full flex justify-center my-8">
      <Link
        href={siteConfig.social.objkt}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          relative overflow-hidden group
          flex items-center justify-center gap-3
          px-8 py-6 rounded-xl
          bg-gradient-to-r from-blue-500 to-purple-600
          hover:from-blue-600 hover:to-purple-700
          text-white font-bold text-xl pixel-text
          transition-all duration-300 transform
          ${isHovered ? "scale-105" : ""}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Fondo animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Partículas pixel */}
        {isHovered && (
          <>
            <div className="absolute top-2 left-1/4 w-2 h-2 bg-white animate-ping"></div>
            <div className="absolute top-4 right-1/4 w-2 h-2 bg-white animate-ping delay-100"></div>
            <div className="absolute bottom-3 left-1/3 w-2 h-2 bg-white animate-ping delay-200"></div>
            <div className="absolute bottom-5 right-1/3 w-2 h-2 bg-white animate-ping delay-300"></div>
          </>
        )}

        {/* Contenido */}
        <ExternalLink className={`h-6 w-6 transition-transform duration-300 ${isHovered ? "rotate-12" : ""}`} />
        <span className="tracking-wider">VER MI GALERÍA NFT EN OBJKT</span>
        <ExternalLink className={`h-6 w-6 transition-transform duration-300 ${isHovered ? "-rotate-12" : ""}`} />
      </Link>
    </div>
  )
}
