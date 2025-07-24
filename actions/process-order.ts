"use server"

// Define el tipo para los datos del formulario
interface FormData {
  nombre: string
  apellido: string
  email: string
  telefono?: string
  direccion: string
  ciudad: string
  codigoPostal: string
  provincia: string
  pais: string
  instrucciones?: string
  paymentMethod: string
  cartItems: Array<{ id: string; name: string; price: number; type: string }>
}

// Define el tipo para la respuesta de la acción
interface ProcessOrderResult {
  success: boolean
  message: string
  orderId?: string
  cryptoPrices?: {
    ethereum: number
    tezos: number
  }
  buyerContactInfo?: {
    name: string
    email: string
    phone?: string
  }
  orderDetails?: Array<{ id: string; name: string; price: number; type: string }>
  totalAmount?: number
}

// Función para obtener precios de criptomonedas (simulada o real con API)
async function getCryptoPrices() {
  try {
    // Usamos la API de CoinGecko para obtener precios en tiempo real
    // NOTA: En un entorno de producción, esta llamada debería ser más robusta
    // y posiblemente cacheada para evitar abusar de la API.
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,tezos&vs_currencies=usd",
      { next: { revalidate: 60 } }, // Revalidar cada 60 segundos
    )
    const data = await response.json()

    return {
      ethereum: data.ethereum?.usd || 0,
      tezos: data.tezos?.usd || 0,
    }
  } catch (error) {
    console.error("Error fetching crypto prices:", error)
    return { ethereum: 0, tezos: 0 } // Retorna 0 en caso de error
  }
}

export async function processOrder(
  prevState: ProcessOrderResult | undefined,
  formData: FormData,
): Promise<ProcessOrderResult> {
  // Simula un retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const {
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    ciudad,
    codigoPostal,
    provincia,
    pais,
    paymentMethod,
    cartItems,
  } = formData

  // Validación básica de datos
  if (!nombre || !email || !direccion || !paymentMethod || cartItems.length === 0) {
    return { success: false, message: "Faltan datos obligatorios para el pedido." }
  }

  // Calcular total
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0)

  // Generar un ID de pedido
  const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  let cryptoPrices = undefined
  let message = ""

  if (paymentMethod === "crypto") {
    cryptoPrices = await getCryptoPrices()
    message = `Tu pedido #${orderId} ha sido recibido. Por favor, realiza la transferencia de criptomonedas y luego contáctame para confirmar y coordinar la entrega. Precios actuales de referencia:`
  } else {
    message = `Tu pedido #${orderId} ha sido recibido. Te contactaré pronto al email ${email} para coordinar el pago y la entrega.`
  }

  // --- SIMULACIÓN de notificación al artista ---
  // En un entorno real, aquí enviarías un email a tu dirección con todos los detalles del pedido
  console.log("--- NUEVO PEDIDO RECIBIDO ---")
  console.log(`ID de Pedido: ${orderId}`)
  console.log(`Comprador: ${nombre} ${apellido} (${email})`)
  if (telefono) console.log(`Teléfono: ${telefono}`)
  console.log(`Dirección de Envío: ${direccion}, ${ciudad}, ${codigoPostal}, ${provincia}, ${pais}`)
  console.log(`Método de Pago Seleccionado: ${paymentMethod.toUpperCase()}`)
  console.log("Artículos:")
  cartItems.forEach((item) => console.log(`- ${item.name} (${item.type}): $${item.price} USD`))
  console.log(`Total: $${totalAmount.toFixed(2)} USD`)
  if (cryptoPrices) {
    console.log(
      `Precios Crypto (referencia): ETH: $${cryptoPrices.ethereum.toFixed(2)} USD, XTZ: $${cryptoPrices.tezos.toFixed(2)} USD`,
    )
  }
  console.log("-----------------------------")
  console.log(
    "¡Recuerda configurar un servicio de email real (como Resend) para recibir estas notificaciones automáticamente!",
  )

  return {
    success: true,
    message,
    orderId,
    cryptoPrices,
    buyerContactInfo: {
      name: `${nombre} ${apellido}`,
      email: email,
      phone: telefono,
    },
    orderDetails: cartItems,
    totalAmount: totalAmount,
  }
}
