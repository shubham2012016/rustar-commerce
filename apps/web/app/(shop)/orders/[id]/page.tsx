"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  ExternalLink,
  MapPin,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react"

import { retrieveCustomerOrder, retrieveOrderTracking } from "@/services/orders"

/* ============================================================
   TYPES
============================================================ */

type TrackingActivity = {
  id?: string | number | null
  date?: string | null
  status?: string | null
  activity?: string | null
  location?: string | null
}

type TrackingData = {
  orderId?: number | string
  fulfillmentId?: string
  provider?: string
  shipmentId?: number | string | null
  shiprocketOrderId?: number | string | null
  awb?: string | null
  trackingNumber?: string | null
  trackingUrl?: string | null
  status?: string | null
  statusText?: string | null
  statusCode?: number | null
  courierName?: string | null
  estimatedDeliveryDate?: string | null
  activities?: TrackingActivity[]
}

/* ============================================================
   MONEY
============================================================ */

function formatMoney(amount: number, currencyCode?: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode?.toUpperCase() || "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0))
}

/* ============================================================
   DATE
============================================================ */

function formatDate(date?: string | null) {
  if (!date) return ""

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date)
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate)
}

function formatDeliveryDate(date?: string | null) {
  if (!date) return "Not available"

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date)
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate)
}

/* ============================================================
   STATUS HELPERS
============================================================ */

