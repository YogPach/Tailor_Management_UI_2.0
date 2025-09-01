import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Button,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { PrinterOutlined, DownloadOutlined } from "@ant-design/icons";
import MainCard from "components/MainCard";

const OrderReceipt = ({ orderData, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDateTime = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const generateOrderId = () => {
    return `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement PDF download functionality
    console.log("Download functionality to be implemented");
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        zIndex: 1300,
      }}
    >
      <Fade in={true}>
        <Box sx={{ 
          width: '95%', 
          maxWidth: '900px', 
          maxHeight: '95vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          position: 'relative',
          zIndex: 1301,
        }}>
         
          {/* Receipt Content */}
          <Box sx={{ p: 4, bgcolor: 'white' }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                maxWidth: "800px",
                mx: "auto",
                border: "1px solid #e0e0e0",
                bgcolor: 'white',
                "@media print": {
                  boxShadow: "none",
                  border: "1px solid #ccc",
                },
              }}
            >
              {/* Header */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {formatDateTime()}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", flex: 1 }}>
                    Tailor Order Form
                  </Typography>
                  <Box sx={{ width: "60px" }}></Box>
                </Box>
                
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Box sx={{ 
                    width: "60px", 
                    height: "60px", 
                    backgroundColor: "#1976d2", 
                    borderRadius: "50%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2
                  }}>
                    <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
                      👔
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}>
                    Royal Tailors
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#666", mb: 0.5 }}>
                    123 Fashion Street, Tailor Town
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#888" }}>
                    Phone: +1 (123) 456-7890 | Email: info@royaltailors.com
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Order Summary Title */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                  Order Summary
                </Typography>
              </Box>

              {/* Customer & Order Details */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Customer & Order Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Order ID:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {orderData?.orderid || generateOrderId()}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Customer Name:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {orderData?.custname || "enter name"}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Phone:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {orderData?.mobile || "12345678"}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Email:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {orderData?.email || "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Address:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {orderData?.address || "address here"}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Order Date:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {formatDate(orderData?.orderdate)}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Place of Order:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                        {orderData?.placeOfOrder || "Online"}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Order Type:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                        {orderData?.orderType || "Individual"}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Occasion:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                        {orderData?.occasion || "Wedding"}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Season:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                        {orderData?.season || "Summer"}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Time Period:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                        {orderData?.timePeriod || "Morning"}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Payment Status:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          textTransform: "capitalize",
                          color: orderData?.paymentStatus === "paid" ? "#4caf50" : "#ff9800",
                        }}
                      >
                        {orderData?.paymentStatus || "Paid"}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Trial Date:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {formatDate(orderData?.trialdate)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                        Delivery Date:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {formatDate(orderData?.deliverydate)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Products Ordered */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Products Ordered
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>Sr. No</TableCell>
                        <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>Product Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>Quantity</TableCell>
                        <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>Piece Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderData?.products?.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ border: "1px solid #ddd" }}>{index + 1}</TableCell>
                          <TableCell sx={{ border: "1px solid #ddd", textTransform: "capitalize" }}>
                            {product.charAt(0).toUpperCase() + product.slice(1)}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #ddd" }}>
                            {orderData?.quantities?.[index + 1] || 1}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #ddd" }}>N/A</TableCell>
                          <TableCell sx={{ border: "1px solid #ddd" }}>N/A</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Footer */}
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  Thank you for your order with Royal Tailors!
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                  For any queries, please contact us at +1 (123) 456-7890 or email info@royaltailors.com
                </Typography>
                <Typography variant="body2" sx={{ color: "#888", fontSize: "0.875rem" }}>
                  Generated on {formatDateTime()}
                </Typography>
              </Box>
            </Paper>
            <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
             
              <Button 
                variant="outlined" 
                onClick={onClose}
                sx={{ 
                  backgroundColor: "#f5f5f5", 
                  color: "#666",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  }
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<PrinterOutlined />}
                onClick={handlePrint}
                sx={{ 
                  backgroundColor: "primary", 
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  }
                }}
              >
                Print
              </Button>
            </Box>
          </Box>
          
        </Box>
      </Fade>
    </Modal>
  );
};

export default OrderReceipt;
