"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Mail, Instagram, Twitter, Youtube, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { siteConfig } from "@/lib/content"
import StoreSection from "@/components/store-section"
import ObjktButton from "@/components/objkt-button"
import ArtMosaic from "@/components/art-mosaic"
import ColorfulBackground from "@/components/colorful-background"

// Función para mezclar arrays aleatoriamente con validación
function shuffleArray<T>(array: T[]): T[] {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return []
  }

  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function ArtistPortfolio() {
  const [cartItems, setCartItems] = useState(0)
  const [shuffledShorts, setShuffledShorts] = useState(siteConfig?.works?.shorts || [])
  const [shuffledAnimations, setShuffledAnimations] = useState(siteConfig?.works?.animations || [])
  const [shuffledIllustrations, setShuffledIllustrations] = useState(siteConfig?.works?.illustrations || [])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Mezclar contenido al cargar la página con validación
  useEffect(() => {
    if (siteConfig?.works?.shorts) {
      setShuffledShorts(shuffleArray(siteConfig.works.shorts))
    }
    if (siteConfig?.works?.animations) {
      setShuffledAnimations(shuffleArray(siteConfig.works.animations))
    }
    if (siteConfig?.works?.illustrations) {
      setShuffledIllustrations(shuffleArray(siteConfig.works.illustrations))
    }
  }, [])

  const addToCart = () => {
    setCartItems((prev) => prev + 1)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <ColorfulBackground>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="w-1/3 md:block hidden">{/* Espacio vacío para equilibrar el layout en desktop */}</div>
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="pixel-button">
              {mobileMenuOpen ? "✕" : "☰"}
            </Button>
          </div>
          <Link href="#" className="text-2xl font-bold pixel-title w-1/3 text-center">
            {siteConfig.name}
          </Link>
          <div className="w-1/3 flex justify-end">
            <nav className="hidden md:flex items-center space-x-6 mr-4">
              <Link href="#inicio" className="text-sm font-medium hover:text-primary transition-colors pixel-text">
                INICIO
              </Link>
              <Link href="#galeria" className="text-sm font-medium hover:text-primary transition-colors pixel-text">
                GALERÍA
              </Link>
              <Link href="#biografia" className="text-sm font-medium hover:text-primary transition-colors pixel-text">
                BIOGRAFÍA
              </Link>
              <Link href="#tienda" className="text-sm font-medium hover:text-primary transition-colors pixel-text">
                TIENDA
              </Link>
              <Link href="#contacto" className="text-sm font-medium hover:text-primary transition-colors pixel-text">
                CONTACTO
              </Link>
            </nav>
            <Button size="sm" className="relative btn-outline-white pixel-button">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b">
            <nav className="container py-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#inicio"
                    className="block px-4 py-2 hover:bg-muted rounded-md pixel-text"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    INICIO
                  </Link>
                </li>
                <li>
                  <Link
                    href="#galeria"
                    className="block px-4 py-2 hover:bg-muted rounded-md pixel-text"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    GALERÍA
                  </Link>
                </li>
                <li>
                  <Link
                    href="#biografia"
                    className="block px-4 py-2 hover:bg-muted rounded-md pixel-text"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    BIOGRAFÍA
                  </Link>
                </li>
                <li>
                  <Link
                    href="#tienda"
                    className="block px-4 py-2 hover:bg-muted rounded-md pixel-text"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    TIENDA
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contacto"
                    className="block px-4 py-2 hover:bg-muted rounded-md pixel-text"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    CONTACTO
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section - Modificado para acercar el título a la imagen */}
      <section id="inicio" className="relative py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-center md:text-right md:pr-8">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl pixel-title">
                {siteConfig.name}
              </h1>
            </div>
            <div className="relative max-w-md">
              <Image
                src="/images/hero/takashoshi-portrait.png"
                alt={`${siteConfig.name} - ARTISTA VISUAL`}
                width={400}
                height={400}
                className="rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Galería Principal - El protagonista */}
      <section id="galeria" className="py-16">
        <div className="container space-y-16">
          {/* Cortometrajes */}
          <ArtMosaic title="CORTOMETRAJES" items={shuffledShorts} type="shorts" />

          {/* Animaciones */}
          <ArtMosaic title="ANIMACIONES" items={shuffledAnimations} type="animations" />

          {/* Ilustraciones */}
          <ArtMosaic title="ILUSTRACIONES" items={shuffledIllustrations} type="illustrations" />
        </div>
      </section>

      {/* Botón OBJKT */}
      <div className="container">
        <ObjktButton />
      </div>

      {/* Tienda - Componente separado */}
      <StoreSection />

      {/* Biografía - Más abajo con texto más oscuro */}
      <section id="biografia" className="py-16">
        <div className="container">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter pixel-title text-center">{siteConfig.bio.title}</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {siteConfig.bio.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-sm leading-relaxed text-black font-medium">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contacto - Con texto más directo */}
      <section id="contacto" className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter pixel-title">¿TRABAJAMOS JUNTOS?</h2>

              <div className="space-y-4">
                <p className="text-lg text-muted-foreground leading-relaxed">CONTAME TU IDEA.</p>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold pixel-text">LO QUE HAGO:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>NARRATIVAS VISUALES</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>ANIMACIÓN 2D PIXEL ART</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>ANIMACIÓN TRADICIONAL</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>DISEÑO GRÁFICO</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>EDICIÓN DE VIDEO</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>MOTION GRAPHICS</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>PUBLICIDAD CREATIVA</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>CORTOMETRAJES</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="pixel-text">{siteConfig.email}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    href={siteConfig.social.instagram}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                  </Link>
                  <Link
                    href={siteConfig.social.twitter}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Twitter className="h-6 w-6" />
                  </Link>
                  <Link
                    href={siteConfig.social.youtube}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Youtube className="h-6 w-6" />
                  </Link>
                  <Link
                    href={siteConfig.social.objkt}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title="VER EN OBJKT"
                  >
                    <ExternalLink className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </div>

            <Card className="p-6">
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="pixel-text text-xs">
                      NOMBRE
                    </Label>
                    <Input id="nombre" placeholder="TU NOMBRE" className="pixel-text text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="pixel-text text-xs">
                      EMAIL
                    </Label>
                    <Input id="email" type="email" placeholder="TU@EMAIL.COM" className="pixel-text text-xs" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asunto" className="pixel-text text-xs">
                    ASUNTO
                  </Label>
                  <Input id="asunto" placeholder="¿EN QUÉ PUEDO AYUDARTE?" className="pixel-text text-xs" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensaje" className="pixel-text text-xs">
                    MENSAJE
                  </Label>
                  <Textarea
                    id="mensaje"
                    placeholder="CUÉNTAME SOBRE TU PROYECTO..."
                    className="min-h-[100px] pixel-text text-xs"
                  />
                </div>
                <Button type="submit" className="w-full pixel-button">
                  ENVIAR MENSAJE
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer - Modificado "especializado en pixel art" */}
      <footer className="border-t py-8 bg-background">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold pixel-title">{siteConfig.name}</h3>
              <p className="text-xs text-muted-foreground">ARTISTA VISUAL</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold pixel-text">NAVEGACIÓN</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>
                  <Link href="#galeria" className="hover:text-primary transition-colors">
                    GALERÍA
                  </Link>
                </li>
                <li>
                  <Link href="#biografia" className="hover:text-primary transition-colors">
                    BIOGRAFÍA
                  </Link>
                </li>
                <li>
                  <Link href="#tienda" className="hover:text-primary transition-colors">
                    TIENDA
                  </Link>
                </li>
                <li>
                  <Link href="#contacto" className="hover:text-primary transition-colors">
                    CONTACTO
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold pixel-text">SERVICIOS</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>CORTOMETRAJES</li>
                <li>ANIMACIONES</li>
                <li>ILUSTRACIONES</li>
                <li>COMISIONES</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold pixel-text">SÍGUEME</h4>
              <div className="flex space-x-3">
                <Link
                  href={siteConfig.social.instagram}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link
                  href={siteConfig.social.twitter}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link
                  href={siteConfig.social.youtube}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground">
            <p>&copy; 2024 {siteConfig.name}. TODOS LOS DERECHOS RESERVADOS.</p>
          </div>
        </div>
      </footer>
    </ColorfulBackground>
  )
}
