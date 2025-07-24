"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Play, ChevronRight, ChevronLeft, X } from "lucide-react"

// Componente de galería tipo mosaico
export default function ArtMosaic({
  title,
  items,
  type,
}: {
  title: string
  items: any[]
  type: "shorts" | "animations" | "illustrations"
}) {
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: string; title: string } | null>(null)
  const itemsPerPage = 8 // Mostrar 8 obras por página

  const totalPages = Math.ceil(items.length / itemsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1 >= totalPages ? 0 : prev + 1))
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 < 0 ? totalPages - 1 : prev - 1))
  }

  const openMedia = (item: any) => {
    if (type === "illustrations") {
      setSelectedMedia({ url: item.image, type: "image", title: item.title })
    } else if (type === "animations") {
      // Para animaciones, usar el thumbnail que es el GIF
      setSelectedMedia({ url: item.thumbnail, type: "gif", title: item.title })
    } else if (type === "shorts" && item.video) {
      // Para cortometrajes con video disponible
      setSelectedMedia({ url: item.video, type: "video", title: item.title })
    } else {
      // Para cortometrajes sin video, mostrar el thumbnail
      setSelectedMedia({ url: item.thumbnail, type: "gif", title: item.title })
    }
  }

  const closeMedia = () => {
    setSelectedMedia(null)
  }

  const startIndex = currentPage * itemsPerPage
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={closeMedia}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl pixel-text flex items-center gap-2"
            >
              <X className="h-6 w-6" />
              CERRAR
            </button>

            <div className="bg-black rounded-lg overflow-hidden">
              {selectedMedia.type === "video" ? (
                <video src={selectedMedia.url} controls autoPlay className="w-full h-auto max-h-[80vh] object-contain">
                  TU NAVEGADOR NO SOPORTA EL ELEMENTO VIDEO.
                </video>
              ) : (
                <div className="flex flex-col items-center">
                  <Image
                    src={selectedMedia.url || "/placeholder.svg"}
                    alt={selectedMedia.title}
                    width={800}
                    height={800}
                    className="w-full h-auto max-h-[80vh] object-contain"
                    unoptimized={true}
                    loading="eager"
                    key={selectedMedia.url} // Forzar re-render
                  />
                  <div className="p-4 text-center">
                    <h3 className="text-white pixel-text text-lg">{selectedMedia.title}</h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold pixel-title">{title}</h3>
        {totalPages > 1 && (
          <div className="flex gap-2 items-center">
            <span className="text-sm pixel-text text-muted-foreground">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              className="btn-outline-white pixel-button bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              className="btn-outline-white pixel-button bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Grid tipo mosaico con tamaños variables */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max">
        {visibleItems.map((item, index) => {
          // Crear variación en tamaños para efecto mosaico
          const isLarge = index % 7 === 0 || index % 11 === 0 // Algunos elementos más grandes
          const isTall = index % 5 === 0 && !isLarge // Algunos elementos más altos

          return (
            <div
              key={`${item.id}-${currentPage}-${index}`}
              className={`group cursor-pointer hover-lift ${
                isLarge ? "md:col-span-2 md:row-span-2" : isTall ? "row-span-2" : ""
              }`}
            >
              <div
                className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                onClick={() => openMedia(item)}
              >
                {type === "animations" ? (
                  // Para GIFs, usar img nativo para mejor compatibilidad
                  <img
                    src={item.thumbnail || "/placeholder.svg?height=400&width=400"}
                    alt={item.title}
                    className="object-cover transition-transform group-hover:scale-105 w-full h-full"
                    loading="eager"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <Image
                    src={item.thumbnail || item.image || "/placeholder.svg?height=400&width=400"}
                    alt={item.title}
                    width={400}
                    height={400}
                    className="object-cover transition-transform group-hover:scale-105 w-full h-full"
                    unoptimized={type === "animations"}
                    loading="eager"
                    style={{ imageRendering: type === "animations" ? "pixelated" : "auto" }}
                  />
                )}

                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" className="btn-outline-white pixel-button">
                    {type === "illustrations" ? (
                      <>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        VER
                      </>
                    ) : type === "animations" ? (
                      <>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        AMPLIAR
                      </>
                    ) : item.video ? (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        PLAY
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        VER
                      </>
                    )}
                  </Button>
                </div>

                {type !== "illustrations" && (
                  <Badge className="absolute top-2 right-2 bg-black/70 text-white pixel-text text-xs">
                    {type === "shorts" ? item.duration : item.technique}
                  </Badge>
                )}
              </div>

              <div className="mt-2 text-center px-2">
                <h4 className="font-semibold text-xs pixel-text text-muted-foreground leading-tight">{item.title}</h4>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
