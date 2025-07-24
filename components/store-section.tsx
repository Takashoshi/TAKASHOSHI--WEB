"use client"

import type React from "react"

import { useState, useActionState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Wallet, Copy, Check, ShoppingCart, X } from "lucide-react"
import { siteConfig } from "@/lib/content"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { processOrder } from "@/actions/process-order"

// Componente para mockup de remera
function TShirtMockup({
  design,
  color,
  designName,
}: {
  design: string
  color: string
  designName: string
}) {
  const colorClasses = {
    blanco: "bg-white border-gray-200",
    negro: "bg-gray-900 border-gray-700",
    azul: "bg-blue-600 border-blue-500",
    rojo: "bg-red-600 border-red-500",
  }

  const textColorClasses = {
    blanco: "text-gray-800",
    negro: "text-white",
    azul: "text-white",
    rojo: "text-white",
  }

  return (
    <div className="relative">
      {/* Mockup de remera */}
      <div
        className={`relative w-full aspect-square rounded-lg border-2 ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center overflow-hidden`}
      >
        {/* Forma básica de remera - Aumentado el tamaño del diseño */}
        <div className="relative w-4/5 h-4/5 flex items-center justify-center">
          <Image
            src={design || "/placeholder.svg"}
            alt={designName}
            width={250} // Aumentado el tamaño
            height={250} // Aumentado el tamaño
            className="object-contain opacity-90"
            style={{
              filter: color === "blanco" ? "none" : "brightness(0) invert(1)",
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Indicador de color */}
        <Badge
          className={`absolute top-2 right-2 ${textColorClasses[color as keyof typeof textColorClasses]} bg-black/20 backdrop-blur-sm`}
        >
          {color.toUpperCase()}
        </Badge>
      </div>
    </div>
  )
}

// Componente para copiar direcciones crypto
function CryptoAddress({
  label,
  address,
  icon,
}: {
  label: string
  address: string
  icon: React.ReactNode
}) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <p className="text-sm font-semibold pixel-text">{label}</p>
          <p className="text-xs text-muted-foreground font-mono">{address}</p>
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={copyToClipboard} className="pixel-button bg-transparent">
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  )
}

