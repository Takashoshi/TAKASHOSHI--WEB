"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"

interface ColorPatch {
  color: string
  top: string
  left: string
  width: string
  height: string
  rotation: number
  gridColor: string
}

interface Decoration {
  type: string
  top: number
  left: number
  scale: number
}

export default function ColorfulBackground({ children }: { children: React.ReactNode }) {
  const [patches, setPatches] = useState<ColorPatch[]>([])
  const [decorations, setDecorations] = useState<Decoration[]>([])

  // Colores vibrantes que combinan con el amarillo - Rosa y celeste más claros
  const colors = [
    { bg: "#ffc800", grid: "rgba(135, 206, 235, 0.3)" }, // Amarillo (original) con cuadrillé celeste
    { bg: "#FF7676", grid: "rgba(255, 255, 255, 0.25)" }, // Rosa más claro con cuadrillé blanco
    { bg: "#2979FF", grid: "rgba(255, 255, 0, 0.25)" }, // Azul con cuadrillé amarillo
    { bg: "#FFA5C3", grid: "rgba(0, 255, 255, 0.25)" }, // Rosa pastel con cuadrillé cyan
    { bg: "#80DEEA", grid: "rgba(255, 200, 0, 0.25)" }, // Celeste más claro con cuadrillé amarillo
    { bg: "#4CAF50", grid: "rgba(255, 255, 255, 0.25)" }, // Verde con cuadrillé blanco
  ]

  useEffect(() => {
    // Generar parches de colores rectangulares y alineados
    const newPatches: ColorPatch[] = []
    const patchCount = 12 // Número de parches de color

    // Crear una cuadrícula imaginaria para posicionar los parches
    const gridSize = 20 // Tamaño de la cuadrícula en porcentaje

    for (let i = 0; i < patchCount; i++) {
      const colorIndex = Math.floor(Math.random() * colors.length)
      // Calcular posición alineada a la cuadrícula
      const gridX = Math.floor(Math.random() * (100 / gridSize)) * gridSize
      const gridY = Math.floor(Math.random() * (100 / gridSize)) * gridSize

      // Tamaños rectangulares alineados a la cuadrícula
      const width = Math.floor(Math.random() * 2 + 1) * gridSize
      const height = Math.floor(Math.random() * 2 + 1) * gridSize

      newPatches.push({
        color: colors[colorIndex].bg,
        gridColor: colors[colorIndex].grid,
        top: `${gridY}%`,
        left: `${gridX}%`,
        width: `${width}%`,
        height: `${height}%`,
        rotation: 0, // Sin rotación
      })
    }

    setPatches(newPatches)

    // Crear una distribución de decoraciones sin superposiciones
    const newDecorations: Decoration[] = []

    // Tipos de decoraciones disponibles
    const decorationTypes = ["horse", "birds", "plane", "car"]

    // Tamaño efectivo de cada decoración (para evitar superposiciones)
    const decorationSize = 150 // pixels aproximados

    // Convertir a porcentaje basado en un viewport de 1920px de ancho
    const decorationSizePercent = (decorationSize / 1920) * 100

    // Distancia mínima entre decoraciones (en porcentaje)
    const minDistance = decorationSizePercent * 1.2 // 20% extra para espacio

    // Función para verificar si una posición está demasiado cerca de decoraciones existentes
    const isTooClose = (top: number, left: number): boolean => {
      for (const decoration of newDecorations) {
        const distance = Math.sqrt(Math.pow(decoration.top - top, 2) + Math.pow(decoration.left - left, 2))
        if (distance < minDistance) {
          return true
        }
      }
      return false
    }

    // Dividir la pantalla en secciones horizontales para mejor distribución
    const horizontalSections = 10
    const sectionWidth = 100 / horizontalSections

    // Asegurarnos de que cada sección horizontal tenga al menos una decoración
    for (let section = 0; section < horizontalSections; section++) {
      // Elegir un tipo aleatorio para esta sección
      const type = decorationTypes[Math.floor(Math.random() * decorationTypes.length)]

      // Calcular el rango horizontal para esta sección
      const leftMin = section * sectionWidth
      const leftMax = (section + 1) * sectionWidth

      // Intentar colocar una decoración en esta sección
      let placed = false
      let attempts = 0

      while (!placed && attempts < 50) {
        const left = leftMin + Math.random() * (leftMax - leftMin)

        // Elegir una posición vertical que evite el centro de la página
        let top
        if (Math.random() < 0.6) {
          // 60% de probabilidad: en los bordes superior e inferior
          top = Math.random() < 0.5 ? Math.random() * 20 : 80 + Math.random() * 20
        } else {
          // 40% de probabilidad: en el resto de la página, evitando el centro
          const verticalSection = Math.floor(Math.random() * 5) // 0-4
          if (verticalSection < 2) {
            top = 20 + verticalSection * 15 + Math.random() * 10 // 20-30, 35-45
          } else {
            top = 55 + (verticalSection - 2) * 15 + Math.random() * 10 // 55-65, 70-80
          }
        }

        if (!isTooClose(top, left)) {
          newDecorations.push({
            type,
            top,
            left,
            scale: 1.5 + Math.random() * 0.3, // Escala entre 1.5 y 1.8 (todas grandes)
          })
          placed = true
        }

        attempts++
      }
    }

    // Ahora, añadir decoraciones adicionales para completar
    const targetTotal = 60 // Total de decoraciones que queremos
    let typeIndex = 0
    let attempts = 0
    const maxAttempts = 200

    while (newDecorations.length < targetTotal && attempts < maxAttempts) {
      const type = decorationTypes[typeIndex]
      typeIndex = (typeIndex + 1) % decorationTypes.length // Rotar entre tipos

      // Intentar colocar en áreas preferidas
      let placed = false

      // Áreas preferidas: bordes y espacios entre secciones
      const preferredAreas = [
        // Borde superior
        { top: [0, 20], left: [0, 100] },
        // Borde inferior
        { top: [80, 100], left: [0, 100] },
        // Borde izquierdo
        { top: [20, 80], left: [0, 15] },
        // Borde derecho
        { top: [20, 80], left: [85, 100] },
        // Espacios entre secciones
        { top: [30, 40], left: [15, 85] },
        { top: [50, 60], left: [15, 85] },
        { top: [70, 80], left: [15, 85] },
      ]

      const area = preferredAreas[Math.floor(Math.random() * preferredAreas.length)]
      const top = area.top[0] + Math.random() * (area.top[1] - area.top[0])
      const left = area.left[0] + Math.random() * (area.left[1] - area.left[0])

      if (!isTooClose(top, left)) {
        newDecorations.push({
          type,
          top,
          left,
          scale: 1.5 + Math.random() * 0.3, // Escala entre 1.5 y 1.8 (todas grandes)
        })
        placed = true
      }

      attempts++
    }

    // Mezclar el array para que los tipos no aparezcan agrupados
    const shuffleArray = (array: Decoration[]): Decoration[] => {
      const newArray = [...array]
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
      }
      return newArray
    }

    setDecorations(shuffleArray(newDecorations))
  }, [])

  return (
    <div className="relative min-h-screen bg-yellow-500 overflow-hidden">
      {/* Parches de colores con cuadrillé */}
      {patches.map((patch, index) => (
        <div
          key={index}
          className="absolute rounded-lg"
          style={{
            top: patch.top,
            left: patch.left,
            width: patch.width,
            height: patch.height,
            backgroundColor: patch.color,
            transform: `rotate(${patch.rotation}deg)`,
            backgroundImage: `linear-gradient(90deg, ${patch.gridColor} 1px, transparent 1px), 
                             linear-gradient(${patch.gridColor} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            zIndex: 0,
          }}
        />
      ))}

      {/* Decoraciones animadas */}
      {decorations.map((decoration, index) => (
        <div
          key={`decoration-${index}`}
          className="absolute z-10 pointer-events-none"
          style={{
            top: `${decoration.top}%`,
            left: `${decoration.left}%`,
            transform: `scale(${decoration.scale})`,
          }}
        >
          <Image
            src={
              decoration.type === "horse"
                ? "/images/decorations/pingo-corriendo.gif"
                : decoration.type === "birds"
                  ? "/images/decorations/pajaros-volando.gif"
                  : decoration.type === "plane"
                    ? "/images/decorations/avioneta.gif"
                    : "/images/decorations/auto.gif"
            }
            alt="Decoración animada"
            width={120}
            height={90}
            className="object-contain"
            unoptimized={true}
          />
        </div>
      ))}

      {/* Cuadrillé de fondo */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(135, 206, 235, 0.3) 1px, transparent 1px), 
                           linear-gradient(rgba(135, 206, 235, 0.3) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-20">{children}</div>
    </div>
  )
}
