import { Badge } from "@/components/ui/badge";
import TableComponent from "@/components/shared/Table";
import { Order } from "@/components/services/types/orders";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

interface OrdersTableProps {
  orderData: Order[];
  onEditOrder: (order: Order) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const normalizeString = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export const OrdersTable = ({
  orderData,
  onEditOrder,
  currentPage,
  totalPages,
  onPageChange,
}: OrdersTableProps) => {
  const isLoading = useSelector((state: RootState) => state.orders.isLoading);

  const getStatusStyle = (
    status: string
  ): { backgroundColor: string; color: string } => {
    const normalizedStatus = normalizeString(status);

    switch (normalizedStatus) {
      case "livre":
        return { backgroundColor: "#4CAF50", color: "white" };
      case "en cours":
        return { backgroundColor: "#FF9800", color: "black" };
      case "en attente":
        return { backgroundColor: "#FFEB3B", color: "black" };
      case "annule":
        return { backgroundColor: "#FF0000", color: "white" };
      default:
        return { backgroundColor: "#CCCCCC", color: "black" };
    }
  };

  return (
    <TableComponent
      data={orderData}
      columns={[
        {
          header: "Client",
          accessor: "customer_name",
          cell: (order) => (
            <>
              <div className="font-medium">{order.customer_name}</div>
              <div className="hidden text-sm text-muted-foreground md:inline">
                {order.customer_email}
              </div>
            </>
          ),
          sortable: true,
        },
        {
          header: "Type",
          accessor: "type",
          className: "hidden sm:table-cell",
          sortable: true,
        },
        {
          header: "Statut",
          accessor: "status",
          className: "hidden sm:table-cell",
          cell: (order) => (
            <Badge
              variant="custom"
              className="text-xs"
              customStyle={getStatusStyle(order.status)}
            >
              {order.status}
            </Badge>
          ),
          sortable: true,
        },
        {
          header: "Date",
          accessor: "date",
          className: "hidden md:table-cell",
          sortable: true,
        },
        {
          header: "Montant",
          accessor: "amount",
          className: "text-right",
          cell: (order) =>
            `$${
              typeof order.amount === "number"
                ? order.amount.toFixed(2)
                : order.amount
            }`,
          sortable: true,
        },
      ]}
      onRowClick={onEditOrder}
      itemsPerPage={5}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
};
