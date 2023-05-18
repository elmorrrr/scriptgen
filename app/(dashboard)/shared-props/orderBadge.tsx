import clsx from "clsx"

export enum OrderStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
  Processing = "processing",
  Returned = "returned", // new option
  Refunded = "refunded", // new option
}

type OrderBadgeProps = {
  status: OrderStatus
}

export default function OrderBadge({ status }: OrderBadgeProps) {
  const getStatusClasses = () => {
    switch (status) {
      case OrderStatus.Pending:
        return "bg-yellow-200 text-yellow-800"
      case OrderStatus.Processing:
        return "bg-blue-200 text-blue-800"
      case OrderStatus.Shipped:
        return "bg-green-200 text-green-800"
      case OrderStatus.Delivered:
        return "bg-green-500 text-white"
      case OrderStatus.Cancelled:
        return "bg-red-200 text-red-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  return (
    <span
      className={clsx(
        "inline-block rounded-full px-2 py-1 text-xs font-semibold",
        getStatusClasses()
      )}
    >
      {status}
    </span>
  )
}
