import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { TransactionTable } from "./components/TransactionTable";
import { ViewTransactionDetailsModal } from "./components/ViewTransactionDetailsModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFilters, setPage, setLimit } from "@/redux/slices/transactionSlice";
import { useUrlString, useUrlNumber } from "@/hooks/useUrlState";
import type { Transaction, TransactionStatus } from "@/types";

const STATUS_OPTIONS: { value: TransactionStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "Paid", label: "Paid" },
  { value: "Refunded", label: "Refunded" },
  { value: "Pending", label: "Pending" },
];

export default function TransactionsHistory() {
  const dispatch = useAppDispatch();

  // Modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // URL state management
  const [searchQuery, setSearchQuery] = useUrlString("search", "");
  const [statusFilter, setStatusFilter] = useUrlString("status", "all");
  const [currentPage, setCurrentPage] = useUrlNumber("page", 1);
  const [itemsPerPage, setItemsPerPage] = useUrlNumber("limit", 10);

  // Redux state
  const { filteredList, pagination } = useAppSelector(
    (state) => state.transactions
  );

  // Sync URL state with Redux filters
  useEffect(() => {
    dispatch(
      setFilters({
        search: searchQuery,
        status: statusFilter as TransactionStatus | "all",
      })
    );
  }, [searchQuery, statusFilter, dispatch]);

  // Sync URL pagination with Redux
  useEffect(() => {
    dispatch(setPage(currentPage));
  }, [currentPage, dispatch]);

  useEffect(() => {
    dispatch(setLimit(itemsPerPage));
  }, [itemsPerPage, dispatch]);

  // Pagination
  const totalPages = pagination.totalPages;
  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    return filteredList.slice(startIndex, startIndex + pagination.limit);
  }, [filteredList, pagination.page, pagination.limit]);

  // Handlers
  const handleView = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-xl font-bold text-slate-800">
            Payment
          </CardTitle>
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search client name & car etc."
              className="w-[300px]"
            />

            {/* Filter Dropdown */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-secondary hover:bg-secondary text-white border-secondary">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Table */}
          <TransactionTable transactions={paginatedData} onView={handleView} />

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              totalItems={filteredList.length}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* View Transaction Details Modal */}
      <ViewTransactionDetailsModal
        open={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />
    </motion.div>
  );
}
