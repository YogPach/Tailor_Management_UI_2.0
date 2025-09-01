import React, { useState } from "react";
import OrderReceipt from "./OrderReceipt";
import axios from "axios";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Typography,
  Grid,
  Checkbox,
  ListItemText,
} from "@mui/material";
import {
  DownOutlined,
  UpOutlined,
  PlusOutlined,
  MinusOutlined,
  CameraOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import MainCard from "components/MainCard";

export default function OrderDetails() {
  const [formData, setFormData] = useState({
    orderNumber: "",
    customerName: "",
    phoneNo: "",
    address: "",
    placeOfOrder: "",
    orderDate: "",
    email: "",
    trialDate: "",
    deliveryDate: "",
    paymentStatus: "",
    orderTypes: [],
    products: [],
    measurementTypes: [],
    selectOccasions: [],
    selectSeasons: [],
    selectTimePeriods: [],
    orderProducts: [],
  });

  const [expandedRows, setExpandedRows] = useState({});
  const [quantities, setQuantities] = useState({
    1: 1,
    2: 1,
    3: 1,
    4: 1,
  });
  const [showReceipt, setShowReceipt] = useState(false);

  // Sample products
  const products = [
    { id: 1, srNo: "01", product: "shirt" },
    { id: 2, srNo: "02", product: "sherwani" },
    { id: 3, srNo: "03", product: "jacket" },
    { id: 4, srNo: "04", product: "pant" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "products") {
      const selectedProducts =
        typeof value === "string" ? value.split(",") : value;

      const newQuantities = { ...quantities };
      selectedProducts.forEach((p) => {
        const productId = products.find(
          (prod) => prod.product.toLowerCase() === p
        )?.id;
        if (productId && !newQuantities.hasOwnProperty(productId)) {
          newQuantities[productId] = 1;
        }
      });
      setQuantities(newQuantities);

      setFormData({ ...formData, products: selectedProducts });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const buildOrderPayload = () => {
    return {
      orderNumber: formData.orderNumber || null,
      customerName: formData.customerName || "",
      phoneNo: formData.phoneNo || "",
      address: formData.address || "",
      placeOfOrder: formData.placeOfOrder || "",
      orderDate: formData.orderDate
        ? new Date(formData.orderDate)
        : new Date(),
      email: formData.email || "",
      trialDate: formData.trialDate
        ? new Date(formData.trialDate)
        : new Date(),
      deliveryDate: formData.deliveryDate
        ? new Date(formData.deliveryDate)
        : new Date(),
      paymentStatus: formData.paymentStatus || "",
      orderTypes: formData.orderTypes || [],
      products: formData.products || [],
      measurementTypes: formData.measurementTypes || [],
      selectOccasions: formData.selectOccasions || [],
      selectSeasons: formData.selectSeasons || [],
      selectTimePeriods: formData.selectTimePeriods || [],
      orderProducts: (formData.products || []).map((p) => {
        const productObj = products.find(
          (prod) => prod.product.toLowerCase() === p
        );
        return {
          orderProductId: null,
          productName: productObj?.product || p,
          quantity: quantities[productObj?.id] || 1,
          note: "",
          fileAttachmentBase64: "",
        };
      }),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = buildOrderPayload();
      console.log("Payload:", payload);

      await axios.post(
        "https://localhost:44301/api/Order/addNewOrder",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order saved successfully!");
    } catch (error) {
      console.error("Error saving order:", error.response?.data || error);
      alert("Failed to save order. Check console for details.");
    }
  };

  const toggleRow = (rowId) => {
    setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const updateQuantity = (rowId, increment) => {
    setQuantities((prev) => ({
      ...prev,
      [rowId]: Math.max(1, (prev[rowId] || 1) + increment),
    }));
  };

  return (
    <>
      <MainCard title="Order Details">
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  label="Order Number"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  label="Phone No."
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="Order Date"
                  name="orderDate"
                  value={formData.orderDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
            </Grid>
            {/* Other Select/Fields here... */}
          </Box>

          {/* Submit buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined">Cancel</Button>
            <Button variant="outlined" type="submit">
              Save
            </Button>
            <Button
              variant="contained"
              onClick={() => setShowReceipt(true)}
            >
              Save & Print
            </Button>
          </Box>
        </form>
      </MainCard>

      {showReceipt && (
        <OrderReceipt
          orderData={{
            ...formData,
            quantities,
          }}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </>
  );
}
