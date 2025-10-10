// import React, { useEffect, useState, useRef } from 'react';
// import axiosInstance from '../utils/axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import html2canvas from 'html2canvas';
// import QRCode from 'qrcode.react';
// import Barcode from 'react-barcode';

// import { courierSellerInfo } from '../constant';


// function OrderDetails() {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const invoiceRef = useRef(null);

//     const fetchOrderDetails = async () => {
//         try {
//             const response = await axiosInstance.get(`/order/${id}`);
//             setOrder(response.data);
//         } catch (error) {
//             setError('Failed to load order details');
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchOrderDetails();
//     }, []);

//     // Generate barcode using react-barcode
//     const generateBarcode = () => {
//         return (
//             <Barcode 
//                 value={order?._id || 'ORDER123'} 
//                 width={1} 
//                 height={40} 
//                 fontSize={13}
//                 displayValue={true} 
//                 fontOptions="400" 
//                 textMargin={2} 
//                 margin={0}
//             />
//         );
//     };

//     // Generate QR code for order
//     const generateQRCode = () => {
//         const orderUrl = `https://admin.wellvas.com/orders/${order?._id}`;
//         return (
//             <QRCode
//                 value={orderUrl}
//                 size={80}
//                 level="H"
//                 includeMargin={true}
//                 style={{ display: 'block', margin: '0 auto' }}
//             />
//         );
//     };

//     // Generate invoice PDF
//     const downloadInvoice = async () => {
//         if (!invoiceRef.current) return;

//         try {
//             const canvas = await html2canvas(invoiceRef.current, {
//                 scale: 2,
//                 useCORS: true,
//                 allowTaint: true,
//                 backgroundColor: '#ffffff',
//                 logging: false,
//                 removeContainer: true
//             });

//             const imgData = canvas.toDataURL('image/png');
//             const pdf = new jsPDF('p', 'mm', 'a4');
//             const imgWidth = 210;
//             const pageHeight = 295;
//             const imgHeight = (canvas.height * imgWidth) / canvas.width;
//             let heightLeft = imgHeight;

//             let position = 0;

//             pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//             heightLeft -= pageHeight;

//             while (heightLeft >= 0) {
//                 position = heightLeft - imgHeight;
//                 pdf.addPage();
//                 pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//                 heightLeft -= pageHeight;
//             }

//             pdf.save(`invoice-${order?._id}.pdf`);
//         } catch (error) {
//             console.error('Error generating PDF:', error);
//         }
//     };

//     // Print invoice
//     const printInvoice = () => {
//         const printWindow = window.open('', '_blank');
        
//         // Create the complete invoice HTML content
//         const invoiceHTML = `
//             <html>
//                 <head>
//                     <title>Invoice - ${order?._id}</title>
//                     <style>
//                         body { 
//                             font-family: Arial, sans-serif; 
//                             margin: 0; 
//                             padding: 20px;
//                             background: #ffffff;
//                         }
//                         .invoice-container {
//                             max-width: 800px;
//                             margin: 0 auto;
//                             background: #ffffff;
//                             padding: 20px;
//                             border: 1px solid #dddddd;
//                         }
//                         .header { text-align: center; margin-bottom: 20px; }
//                                                  .prepaid-notice { 
//                              background-color: #f0f0f0;
//                              color: #000000; 
//                              padding: 8px; 
//                              text-align: center;
//                              font-weight: bold;
//                              margin-bottom: 15px;
//                          }
//                         .delivery-section { margin-bottom: 20px; }
//                         .courier-info { 
//                             display: flex; 
//                             justify-content: space-between;
//                             margin-bottom: 10px;
//                         }
//                         .courier-info div {
//                             flex: 1;
//                         }
//                         .qr-section { 
//                             display: flex; 
//                             justify-content: space-between; 
//                             margin-bottom: 20px; 
//                         }
//                         .qr-code { 
//                             width: 100px; 
//                             height: 100px; 
//                             background: #f0f0f0; 
//                             display: flex; 
//                             align-items: center; 
//                             justify-content: center;
//                             border: 1px solid #dddddd;
//                         }
//                         .barcode { 
//                             height: 60px; 
//                             background: #f8f8f8; 
//                             margin: 10px 0;
//                             display: flex;
//                             align-items: center;
//                             justify-content: center;
//                             border: 1px solid #dddddd;
//                         }
//                         .product-table { 
//                             width: 100%; 
//                             border-collapse: collapse; 
//                             margin: 20px 0;
//                         }
//                         .product-table th, .product-table td { 
//                             border: 1px solid #dddddd; 
//                             padding: 8px; 
//                             text-align: left;
//                         }
//                         .product-table th {
//                             background-color: #f8f8f8;
//                         }
//                         .company-info { margin: 20px 0; }
//                         .footer { margin-top: 30px; text-align: center; }
//                         .section-divider {
//                             border-top: 1px dashed #ccc;
//                             margin: 15px 0;
//                         }
//                         .address-block {
//                             border-left: 4px solid #3b82f6;
//                             padding-left: 10px;
//                             margin-top: 5px;
//                         }
//                         @media print {
//                             body { margin: 0; }
//                             .no-print { display: none; }
//                         }
//                     </style>
//                 </head>
//                 <body>
//                     <div class="invoice-container">
//                         <!-- Header -->
//                         <div class="header">
//                             <div class="prepaid-notice">PREPAID - DO NOT COLLECT CASH</div>
//                         </div>

