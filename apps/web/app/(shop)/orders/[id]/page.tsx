"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Package,
  RefreshCw,
  Truck,
} from "lucide-react"

import { retrieveCustomerOrder, retrieveOrderTracking } from "@/services/orders"

function formatMoney(amount: number, currencyCode?: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode?.toUpperCase() || "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0))
}

function formatDate(date?: string) {
  if (!date) return ""

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date))
}

function humanizeStatus(status?: string) {
  if (!status) return "Processing"

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = String(params.id)

  const [order, setOrder] = useState<any>(null)
  const [tracking, setTracking] = useState<any>(null)

  const [loading, setLoading] = useState(true)
  const [trackingLoading, setTrackingLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  async function loadOrder() {
    setLoading(true)
    setError(null)

    try {
      const data = await retrieveCustomerOrder(orderId)
      setOrder(data)
    } catch (err) {
      console.error("[order-details] Failed:", err)

      setError(
        err instanceof Error ? err.message : "Unable to load this order."
      )
    } finally {
      setLoading(false)
    }
  }

  async function loadTracking() {
    setTrackingLoading(true)

    try {
      const response = await retrieveOrderTracking(orderId)

      setTracking(response?.tracking ?? null)
    } catch (err) {
      console.error("[order-details] Tracking failed:", err)
      setTracking(null)
    } finally {
      setTrackingLoading(false)
    }
  }

  async function loadEverything() {
    await Promise.all([loadOrder(), loadTracking()])
  }

  useEffect(() => {
    if (orderId) {
      loadEverything()
    }
  }, [orderId])

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-5">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="h-10 w-64 rounded bg-slate-200" />
            <div className="h-48 rounded-2xl bg-white" />
            <div className="h-64 rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-[70vh] bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-400" />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Order not found
          </h1>

          <p className="mt-2 text-slate-500">
            {error ?? "We couldn't load this order."}
          </p>

          <Link
            href="/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>

          <button
            type="button"
            onClick={loadEverything}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold tracking-wider text-blue-600 uppercase">
            Order Details
          </p>

          <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Order #{order.display_id ?? order.id}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Placed {formatDate(order.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Tracking */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Truck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Shipment Tracking
                </h2>

                <p className="text-sm text-slate-500">
                  Live shipment information from Shiprocket
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {trackingLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-40 rounded bg-slate-200" />
                <div className="h-4 w-64 rounded bg-slate-200" />
                <div className="h-4 w-48 rounded bg-slate-200" />
              </div>
            ) : tracking ? (
              <div>
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-slate-500">Current Status</p>

                    <div className="mt-1 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />

                      <p className="text-xl font-bold text-slate-900">
                        {humanizeStatus(tracking.status)}
                      </p>
                    </div>
                  </div>

                  {tracking.trackingUrl && (
                    <a
                      href={tracking.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Track on Shiprocket
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      AWB Number
                    </p>

                    <p className="mt-2 font-bold text-slate-900">
                      {tracking.awb ?? "Not assigned yet"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Shipment ID
                    </p>

                    <p className="mt-2 font-bold text-slate-900">
                      {tracking.shipmentId ?? "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Carrier
                    </p>

                    <p className="mt-2 font-bold text-slate-900">
                      {tracking.trackingData?.courier_name ??
                        tracking.trackingData?.courier ??
                        "Shiprocket"}
                    </p>
                  </div>
                </div>

                {tracking.trackingData?.shipment_track?.length > 0 && (
                  <div className="mt-8 border-t border-slate-100 pt-6">
                    <h3 className="font-bold text-slate-900">
                      Tracking Updates
                    </h3>

                    <div className="mt-5 space-y-5">
                      {tracking.trackingData.shipment_track.map(
                        (event: any, index: number) => (
                          <div
                            key={`${event.id ?? index}-${event.date ?? ""}`}
                            className="flex gap-4"
                          >
                            <div className="relative flex flex-col items-center">
                              <div className="z-10 flex h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-50" />

                              {index <
                                tracking.trackingData.shipment_track.length -
                                  1 && (
                                <div className="absolute top-3 h-full w-px bg-slate-200" />
                              )}
                            </div>

                            <div className="pb-2">
                              <p className="font-semibold text-slate-900">
                                {event.activity ??
                                  event.status ??
                                  "Shipment update"}
                              </p>

                              {(event.date || event.location) && (
                                <p className="mt-1 text-sm text-slate-500">
                                  {event.date ? formatDate(event.date) : ""}
                                  {event.date && event.location ? " • " : ""}
                                  {event.location ?? ""}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-6 text-center">
                <Package className="mx-auto h-9 w-9 text-slate-400" />

                <p className="mt-3 font-semibold text-slate-900">
                  Shipment is being prepared
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Tracking information will appear here once the shipment is
                  assigned by the courier.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Products */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Items Ordered</h2>

          <div className="mt-5 divide-y divide-slate-100">
            {(order.items ?? []).map((item: any) => (
              <div
                key={item.id}
                className="flex gap-4 py-5 first:pt-0 last:pb-0"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title ?? "Product"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-7 w-7 text-slate-300" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-slate-900">
                  {formatMoney(
                    Number(item.total ?? item.unit_price ?? 0),
                    order.currency_code
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>{formatMoney(order.subtotal, order.currency_code)}</span>
            </div>

            <div className="mt-2 flex justify-between text-sm text-slate-500">
              <span>Shipping</span>
              <span>
                {formatMoney(order.shipping_total, order.currency_code)}
              </span>
            </div>

            <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>{formatMoney(order.total, order.currency_code)}</span>
            </div>
          </div>
        </section>

        {/* Address */}
        {order.shipping_address && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-600" />

              <h2 className="font-bold text-slate-900">Delivery Address</h2>
            </div>

            <div className="mt-4 text-sm leading-6 text-slate-600">
              <p className="font-semibold text-slate-900">
                {order.shipping_address.first_name}{" "}
                {order.shipping_address.last_name}
              </p>

              <p>{order.shipping_address.address_1}</p>

              {order.shipping_address.address_2 && (
                <p>{order.shipping_address.address_2}</p>
              )}

              <p>
                {order.shipping_address.city}, {order.shipping_address.state}{" "}
                {order.shipping_address.postal_code}
              </p>

              {order.shipping_address.phone && (
                <p className="mt-2">Phone: {order.shipping_address.phone}</p>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
