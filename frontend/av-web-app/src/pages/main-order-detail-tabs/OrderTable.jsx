import * as React from "react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import axios from "axios";

// Icons
import { FilePdfOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

import Orderdetails from '../main-order-detail-tabs/OrderDetails';

export default function OrderTable() {
    // API data state
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
     const [orders, setOrders] = useState([]);

    // Fetch orders from API
    const token = localStorage.getItem("token"); 
const fetchOrders = async () => {
  try {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    const response = await axios.get(
      "https://localhost:44301/api/Order/getAllOrder",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data?.payload?.data) {
      let ordersData = response.data.payload.data;

      // Ensure it's always an array
      if (!Array.isArray(ordersData)) {
        ordersData = [ordersData];
      }

      // Transform API data into DataGrid rows
      const transformedData = ordersData.map((order, index) => ({
        id: index + 1,
        orderid: order.orderNumber || `A${index + 1}`,
        name: order.customerName || "N/A",
        phone: order.phoneNo || "N/A",
        placeoforder: order.placeOfOrder || "N/A",
        ordercreated: order.orderDate
          ? dayjs(order.orderDate).format("YYYY-MM-DD")
          : "N/A",
        numberofproduct: order.products
          ? order.products.length.toString()
          : "0",
        paymentstatus: order.paymentStatus || "N/A",
        trialdate: order.trialDate
          ? dayjs(order.trialDate).format("YYYY-MM-DD")
          : "N/A",
        deliverydate: order.deliveryDate
          ? dayjs(order.deliveryDate).format("YYYY-MM-DD")
          : "N/A",
        originalData: order,
      }));

      setRows(transformedData);
    } else {
      setRows([]);
    }
  } catch (err) {
    console.error("Error fetching orders:", err);
    setError("Failed to load orders. Please try again.");
  } finally {
    setLoading(false);
  }
};


    // Fetch data on component mount
    React.useEffect(() => {
        fetchOrders();
    }, []);

    // Action handlers
    const handleRowPdf = (row) => {
        const doc = new jsPDF();
        doc.text(`Order ID: ${row.orderid}`, 14, 20);
        doc.text(`Client: ${row.name}`, 14, 30);
        doc.text(`Place: ${row.placeoforder}`, 14, 40);
        doc.text(`Payment: ${row.paymentstatus}`, 14, 50);
        doc.save(`order_${row.orderid}.pdf`);
    };

    const handleRowEdit = (row) => {
        alert(`Edit Order: ${row.orderid} - ${row.name}`);
    };

    const handleRowDelete = async (row) => {
        if (window.confirm(`Are you sure you want to delete Order ${row.orderid}?`)) {
            try {
                // Call API to delete the order
                await axios.delete(`https://localhost:44301/api/Order/deleteOrder/${row.id}`);
                
                // Remove from local state
                setRows((prevRows) => prevRows.filter((r) => r.id !== row.id));
                
                alert("Order deleted successfully!");
            } catch (err) {
                console.error("Error deleting order:", err);
                alert("Failed to delete order. Please try again.");
            }
        }
    };

    // Define columns (with action buttons)
    const columns = [
  { field: "orderid", headerName: "Order ID", width: 100 },
  { field: "name", headerName: "Client Name", width: 150 },
  { field: "phone", headerName: "Phone No", width: 150 },
  { field: "placeoforder", headerName: "Place Of Order", width: 120 },
  { field: "ordercreated", headerName: "Order Date", width: 120 },
  { field: "numberofproduct", headerName: "No Of Products", width: 120 },
  { field: "paymentstatus", headerName: "Payment Status", width: 120 },
  { field: "trialdate", headerName: "Trial Date", width: 120 },
  { field: "deliverydate", headerName: "Delivery Date", width: 120 },
  {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => (
                <Box display="flex" gap={1}>
                    <Tooltip title="Download PDF">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleRowPdf(params.row)}
                        >
                            <FilePdfOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleRowEdit(params.row)}
                        >
                            <EditOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRowDelete(params.row)}
                        >
                            <DeleteOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    // States
    const [searchText, setSearchText] = React.useState("");
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [selectedRows, setSelectedRows] = React.useState([]);

    // Filtered rows
    const filteredRows = rows.filter((row) => {
        const searchLower = searchText.toLowerCase();
        const matchesSearch = Object.values(row).some((val) =>
            String(val).toLowerCase().includes(searchLower)
        );

        const matchesDate = selectedDate
            ? dayjs(row.trialdate).isSame(selectedDate, "day") ||
            dayjs(row.deliverydate).isSame(selectedDate, "day")
            : true;

        return matchesSearch && matchesDate;
    });

    // PDF Download (whole table)
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Orders Table", 14, 15);
        doc.autoTable({
            head: [columns.filter((c) => c.field !== "action").map((col) => col.headerName)],
            body: filteredRows.map((row) =>
                columns
                    .filter((c) => c.field !== "action")
                    .map((col) => row[col.field] ?? "")
            ),
        });
        doc.save("orders-form-details.pdf");
    };

    return (
        <Box sx={{ height: "auto", width: "100%" }}>
            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Controls */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                {/* Left side - Refresh button */}
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<ReloadOutlined />}
                        onClick={fetchOrders}
                        disabled={loading}
                        sx={{ mr: 2 }}
                    >
                        {loading ? "Loading..." : "Refresh"}
                    </Button>
                </Box>

                {/* Right side - Search and other controls */}
                <Box display="flex" gap={2}>
                    {/* Search */}
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    {/* Date Picker */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Filter by Date"
                            value={selectedDate}
                            onChange={(newDate) => setSelectedDate(newDate)}
                            slotProps={{ textField: { size: "small" } }}
                        />
                    </LocalizationProvider>

                    {/* PDF Button */}
                    <Button variant="outlined" color="secondary" onClick={downloadPDF}>
                        Download PDF
                    </Button>

                    {/* Custom Button */}
                    <Button
                        component={Link}
                        to='/OrderDetails'
                        variant="contained"
                        color="primary"
                    >
                        Add New
                    </Button>
                </Box>
            </Box>

            {/* DataGrid */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                    <CircularProgress />
                </Box>
            ) : (
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10, page: 0 } },
                    }}
                    disableRowSelectionOnClick
                    checkboxSelection
                    onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
                    loading={loading}
                    autoHeight
                />
            )}
        </Box>
    );
}