//                                                  <!-- Delivery Address -->
//                          <div class="delivery-section" style="display: flex; justify-content: space-between;">
//                              <div style="flex: 1;">
//                                  <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 8px;">DELIVERY ADDRESS: ${order?.shippingAddress?.fullName || 'Customer Name'}</h3>
//                                  <div class="address-block">
//                                      <p>${order?.shippingAddress?.address || 'Address Line 1'}</p>
//                                      <p>${order?.shippingAddress?.city || 'City'}, ${order?.shippingAddress?.postalCode || 'PIN'}</p>
//                                      <p>${order?.shippingAddress?.state || 'State'}</p>
//                                      <p style="margin-top: 8px; font-size: 14px;">SURFACE</p>
//                                  </div>
//                              </div>
//                              <div style="width: 100px; height: 100px; background: #ffffff; display: flex; align-items: center; justify-content: center; border: 1px solid #dddddd; flex-direction: column;">
//                                  <div style="width: 80px; height: 80px; background: #f0f0f0; border: 1px solid #dddddd; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
//                                      <div style="font-size: 10px; color: #666;">QR Code</div>
//                                  </div>
//                                  <div style="margin-top: 4px; font-weight: bold; font-size: 10px;">${order?._id?.slice(-8)}</div>
//                              </div>
//                          </div>

//                         <!-- Courier Information -->
//                         <div class="courier-info">
//                             <div>
//                                 <p><strong>Courier Name:</strong> ${courierSellerInfo.courier.name}</p>
//                                 <p><strong>Courier AWB No:</strong> ${courierSellerInfo.courier.awbNo}</p>
//                             </div>
//                             <div>
//                                 <p><strong>HBR:</strong> ${courierSellerInfo.courier.hbr}</p>
//                                 <p><strong>CPD:</strong> ${courierSellerInfo.courier.cpd}</p>
//                             </div>
//                         </div>

//                         <div class="section-divider"></div>

//                         <!-- Seller Information -->
//                         <div class="company-info">
//                             <p><strong>Sold By:</strong> ${courierSellerInfo.seller.name}</p>
//                             <p>${courierSellerInfo.seller.address}</p>
//                             <p>${courierSellerInfo.seller.city}, ${courierSellerInfo.seller.state}</p>
//                             <p><strong>GSTIN No:</strong> ${courierSellerInfo.seller.gstinNo}</p>
//                         </div>

//                         <div class="section-divider"></div>

//                         <!-- Product Details -->
//                         <div style="margin-bottom: 16px;">
//                             <table class="product-table">
//                                 <thead>
//                                     <tr>
//                                         <th>Product</th>
//                                         <th>Qty</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     ${order?.items?.map((item, idx) => `
//                                         <tr>
//                                             <td>${item?.productId?.name || 'Product Name'}</td>
//                                             <td>${item?.quantity}</td>
//                                         </tr>
//                                     `).join('')}
//                                 </tbody>
//                                 <tfoot>
//                                     <tr>
//                                         <td><strong>Total</strong></td>
//                                         <td><strong>${order?.items?.reduce((sum, item) => sum + item.quantity, 0)}</strong></td>
//                                     </tr>
//                                 </tfoot>
//                             </table>
//                         </div>

