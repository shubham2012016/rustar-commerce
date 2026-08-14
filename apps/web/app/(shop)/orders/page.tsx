"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  ChevronRight,
  Package,
  RefreshCw,
  ShoppingBag,
} from "lucide-react"

import { useAuthStore } from "@/store/auth.store"
import { listCustomerOrders } from "@/services/orders"

type Order = any

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
  }).format(new Date(date))
}

function getOrderStatus(order: Order) {
  if (order.fulfillment_status === "delivered") {
    return {
      label: "Delivered",
      className: "bg-green-50 text-green-700",
    }
  }

  if (
    order.fulfillment_status === "shipped" ||
    order.fulfillment_status === "partially_shipped"
  ) {
    return {
      label: "Shipped",
      className: "bg-blue-50 text-blue-700",
    }
  }

  if (
    order.fulfillment_status === "fulfilled" ||
    order.fulfillment_status === "partially_fulfilled"
  ) {
    return {
      label: "Processing",
      className: "bg-amber-50 text-amber-700",
    }
  }

  return {
    label: "Order Placed",
    className: "bg-slate-100 text-slate-700",
  }
}

export default function OrdersPage() {
  const initialized = useAuthStore((state) => state.initialized)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const initialize = useAuthStore((state) => state.initialize)

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadOrders() {
    setLoading(true)
    setError(null)

    try {
      const response = await listCustomerOrders()

      setOrders(response.orders ?? [])
    } catch (err) {
      console.error("[orders] Failed to load orders:", err)

      setError(
        err instanceof Error ? err.message : "Failed to load your orders."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  useEffect(() => {
    if (initialized && isAuthenticated) {
      loadOrders()
    } else if (initialized) {
      setLoading(false)
    }
  }, [initialized, isAuthenticated])

  if (!initialized || loading) {
    return (
      <main className="min-h-[70vh] bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-40 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-64 rounded bg-slate-200" />

            <div className="mt-10 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-40 rounded-2xl bg-white shadow-sm"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] bg-slate-50">
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Package className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Sign in to view your orders
          </h1>

          <p className="mt-3 text-slate-500">
            Your order history and shipment tracking are available after signing
            in.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Sign In
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold tracking-wider text-blue-600 uppercase">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-slate-500">
              View your orders and track your shipments.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-semibold">Unable to load orders</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <ShoppingBag className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              No orders yet
            </h2>

            <p className="mt-2 text-slate-500">
              Your completed purchases will appear here.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="mt-8 space-y-5">
          {orders.map((order) => {
            const status = getOrderStatus(order)

            const itemCount =
              order.items?.reduce(
                (total: number, item: any) =>
                  total + Number(item.quantity ?? 0),
                0
              ) ?? 0

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-bold text-slate-900">
                          Order #{order.display_id ?? order.id}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>

                    <ChevronRight className="hidden h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600 sm:block" />
                  </div>

                  <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                        Items
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                        Total
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {formatMoney(order.total, order.currency_code)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                        Payment
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 capitalize">
                        {order.payment_status ?? "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