function humanizeStatus(status?: string | null) {
  if (!status) return "Processing"

  return String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

/**
 * Convert Shiprocket's human-readable status into
 * one stable internal status.
 *
 * IMPORTANT:
 * We intentionally prefer statusText over statusCode/status.
 *
 * Shiprocket's current response says:
 *
 * current_status: "Pickup Generated"
 * current_status_id: 3
 *
 * Therefore "Pickup Generated" is the authoritative
 * value for the UI.
 */
function normalizeTrackingStatus(
  status?: string | null,
  statusText?: string | null
) {
  const text = String(statusText ?? "")
    .trim()
    .toLowerCase()

  const statusValue = String(status ?? "")
    .trim()
    .toLowerCase()

  if (
    text.includes("pickup generated") ||
    text.includes("pickup booked") ||
    text.includes("pickup scheduled")
  ) {
    return "pickup_generated"
  }

  if (
    text === "picked up" ||
    text.includes("picked up") ||
    text.includes("pickup completed")
  ) {
    return "picked_up"
  }

  if (
    text.includes("in transit") ||
    text.includes("in-transit") ||
    text.includes("transit")
  ) {
    return "in_transit"
  }

  if (text.includes("out for delivery") || text.includes("out-for-delivery")) {
    return "out_for_delivery"
  }

  if (text.includes("delivered")) {
    return "delivered"
  }

  if (
    text.includes("cancelled") ||
    text.includes("canceled") ||
    text.includes("cancel")
  ) {
    return "cancelled"
  }

  if (text.includes("rto")) {
    return "rto"
  }

  if (text.includes("lost")) {
    return "lost"
  }

  if (text.includes("damaged")) {
    return "damaged"
  }

  if (statusValue === "pickup_generated") {
    return "pickup_generated"
  }

  if (statusValue === "pickup_booked") {
    return "pickup_generated"
  }

  if (statusValue === "picked_up") {
    return "picked_up"
  }

  if (statusValue === "in_transit") {
    return "in_transit"
  }

  if (statusValue === "out_for_delivery") {
    return "out_for_delivery"
  }

  if (statusValue === "delivered") {
    return "delivered"
  }

  if (statusValue === "cancelled") {
    return "cancelled"
  }

  if (statusValue === "rto") {
    return "rto"
  }

  return "shipment_created"
}

/* ============================================================
   TRACKING STAGES
============================================================ */

const TRACKING_STAGES = [
  {
    id: "shipment_created",
    title: "Order Confirmed",
    description: "Your order has been confirmed.",
  },
  {
    id: "pickup_generated",
    title: "Pickup Generated",
    description: "The shipment pickup has been generated.",
  },
  {
    id: "picked_up",
    title: "Picked Up",
    description: "The courier has collected your shipment.",
  },
  {
    id: "in_transit",
    title: "In Transit",
    description: "Your shipment is moving toward the destination.",
  },
  {
    id: "out_for_delivery",
    title: "Out for Delivery",
    description: "Your shipment is with the delivery agent.",
  },
  {
    id: "delivered",
    title: "Delivered",
    description: "Your shipment has been delivered.",
  },
]

const STAGE_INDEX: Record<string, number> = {
  shipment_created: 0,
  pickup_generated: 1,
  picked_up: 2,
  in_transit: 3,
  out_for_delivery: 4,
  delivered: 5,
}

/* ============================================================
   STATUS CLASSIFICATION
============================================================ */

function isTerminalProblemStatus(status: string) {
  return [
    "cancelled",
    "rto",
    "lost",
    "damaged",
    "destroyed",
    "undelivered",
  ].includes(status)
}

function getStageIndex(status: string) {
  return STAGE_INDEX[status] ?? 0
}

/* ============================================================
   GENERATED TIMELINE
============================================================ */

/**
 * Shiprocket can return shipment_track_activities: null.
 *
 * In that case we cannot fabricate actual historical events.
 * However, we CAN accurately show the shipment workflow:
 *
 * completed stages -> current stage -> future stages.
 *
 * Only the current status is based on live courier data.
 */
function buildProgressTimeline(currentStatus: string) {
  const currentIndex = getStageIndex(currentStatus)

  return TRACKING_STAGES.map((stage, index) => {
    if (index < currentIndex) {
      return {
        ...stage,
        state: "completed" as const,
      }
    }

    if (index === currentIndex) {
      return {
        ...stage,
        state: "current" as const,
      }
    }

    return {
      ...stage,
      state: "pending" as const,
    }
  })
}

/* ============================================================
   COMPONENT
============================================================ */

export default function OrderDetailsPage() {
  const params = useParams()

  const orderId = String(params.id)

  const [order, setOrder] = useState<any>(null)

  const [tracking, setTracking] = useState<TrackingData | null>(null)

  const [loading, setLoading] = useState(true)

  const [trackingLoading, setTrackingLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  /* ============================================================
     LOAD ORDER
  ============================================================ */

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

  /* ============================================================
     LOAD TRACKING
  ============================================================ */

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

  /* ============================================================
     LOAD EVERYTHING
  ============================================================ */

  async function loadEverything() {
    await Promise.all([loadOrder(), loadTracking()])
  }

  /* ============================================================
     INITIAL LOAD
  ============================================================ */

  useEffect(() => {
    if (orderId) {
      loadEverything()
    }
  }, [orderId])

  /* ============================================================
     TRACKING DATA

     IMPORTANT:
     These calculations happen before any conditional return.
     There are no hooks here, so the component keeps a stable
     React hook order on every render.
  ============================================================ */

  const activities = Array.isArray(tracking?.activities)
    ? tracking.activities
    : []

  const currentStatus = normalizeTrackingStatus(
    tracking?.status,
    tracking?.statusText
  )

  const currentStatusText =
    tracking?.statusText ?? humanizeStatus(currentStatus)

  const courierName = tracking?.courierName ?? "Shiprocket"

  const progressTimeline = buildProgressTimeline(currentStatus)

  const terminalProblem = isTerminalProblemStatus(currentStatus)

  /* ============================================================
     LOADING
  ============================================================ */

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

  /* ============================================================
     ERROR
  ============================================================ */

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

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <main className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER ACTIONS
        ====================================================== */}

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
            disabled={loading || trackingLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${trackingLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* =====================================================
            ORDER HEADING
        ====================================================== */}

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

        {/* =====================================================
            TRACKING
        ====================================================== */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* HEADER */}

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
            {/* =================================================
                TRACKING LOADING
            ================================================== */}

            {trackingLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-40 rounded bg-slate-200" />

                <div className="h-4 w-64 rounded bg-slate-200" />

                <div className="h-4 w-48 rounded bg-slate-200" />

                <div className="h-20 rounded-2xl bg-slate-100" />
              </div>
            ) : tracking ? (
              <div>
                {/* =============================================
                    CURRENT STATUS
                ============================================== */}

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-slate-500">Current Status</p>

                    <div className="mt-1 flex items-center gap-2">
                      {terminalProblem ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : currentStatus === "delivered" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Truck className="h-5 w-5 text-blue-600" />
                      )}

                      <p className="text-xl font-bold text-slate-900">
                        {currentStatusText}
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

                {/* =============================================
                    SHIPMENT METADATA
                ============================================== */}

                <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      AWB Number
                    </p>

                    <p className="mt-2 font-bold break-all text-slate-900">
                      {tracking.awb ?? "Not assigned yet"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Shipment ID
                    </p>

                    <p className="mt-2 font-bold break-all text-slate-900">
                      {tracking.shipmentId ?? "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Carrier
                    </p>

                    <p className="mt-2 font-bold text-slate-900">
                      {courierName}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      Estimated Delivery
                    </p>

                    <p className="mt-2 font-bold text-slate-900">
                      {formatDeliveryDate(tracking.estimatedDeliveryDate)}
                    </p>
                  </div>
                </div>

                {/* =============================================
                    SHIPMENT PROGRESS
                ============================================== */}

                {!terminalProblem && (
                  <div className="mt-8 border-t border-slate-100 pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Shipment Progress
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Your shipment status is updated from Shiprocket.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      {progressTimeline.map((stage, index) => {
                        const isLast = index === progressTimeline.length - 1

                        return (
                          <div key={stage.id} className="relative flex gap-4">
                            {/* CONNECTING LINE */}

                            {!isLast && (
                              <div
                                className={`absolute top-7 left-[11px] h-[calc(100%-4px)] w-0.5 ${
                                  stage.state === "completed"
                                    ? "bg-blue-600"
                                    : "bg-slate-200"
                                }`}
                              />
                            )}

                            {/* ICON */}

                            <div className="relative z-10 shrink-0">
                              {stage.state === "completed" && (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                                  <Check className="h-3.5 w-3.5" />
                                </div>
                              )}

                              {stage.state === "current" && (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 ring-4 ring-blue-100">
                                  <div className="h-2.5 w-2.5 rounded-full bg-white" />
                                </div>
                              )}

                              {stage.state === "pending" && (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-200 bg-white">
                                  <Circle className="h-2.5 w-2.5 fill-slate-200 text-slate-200" />
                                </div>
                              )}
                            </div>

                            {/* CONTENT */}

                            <div className={`pb-7 ${isLast ? "pb-0" : ""}`}>
                              <p
                                className={`font-semibold ${
                                  stage.state === "pending"
                                    ? "text-slate-400"
                                    : "text-slate-900"
                                }`}
                              >
                                {stage.title}
                              </p>

                              <p
                                className={`mt-1 text-sm ${
                                  stage.state === "pending"
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                }`}
                              >
                                {stage.description}
                              </p>

                              {stage.state === "current" && (
                                <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                  Current status
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* =============================================
                    PROBLEM STATUS
                ============================================== */}

                {terminalProblem && (
                  <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-5">
                    <div className="flex items-start gap-3">
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                      <div>
                        <p className="font-semibold text-red-900">
                          {currentStatusText}
                        </p>

                        <p className="mt-1 text-sm text-red-700">
                          Please check the latest courier information or contact
                          support if you need assistance.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* =============================================
                    COURIER STATUS CODE
                ============================================== */}

                {tracking.statusCode !== null &&
                  tracking.statusCode !== undefined && (
                    <div className="mt-4 text-xs text-slate-400">
                      Courier status code: {tracking.statusCode}
                    </div>
                  )}

                {/* =============================================
                    REAL SHIPROCKET ACTIVITIES
                ============================================== */}

                {activities.length > 0 && (
                  <div className="mt-8 border-t border-slate-100 pt-6">
                    <h3 className="font-bold text-slate-900">
                      Tracking Updates
                    </h3>

                    <div className="mt-5 space-y-5">
                      {activities.map(
                        (event: TrackingActivity, index: number) => (
                          <div
                            key={`${event.id ?? index}-${event.date ?? ""}`}
                            className="flex gap-4"
                          >
                            <div className="relative flex flex-col items-center">
                              <div className="z-10 flex h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-50" />

                              {index < activities.length - 1 && (
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

                              {event.status &&
                                event.status !== event.activity && (
                                  <p className="mt-1 text-xs font-medium tracking-wide text-slate-400 uppercase">
                                    {humanizeStatus(event.status)}
                                  </p>
                                )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* =============================================
                    NO ACTIVITY MESSAGE
                ============================================== */}

                {activities.length === 0 && !terminalProblem && (
                  <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                    <div className="flex items-start gap-3">
                      <Package className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

                      <div>
                        <p className="font-semibold text-slate-900">
                          Live shipment status available
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Detailed courier events will appear here when
                          Shiprocket provides them.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ===============================================
                 NO TRACKING YET
              ================================================ */

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

        {/* =====================================================
            PRODUCTS
        ====================================================== */}

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

        {/* =====================================================
            ADDRESS
        ====================================================== */}

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