//                         <div class="section-divider"></div>

//                         <!-- Order Information -->
//                         <div>
//                             <p><strong>Order ID:</strong> ${order?._id}</p>
//                             <p><strong>Order Date:</strong> ${new Date(order?.createdAt).toLocaleDateString('en-GB')}, ${new Date(order?.createdAt).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</p>
//                             <p><strong>Invoice No:</strong> FAAP3K2100000084</p>
//                             <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString('en-GB')}, 02:40 AM</p>
//                         </div>

//                         <div class="section-divider"></div>

//                                                  <!-- Special Instructions -->
//                          <div style="margin-bottom: 16px;">
//                              <p style="font-size: 14px;"><strong>NO PLASTIC PACKAGING</strong></p>
//                          </div>

//                          <!-- Barcode Section -->
//                          <div style="margin-bottom: 16px;">
//                              <div style="height: 4rem; background-color: #f8f8f8; margin: 10px 0; display: flex; align-items: center; justify-content: center; border: 1px solid #dddddd; padding: 10px;">
//                                  <div style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
//                                      <div style="font-size: 12px; font-weight: bold; margin-bottom: 5px;">${order?._id || 'ORDER123'}</div>
//                                      <div style="display: flex; align-items: center; height: 40px; background: #ffffff; padding: 5px; border: 1px solid #000;">
//                                          <div style="display: flex; align-items: center; height: 100%;">
//                                              ${(order?._id || 'ORDER123').split('').map(char => {
//                                                  const width = Math.random() > 0.5 ? 2 : 1;
//                                                  const height = Math.random() > 0.3 ? 100 : 80;
//                                                  return `<div style="background: #000000; display: inline-block; width: ${width}px; height: ${height}%; margin-right: 1px;"></div>`;
//                                              }).join('')}
//                                          </div>
//                                      </div>
//                                      <div style="font-size: 10px; margin-top: 5px;">Barcode</div>
//                                  </div>
//                              </div>
//                          </div>

//                         <!-- Footer -->
//                         <div class="footer">
//                             <p style="font-size: 12px; color: #6b7280;">This is a computer generated invoice</p>
//                         </div>
//                     </div>
//                 </body>
//             </html>
//         `;
        
//         printWindow.document.write(invoiceHTML);
//         printWindow.document.close();
        
//         // Wait for content to load before printing
//         printWindow.onload = () => {
//             printWindow.focus();
//             printWindow.print();
//             printWindow.close();
//         };
//     };


import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode.react';
import Barcode from 'react-barcode';

import { courierSellerInfo } from '../constant';

function OrderDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [barcodeDataUrl, setBarcodeDataUrl] = useState('');
    const invoiceRef = useRef(null);
    const qrRef = useRef(null);
    const barcodeRef = useRef(null);

    const fetchOrderDetails = async () => {
        try {
            const response = await axiosInstance.get(`/order/${id}`);
            setOrder(response.data);
        } catch (error) {
            setError('Failed to load order details');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = async () => {
              if (!invoiceRef.current) return;
      
              try {
                  const canvas = await html2canvas(invoiceRef.current, {
                      scale: 2,
                      useCORS: true,
                      allowTaint: true,
                      backgroundColor: '#ffffff',
                      logging: false,
                      removeContainer: true
                  });
      
                  const imgData = canvas.toDataURL('image/png');
                  const pdf = new jsPDF('p', 'mm', 'a4');
                  const imgWidth = 210;
                  const pageHeight = 295;
                  const imgHeight = (canvas.height * imgWidth) / canvas.width;
                  let heightLeft = imgHeight;
      
                  let position = 0;
      
                  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                  heightLeft -= pageHeight;
      
                  while (heightLeft >= 0) {
                      position = heightLeft - imgHeight;
                      pdf.addPage();
                      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                      heightLeft -= pageHeight;
                  }
      
                  pdf.save(`invoice-${order?._id}.pdf`);
              } catch (error) {
                  console.error('Error generating PDF:', error);
              }
          };

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    // Convert QR code to data URL
    useEffect(() => {
        if (qrRef.current) {
            const canvas = qrRef.current.querySelector('canvas');
            if (canvas) {
                setQrDataUrl(canvas.toDataURL('image/png'));
            }
        }
    }, [order]);

    // Convert barcode to data URL
    useEffect(() => {
        if (barcodeRef.current) {
            setTimeout(() => {
                const svg = barcodeRef.current.querySelector('svg');
                if (svg) {
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(svgBlob);
                    setBarcodeDataUrl(url);
                }
            }, 100);
        }
    }, [order]);

    // Generate QR code for order
    const generateQRCode = () => {
        const orderUrl = `https://admin.wellvas.com/orders/${order?._id}`;
        return (
            <div ref={qrRef}>
                <QRCode
                    value={orderUrl}
                    size={80}
                    level="H"
                    includeMargin={true}
                    style={{ display: 'block', margin: '0 auto' }}
                />
            </div>
        );
    };

    // Generate barcode using react-barcode
    const generateBarcode = () => {
        return (
            <div ref={barcodeRef}>
                <Barcode 
                    value={order?._id || 'ORDER123'} 
                    width={1} 
                    height={40} 
                    fontSize={13}
                    displayValue={true} 
                    fontOptions="400" 
                    textMargin={2} 
                    margin={0}
                />
            </div>
        );
    };

    // Print invoice
    const printInvoice = () => {
        const printWindow = window.open('', '_blank');
        
        // Create the complete invoice HTML content
        const invoiceHTML = `
            <html>
                <head>
                    <title>Invoice - ${order?._id}</title>
                                         <style>
                         body { 
                             font-family: Arial, sans-serif; 
                             margin: 0; 
                             padding: 5px;
                             background: #ffffff;
                         }
                         .invoice-container {
                             max-width: 600px;
                             margin: 0 auto;
                             background: #ffffff;
                             padding: 10px;
                             border: 1px solid #dddddd;
                         }
                         .header { text-align: center; margin-bottom: 10px; }
                         .prepaid-notice { 
                             background-color: #f0f0f0;
                             color: #000000; 
                             padding: 4px; 
                             text-align: center;
                             font-weight: bold;
                             margin-bottom: 8px;
                         }
                         .delivery-section { margin-bottom: 10px; }
                         .courier-info { 
                             display: flex; 
                             justify-content: space-between;
                             margin-bottom: 5px;
                         }
                         .courier-info div {
                             flex: 1;
                         }
                         .qr-section { 
                             display: flex; 
                             justify-content: space-between; 
                             margin-bottom: 10px; 
                         }
                         .qr-code { 
                             width: 200px; 
                             height: 200px  ; 
                             background: #f0f0f0; 
                             display: flex; 
                             align-items: center; 
                             justify-content: center;
                             border: 1px solid #dddddd;
                         }
                         .barcode { 
                             height: 80px; 
                             background: #f8f8f8; 
                             margin: 5px 0;
                             display: flex;
                             align-items: center;
                             justify-content: center;
                             border: 1px solid #dddddd;
                         }
                         .product-table { 
                             width: 100%; 
                             border-collapse: collapse; 
                             margin: 10px 0;
                         }
                         .product-table th, .product-table td { 
                             border: 1px solid #dddddd; 
                             padding: 4px; 
                             text-align: left;
                         }
                         .product-table th {
                             background-color: #f8f8f8;
                         }
                         .company-info { margin: 10px 0; }
                         .footer { margin-top: 15px; text-align: center; }
                         .section-divider {
                             border-top: 1px dashed #ccc;
                             margin: 8px 0;
                         }
                         .address-block {
                             border-left: 4px solid #3b82f6;
                             padding-left: 8px;
                             margin-top: 3px;
                         }
                         p { margin: 2px 0; }
                         h3 { margin: 5px 0; }
                         @media print {
                             body { margin: 0; }
                             .no-print { display: none; }
                         }
                     </style>
                </head>
                <body>
                    <div class="invoice-container">
                        <!-- Header -->
                        <div class="header">
                            <div class="prepaid-notice">PREPAID - DO NOT COLLECT CASH</div>
                        </div>

                                                 <!-- Delivery Address -->
                         <div class="delivery-section" style="display: flex; justify-content: space-between;">
                             <div style="flex: 1;">
                                 <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">Customer Name: ${order?.user?.FirstName} ${order?.user?.lastName}</h3>
                                 <div class="address-block">
                                     <p>${order?.shippingAddress?.address || 'Address Line 1'}</p>
                                     <p>${order?.shippingAddress?.city || 'City'}, ${order?.shippingAddress?.postalCode || 'PIN'}</p>
                                     <p>${order?.shippingAddress?.state || 'State'}</p>
                                     <p style="margin-top: 4px; font-size: 12px;">SURFACE</p>
                                 </div>
                             </div>
                            <div style="width: 100px; height: 100px; background: #ffffff; display: flex; align-items: center; justify-content: center; border: 1px solid #dddddd; flex-direction: column;">
                                <div style="width: 80px; height: 80px; background: #f0f0f0; border: 1px solid #dddddd; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                                    ${qrDataUrl ? `<img src="${qrDataUrl}" alt="QR Code" style="width: 80px; height: 80px;" />` : '<div style="font-size: 10px; color: #666;">QR Code</div>'}
                                </div>
                                <div style="margin-top: 4px; font-weight: bold; font-size: 10px;">${order?._id?.slice(-8)}</div>
                            </div>
                        </div>

                        <!-- Courier Information -->
                        <div class="courier-info">
                            <div>
                                <p><strong>Courier Name:</strong> ${courierSellerInfo.courier.name}</p>
                                <p><strong>Courier AWB No:</strong> ${courierSellerInfo.courier.awbNo}</p>
                            </div>
                            <div>
                                <p><strong>HBR:</strong> ${courierSellerInfo.courier.hbr}</p>
                                <p><strong>CPD:</strong> ${courierSellerInfo.courier.cpd}</p>
                            </div>
                        </div>

                        <div class="section-divider"></div>

                        <!-- Seller Information -->
                        <div class="company-info">
                            <p><strong>Sold By:</strong> ${courierSellerInfo.seller.name}</p>
                            <p>${courierSellerInfo.seller.address}</p>
                            <p>${courierSellerInfo.seller.city}, ${courierSellerInfo.seller.state}</p>
                            <p><strong>GSTIN No:</strong> ${courierSellerInfo.seller.gstinNo}</p>
                        </div>

                        <div class="section-divider"></div>

                                                 <!-- Product Details -->
                         <div style="margin-bottom: 8px;">
                             <table class="product-table">
                                 <thead>
                                     <tr>
                                         <th>Product</th>
                                         <th>Qty</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     ${order?.items?.map((item, idx) => `
                                         <tr>
                                             <td>${item?.productId?.name || 'Product Name'}</td>
                                             <td>${item?.quantity}</td>
                                         </tr>
                                     `).join('')}
                                 </tbody>
                                 <tfoot>
                                     <tr>
                                         <td><strong>Shipping charge</strong></td>
                                         <td><strong>0.00</strong></td>
                                     </tr>
                                     <tr>
                                         <td><strong>Subtotal </strong></td>
                                         <td><strong>₹${order?.totalPrice}</strong></td>
                                     </tr>
                                     <tr>
                                         <td><strong>Total</strong></td>
                                         <td><strong>₹${order?.totalPrice}</strong></td>
                                     </tr>
                                 </tfoot>
                             </table>
                         </div>

                        <div class="section-divider"></div>

                        <!-- Order Information -->
                        <div>
                            <p><strong>Order ID:</strong> ${order?._id}</p>
                            <p><strong>Order Date:</strong> ${new Date(order?.createdAt).toLocaleDateString('en-GB')}, ${new Date(order?.createdAt).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</p>
                            <p><strong>Invoice No:</strong> FAAP3K2100000084</p>
                            <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString('en-GB')}, 02:40 AM</p>
                        </div>

                        <div class="section-divider"></div>

                                                 <!-- Special Instructions -->
                         <div style="margin-bottom: 8px;">
                             <p style="font-size: 12px;"><strong>NO PLASTIC PACKAGING</strong></p>
                         </div>

                         <!-- Barcode Section -->
                         <div style="margin-bottom: 8px;">
                             <div style="height: 3rem; background-color: #f8f8f8; margin: 5px 0; display: flex; align-items: center; justify-content: center; border: 1px solid #dddddd; padding: 5px;">
                                 ${barcodeDataUrl ? `<img src="${barcodeDataUrl}" alt="Barcode" style="height: 30px; display: block; margin: 0 auto;" />` : '<div style="font-size: 10px; color: #666;">Barcode</div>'}
                             </div>
                         </div>

                        <!-- Footer -->
                        <div class="footer">
                            <p style="font-size: 12px; color: #6b7280;">This is a computer generated invoice</p>
                        </div>
                    </div>
                </body>
            </html>
        `;
        
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        
        // Wait for content to load before printing
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        };
    };



    if (loading) return <div style={{ padding: '16px', textAlign: 'center', fontSize: '18px' }}>Loading...</div>;
    if (error) return <div style={{ padding: '16px', color: '#ef4444', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '24px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Order Details</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={downloadInvoice}
                        style={{ 
                            backgroundColor: '#3b82f6', 
                            color: '#ffffff', 
                            padding: '8px 16px', 
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                    >
                        Download Invoice
                    </button>
                    <button 
                        onClick={printInvoice}
                        style={{ 
                            backgroundColor: '#10b981', 
                            color: '#ffffff', 
                            padding: '8px 16px', 
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                    >
                        Print Invoice
                    </button>
                    <button 
                        onClick={() => navigate('/')} 
                        style={{ 
                            backgroundColor: '#7bf249', 
                            color: '#ffffff', 
                            padding: '8px 16px', 
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Back
                    </button>
                </div>
            </div>

            {/* Invoice Section */}
            <div ref={invoiceRef} style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #d1d5db', 
                padding: '15px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '0.9rem',
            }}>
                {/* Header */}
              {order?.paymentResult?.paymentStatus === 'paid' &&
               <div style={{ textAlign: 'center'}}>
                  <div style={{ 
                    //light gray

                    backgroundColor:"#f0f0f0",
                    fontSize: '0.9rem',
                      color: 'black', 
                      padding: '8px', 
                      textAlign: 'left', 
                      fontWeight: 'semibold', 
                      marginBottom: '8px' 
                  }}>
                      PREPAID - DO NOT COLLECT CASH
                  </div>
              </div>}

                {/* Delivery Address */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>Customer Name: {order?.user?.firstName} {order?.user?.lastName }</h3>
                    <div style={{ borderLeft: '4px solid #3b82f6',fontSize: '0.9rem', paddingLeft: '10px', marginTop: '5px' }}>
                        <p>{order?.shippingAddress?.address || 'Address Line 1'}</p>    
                        <p>{order?.shippingAddress?.city || 'City'}, {order?.shippingAddress?.postalCode || 'PIN'}</p>
                        <p>{order?.shippingAddress?.state || 'State'}</p>
                       
                    </div>
                </div>
                <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    backgroundColor: '#ffffff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    border: '1px solid #dddddd',
                    flexDirection: 'column'
                }}>
                    {generateQRCode()}
                    <div style={{ marginTop: '4px', fontWeight: 'bold', fontSize: '10px' }}>{order?._id?.slice(-8)}</div>
                </div>
                </div>


                {/* Courier Information */}
                <div style={{ display: 'flex', backgroundColor: '#f0f0f0', padding: '10px', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <p><strong>Courier Name:</strong> {courierSellerInfo.courier.name}</p>
                        <p><strong>Courier AWB No:</strong> {courierSellerInfo.courier.awbNo}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p><strong>HBR:</strong> {courierSellerInfo.courier.hbr}</p>
                        <p><strong>CPD:</strong> {courierSellerInfo.courier.cpd}</p>
                    </div>
                </div>

                <div style={{ borderTop: '1px dashed #ccc', margin: '15px 0' }}></div>

                {/* Seller Information */}
                <div style={{ margin: '20px 0' }}>
                    <p><strong>Sold By:</strong> {courierSellerInfo.seller.name}</p>
                    <p>{courierSellerInfo.seller.address}</p>
                    <p>{courierSellerInfo.seller.city}, {courierSellerInfo.seller.state}</p>
                    <div style={{ borderTop: '1px dashed #ccc', margin: '15px 0' }}></div>
                    <p><strong>GSTIN No:</strong> {courierSellerInfo.seller.gstinNo}</p>
                </div>

                <div style={{ borderTop: '1px dashed #ccc', margin: '15px 0' }}></div>

                {/* Product Details */}
                <div style={{ marginBottom: '16px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Product</th>
                                <th style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left', backgroundColor: '#f8f8f8' }}>Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.items?.map((item, idx) => (
                                <tr key={idx}>
                                    <td style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}>{item?.productId?.name || 'Product Name'}</td>
                                    <td style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}>{item?.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}><strong>Shipping charge</strong></td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}><strong>0.00</strong></td>
                                 </tr>
                            <tr>
                                <td style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}><strong>Subtotal </strong></td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}><strong>₹{order?.totalPrice}</strong></td>
                               </tr>
                            <tr>
                                 <td style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}><strong>Total</strong></td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}><strong>₹{order?.totalPrice}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div style={{ borderTop: '1px dashed #ccc', margin: '15px 0' }}></div>

                

                {/* Order Information */}
                <div>
                    <p><strong>Order ID:</strong> {order?._id}</p>
                    <p><strong>Order Date:</strong> {new Date(order?.createdAt).toLocaleDateString('en-GB')}, {new Date(order?.createdAt).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</p>
                    <p><strong>Invoice No:</strong> FAAP3K2100000084</p>
                    <p><strong>Invoice Date:</strong> {new Date().toLocaleDateString('en-GB')}, 02:40 AM</p>
                </div>

                <div style={{ borderTop: '1px dashed #ccc', margin: '15px 0' }}></div>

                {/* Special Instructions */}
               

                {/* Barcode Section */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ 
                        height: '4rem', 
                        backgroundColor: '#f8f8f8', 
                        margin: '10px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #dddddd',
                        padding: '10px'
                    }}>
                        {generateBarcode()}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>This is a computer generated invoice</p>
                </div>
            </div>

            {/* Original Order Details */}
            <div style={{ marginTop: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '16px' }}>Order Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <p><strong>Order ID:</strong> {order?._id}</p>
                        <p><strong>Status:</strong> {order?.orderStatus}</p>
                        <p><strong>Payment Method:</strong> {order?.paymentResult?.paymentMethod}</p>
                        <p><strong>Payment Status:</strong> {order?.paymentResult?.paymentStatus}</p>
                        <p><strong>Total Price:</strong> ₹{order?.totalPrice}</p>
                        <p><strong>Shipping Price:</strong> ₹{order?.shippingPrice}</p>
                    </div>
                    <div>
                        <p><strong>Delivered:</strong> {order?.isDelivered ? 'Yes' : 'No'}</p>
                        <p><strong>Created At:</strong> {new Date(order?.createdAt).toLocaleString()}</p>
                        <p><strong>Updated At:</strong> {new Date(order?.updatedAt).toLocaleString()}</p>
                        <p><strong>Razorpay Order ID:</strong> {order?.razorpay_order_id || 'N/A'}</p>
                    </div>
                </div>

                <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '500', marginTop: '24px', marginBottom: '8px' }}>Shipping Address</h3>
                    <p>{order?.shippingAddress?.address}, {order?.shippingAddress?.city}</p>
                </div>

                <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '500', marginTop: '24px', marginBottom: '8px' }}>User Info</h3>
                    <p><strong>Name:</strong> {order?.user?.firstName} {order.user.lastName}</p>
                    <p><strong>Email:</strong> {order?.user?.email}</p>

                    <p><strong>Phone:</strong> {order?.user?.phone}</p>
                    <p><strong>User ID:</strong> {order?.user?._id}</p>
                    <p><strong>Email:</strong> {order?.user?.email}</p>
                </div>
                <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '500', marginTop: '24px', marginBottom: '8px' }}>Coupon Applied : {order?.couponCode || 'N/A'}</h3>
                    
                </div>

                <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '500', marginTop: '24px', marginBottom: '8px' }}>Items</h3>
                    {order?.items?.map((item, idx) => (
                        <div key={idx} style={{ 
                            padding: '16px', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '6px', 
                            marginBottom: '8px', 
                            backgroundColor: '#f9fafb' 
                        }}>
                            <p><strong>Product Name:</strong> {item?.productId?.name || 'Unknown Product'}</p>
                            <p><strong>Brand:</strong> {item?.productId?.brand || 'N/A'}</p>
                            <p><strong>Price:</strong> ₹{item?.price}</p>
                            <p><strong>Quantity:</strong> {item?.quantity}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