// Componente para el formulario de checkout
function CheckoutForm({
  onClose,
  cartItems,
  setCartItems,
}: { onClose: () => void; cartItems: any[]; setCartItems: React.Dispatch<React.SetStateAction<any[]>> }) {
  const [state, formAction, isPending] = useActionState(processOrder, undefined)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold pixel-title">FINALIZAR COMPRA</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form
            action={formAction}
            onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const data = Object.fromEntries(formData.entries()) as { [key: string]: any }
              // Asegurarse de que cartItems se pasa como un array de objetos
              data.cartItems = cartItems

              const result = await formAction(data)
              if (result.success) {
                alert(result.message)
                setCartItems([]) // Vaciar carrito al éxito
                onClose() // Cerrar modal
              } else {
                alert(`Error: ${result.message}`)
              }
            }}
            className="space-y-6"
          >
            {/* Datos personales */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold pixel-text">DATOS PERSONALES</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="pixel-text text-xs">
                    NOMBRE
                  </Label>
                  <Input id="nombre" name="nombre" placeholder="TU NOMBRE" required className="pixel-text text-xs" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido" className="pixel-text text-xs">
                    APELLIDO
                  </Label>
                  <Input
                    id="apellido"
                    name="apellido"
                    placeholder="TU APELLIDO"
                    required
                    className="pixel-text text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="pixel-text text-xs">
                  EMAIL
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="TU@EMAIL.COM"
                  required
                  className="pixel-text text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono" className="pixel-text text-xs">
                  TELÉFONO
                </Label>
                <Input id="telefono" name="telefono" placeholder="+XX XXX XXX XXXX" className="pixel-text text-xs" />
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold pixel-text">DIRECCIÓN DE ENVÍO</h3>
              <div className="space-y-2">
                <Label htmlFor="direccion" className="pixel-text text-xs">
                  DIRECCIÓN
                </Label>
                <Input
                  id="direccion"
                  name="direccion"
                  placeholder="CALLE Y NÚMERO"
                  required
                  className="pixel-text text-xs"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ciudad" className="pixel-text text-xs">
                    CIUDAD
                  </Label>
                  <Input id="ciudad" name="ciudad" placeholder="TU CIUDAD" required className="pixel-text text-xs" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigo-postal" className="pixel-text text-xs">
                    CÓDIGO POSTAL
                  </Label>
                  <Input
                    id="codigo-postal"
                    name="codigoPostal"
                    placeholder="CÓDIGO POSTAL"
                    required
                    className="pixel-text text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provincia" className="pixel-text text-xs">
                    PROVINCIA/ESTADO
                  </Label>
                  <Input
                    id="provincia"
                    name="provincia"
                    placeholder="PROVINCIA O ESTADO"
                    required
                    className="pixel-text text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pais" className="pixel-text text-xs">
                    PAÍS
                  </Label>
                  <Input id="pais" name="pais" placeholder="TU PAÍS" required className="pixel-text text-xs" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instrucciones" className="pixel-text text-xs">
                  INSTRUCCIONES ADICIONALES (OPCIONAL)
                </Label>
                <Textarea
                  id="instrucciones"
                  name="instrucciones"
                  placeholder="INSTRUCCIONES PARA LA ENTREGA..."
                  className="min-h-[80px] pixel-text text-xs"
                />
              </div>
            </div>

            {/* Método de pago */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold pixel-text">MÉTODO DE PAGO</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    className="h-4 w-4"
                    onChange={() => setSelectedPaymentMethod("paypal")}
                    required
                  />
                  <Label htmlFor="paypal" className="pixel-text text-xs">
                    PAYPAL
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="tarjeta"
                    name="paymentMethod"
                    value="tarjeta"
                    className="h-4 w-4"
                    onChange={() => setSelectedPaymentMethod("tarjeta")}
                    required
                  />
                  <Label htmlFor="tarjeta" className="pixel-text text-xs">
                    TARJETA DE CRÉDITO/DÉBITO
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="crypto"
                    name="paymentMethod"
                    value="crypto"
                    className="h-4 w-4"
                    onChange={() => setSelectedPaymentMethod("crypto")}
                    required
                  />
                  <Label htmlFor="crypto" className="pixel-text text-xs">
                    CRIPTOMONEDAS
                  </Label>
                </div>
              </div>
            </div>

            {/* Información adicional para pagos crypto si se selecciona */}
            {selectedPaymentMethod === "crypto" && (
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <h4 className="text-lg font-bold pixel-text">DETALLES DE PAGO CRYPTO</h4>
                <p className="text-sm text-muted-foreground">
                  POR FAVOR, REALIZA LA TRANSFERENCIA A UNA DE LAS SIGUIENTES DIRECCIONES. UNA VEZ HECHA, CONTÁCTAME CON
                  EL HASH DE LA TRANSACCIÓN PARA CONFIRMAR TU PEDIDO.
                </p>
                <CryptoAddress
                  label="ETHEREUM"
                  address={siteConfig.store.cryptoAddresses.ethereum}
                  icon={
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      ETH
                    </div>
                  }
                />
                <CryptoAddress
                  label="TEZOS"
                  address={siteConfig.store.cryptoAddresses.tezos}
                  icon={
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      XTZ
                    </div>
                  }
                />
                {state?.cryptoPrices && (
                  <p className="text-sm text-muted-foreground mt-2">
                    PRECIOS DE REFERENCIA (USD): ETH: ${state.cryptoPrices.ethereum.toFixed(2)} | XTZ: $
                    {state.cryptoPrices.tezos.toFixed(2)}
                  </p>
                )}
              </div>
            )}

            <div className="pt-4 border-t">
              <Button type="submit" className="w-full pixel-button" disabled={isPending}>
                {isPending ? "PROCESANDO..." : "CONFIRMAR PEDIDO"}
              </Button>
            </div>
          </form>
        </div>
        {state && (
          <div className={`mt-4 text-center p-4 ${state.success ? "text-green-600" : "text-red-600"}`}>
            {state.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default function StoreSection() {
  const [selectedTshirtColors, setSelectedTshirtColors] = useState<{ [key: string]: string }>({})
  const [showCheckout, setShowCheckout] = useState(false)
  const [cartItems, setCartItems] = useState<{ id: string; name: string; price: number; type: string }[]>([])

  const selectTshirtColor = (tshirtId: string, color: string) => {
    setSelectedTshirtColors((prev) => ({
      ...prev,
      [tshirtId]: color,
    }))
  }

  const addToCart = (item: { id: string; name: string; price: number; type: string }) => {
    setCartItems((prev) => [...prev, item])
    // Mostrar alguna notificación o feedback visual aquí
  }

  const openCheckout = () => {
    setShowCheckout(true)
  }

  const closeCheckout = () => {
    setShowCheckout(false)
  }

  return (
    <section id="tienda" className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter pixel-title">TIENDA</h2>
        </div>

        <div className="space-y-12">
          {/* Prints Section - Modificado */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <h4 className="text-xl font-bold pixel-text">{siteConfig.products.prints.name}</h4>
              <p className="text-sm text-muted-foreground">{siteConfig.products.prints.description}</p>

              <p className="text-sm font-semibold pixel-text">
                LOS PRINTS PIXEL ART SON ÚNICAMENTE CUADRADOS Y EL PRECIO ES DE ${siteConfig.products.prints.price} USD
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold pixel-text">${siteConfig.products.prints.price} USD</span>
                  <p className="text-xs text-muted-foreground">{siteConfig.products.prints.note}</p>
                </div>
                <Button
                  size="sm"
                  className="pixel-button"
                  onClick={() =>
                    addToCart({
                      id: "print-generic",
                      name: siteConfig.products.prints.name,
                      price: siteConfig.products.prints.price,
                      type: "print",
                    })
                  }
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  AÑADIR
                </Button>
              </div>
            </div>
          </div>

          {/* T-Shirts Section - Sin cambios en la estructura, solo en el mockup */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold pixel-title">REMERAS</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {siteConfig.products.tshirts.map((tshirt) => {
                const selectedColor = selectedTshirtColors[tshirt.id] || tshirt.colors[0]

                return (
                  <Card key={tshirt.id} className="overflow-hidden">
                    <div className="p-4">
                      <TShirtMockup design={tshirt.design} color={selectedColor} designName={tshirt.name} />
                    </div>

                    <CardContent className="p-4 space-y-4">
                      <div>
                        <h4 className="font-semibold pixel-text text-sm">{tshirt.name}</h4>
                        <p className="text-xs text-muted-foreground">{tshirt.description}</p>
                      </div>

                      {/* Selector de colores */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold pixel-text">COLORES:</p>
                        <div className="flex gap-2">
                          {tshirt.colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => selectTshirtColor(tshirt.id, color)}
                              className={`w-6 h-6 rounded-full border-2 transition-all ${
                                selectedColor === color ? "border-primary scale-110" : "border-gray-300"
                              } ${
                                color === "blanco"
                                  ? "bg-white"
                                  : color === "negro"
                                    ? "bg-gray-900"
                                    : color === "azul"
                                      ? "bg-blue-600"
                                      : "bg-red-600"
                              }`}
                              title={color.toUpperCase()}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold pixel-text">${tshirt.price} USD</span>
                        <Button
                          size="sm"
                          className="pixel-button"
                          onClick={() =>
                            addToCart({
                              id: `${tshirt.id}-${selectedColor}`,
                              name: `${tshirt.name} (${selectedColor.toUpperCase()})`,
                              price: tshirt.price,
                              type: "tshirt",
                            })
                          }
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          AÑADIR
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Carrito y Checkout - Oculto cuando está vacío */}
          {cartItems.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold pixel-title mb-4">TU CARRITO</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-semibold pixel-text text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.type === "print" ? "PRINT" : "REMERA"}</p>
                      </div>
                      <p className="font-bold">${item.price} USD</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <p className="font-bold pixel-text">TOTAL:</p>
                  <p className="font-bold text-xl">
                    ${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)} USD
                  </p>
                </div>

                <Button onClick={openCheckout} className="w-full pixel-button">
                  FINALIZAR COMPRA
                </Button>
              </div>
            </div>
          )}

          {/* Payment Methods - Unificado y simplificado */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold pixel-title">MÉTODOS DE PAGO</h3>

            <Card className="p-6">
              <h4 className="text-lg font-bold pixel-text mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                PAGOS INTERNACIONALES
              </h4>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  ACEPTAMOS PAGOS CON TARJETA DE CRÉDITO/DÉBITO A TRAVÉS DE PAYPAL O STRIPE.
                </p>
                <p className="text-sm text-muted-foreground">
                  PARA COORDINAR EL PAGO, POR FAVOR, COMPLETA EL FORMULARIO DE COMPRA Y TE CONTACTARÉ DIRECTAMENTE.
                </p>
              </div>

              <h4 className="text-lg font-bold pixel-text mt-6 mb-4 flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                PAGOS CRYPTO
              </h4>
              <div className="space-y-3">
                <CryptoAddress
                  label="ETHEREUM"
                  address={siteConfig.store.cryptoAddresses.ethereum}
                  icon={
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      ETH
                    </div>
                  }
                />
                <CryptoAddress
                  label="TEZOS"
                  address={siteConfig.store.cryptoAddresses.tezos}
                  icon={
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      XTZ
                    </div>
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ENVÍA EL PAGO Y CONTACTAME CON EL HASH DE LA TRANSACCIÓN
              </p>
            </Card>
          </div>

          {/* Información adicional */}
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <h4 className="text-lg font-bold pixel-text mb-3">INFORMACIÓN IMPORTANTE</h4>
            <div className="space-y-2 text-sm">
              <p>• LOS PRECIOS NO INCLUYEN COSTOS DE ENVÍO</p>
              <p>• ENVÍOS NACIONALES E INTERNACIONALES DISPONIBLES</p>
              <p>• TIEMPO DE PRODUCCIÓN: 3-5 DÍAS HÁBILES</p>
              <p>• PARA PEDIDOS PERSONALIZADOS, CONTACTAME DIRECTAMENTE</p>
              <p>• ACEPTO COMISIONES Y TRABAJOS CUSTOM</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Formulario de checkout */}
      {showCheckout && <CheckoutForm onClose={closeCheckout} cartItems={cartItems} setCartItems={setCartItems} />}
    </section>
  )
}
