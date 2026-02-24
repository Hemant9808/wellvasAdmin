import React, { forwardRef } from 'react';

const InvoiceTemplate = forwardRef(({ invoiceData }, ref) => {
    const {
        invoiceNumber = '181',
        invoiceDate = new Date(),
        expiryDate = new Date(),
        billTo = {},
        shipTo = {},
        items = [],
        subtotal = 0,
        cgst = 0,
        sgst = 0,
        total = 0,
        amountInWords = '',
        bankDetails = {},
        paymentQRData = ''
    } = invoiceData;

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    };

    return (
        <div id="invoice-template" ref={ref} className="invoice-container" style={{ width: '210mm', minHeight: '297mm', padding: '10mm', fontFamily: 'Arial, sans-serif', fontSize: '10pt', boxSizing: 'border-box', backgroundColor: 'white' }}>

            {/* Header */}
            <div style={{ borderBottom: '3px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>
                <h1 style={{ fontSize: '18pt', fontWeight: 'bold', margin: 0 }}>INVOICE</h1>
            </div>

            {/* Company and Invoice Info Grid */}
            <table style={{ width: '100%', border: '1px solid #000', borderCollapse: 'collapse', marginBottom: '15px' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '10px', width: '60%', verticalAlign: 'top' }}>
                            <h3 style={{ color: '#4169E1', margin: '0 0 5px 0', fontSize: '12pt' }}>AYUCAN HEALTHCARE</h3>
                            <p style={{ fontSize: '9pt', lineHeight: '1.4', margin: '3px 0' }}>
                                E-46/3, Mohan Baba Nagar, Nearby S K Payal Public School,<br />
                                Badarpur, New Delhi 110044<br />
                                <strong>GSTIN:</strong> 07JVTPK9524E1ZX &nbsp; <strong>Mobile:</strong> 8799722636<br />
                                <strong>Website:</strong> www.ayucan.com
                            </p>
                        </td>
                        <td style={{ border: '1px solid #000', padding: '10px', width: '40%' }}>
                            <table style={{ width: '100%', fontSize: '9pt' }}>
                                <tbody>
                                    <tr>
                                        <td><strong>Invoice No.</strong></td>
                                        <td style={{ textAlign: 'right' }}>{invoiceNumber}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Invoice Date</strong></td>
                                        <td style={{ textAlign: 'right' }}>{formatDate(invoiceDate)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Bill To and Ship To */}
            <table style={{ width: '100%', border: '1px solid #000', borderCollapse: 'collapse', marginBottom: '15px' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '10px', width: '50%', verticalAlign: 'top' }}>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '10pt' }}>BILL TO</h4>
                            <p style={{ fontSize: '9pt', lineHeight: '1.4', margin: '3px 0' }}>
                                <strong>{billTo.name || 'AYUCAN HEALTHCARE'}</strong><br />
                                {billTo.address || 'Basement, E-46, Mohan Baba Nagar, Badarpur, New Delhi, South East Delhi, South Delhi, Delhi, 110044'}<br />
                                <strong>GSTIN:</strong> {billTo.gstin || '07JVTPK6524E1ZX'}<br />
                                <strong>Mobile:</strong> {billTo.mobile || '9911324282'}
                            </p>
                        </td>
                        <td style={{ border: '1px solid #000', padding: '10px', width: '50%', verticalAlign: 'top' }}>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '10pt' }}>SHIP TO</h4>
                            <p style={{ fontSize: '9pt', lineHeight: '1.4', margin: '3px 0' }}>
                                <strong>{shipTo.name || billTo.name || 'AYUCAN HEALTHCARE'}</strong><br />
                                {shipTo.address || billTo.address || 'Basement, E-46, Mohan Baba Nagar, Badarpur, New Delhi, South East Delhi, South Delhi, Delhi, 110044'}<br />
                                <strong>GSTIN:</strong> {billTo.gstin || '07JVTPK6524E1ZX'}<br />
                                <strong>Mobile:</strong> {billTo.mobile || '9911324282'}
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Items Table */}
            <table style={{ width: '100%', border: '1px solid #000', borderCollapse: 'collapse', marginBottom: '15px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#E8E8F5' }}>
                        <th style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'left', width: '5%' }}>S.NO.</th>
                        <th style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'left', width: '40%' }}>ITEMS</th>
                        <th style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'center', width: '12%' }}>HSN</th>
                        <th style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'center', width: '10%' }}>QTY.</th>
                        <th style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'right', width: '12%' }}>RATE</th>
                        <th style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'right', width: '15%' }}>AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt' }}>{index + 1}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt' }}>
                                {item.name}<br />
                                <span style={{ fontSize: '8pt', color: '#666' }}>{item.description}</span>
                            </td>
                            <td style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'center' }}>{item.hsn}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'center' }}>{item.quantity} PCS</td>
                            <td style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'right' }}>{item.rate}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'right' }}>{item.amount}</td>
                        </tr>
                    ))}

                    {/* Tax Rows */}
                    <tr>
                        <td colSpan="5" style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'right' }}>
                            <strong>CGST @2.5%</strong>
                        </td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'right' }}>
                            ₹ {cgst}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="5" style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'right' }}>
                            <strong>SGST @2.5%</strong>
                        </td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '9pt', textAlign: 'right' }}>
                            ₹ {sgst}
                        </td>
                    </tr>

                    {/* Total Row */}
                    <tr style={{ backgroundColor: '#E8E8F5' }}>
                        <td colSpan="5" style={{ border: '1px solid #000', padding: '8px', fontSize: '10pt', fontWeight: 'bold', textAlign: 'right' }}>
                            TOTAL
                        </td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '10pt', fontWeight: 'bold', textAlign: 'right' }}>
                            ₹ {total}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Amount in Words */}
            <div style={{ border: '1px solid #000', padding: '10px', marginBottom: '15px' }}>
                <p style={{ fontSize: '9pt', margin: 0 }}>
                    <strong>Total Amount (in words):</strong><br />
                    {amountInWords || 'Eighty Eight Thousand Nine Hundred Sixty Eight Rupees and Eighteen Paise'}
                </p>
            </div>

            {/* Bank Details and QR Code */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '65%', verticalAlign: 'top', paddingRight: '10px' }}>
                            <div style={{ border: '1px solid #000', padding: '10px' }}>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '10pt' }}>Bank Details</h4>
                                <p style={{ fontSize: '9pt', lineHeight: '1.6', margin: 0 }}>
                                    <strong>Name:</strong> {bankDetails.name || 'Ayucan Healthcare'}<br />
                                    <strong>IFSC Code:</strong> {bankDetails.ifsc || 'CBIN0280299'}<br />
                                    <strong>Account No:</strong> {bankDetails.account || '5927753739'}<br />
                                    <strong>Bank:</strong> {bankDetails.bank || 'Central Bank Of India'}
                                </p>
                            </div>
                        </td>
                        <td style={{ width: '35%', verticalAlign: 'top' }}>
                            <div style={{ border: '1px solid #000', padding: '10px', textAlign: 'center' }}>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '10pt' }}>Payment QR Code</h4>
                                <img
                                    src="/Payment.png"
                                    alt="Payment QR Code"
                                    style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                                />
                                <p style={{ fontSize: '8pt', margin: '5px 0 0 0' }}>Scan to Pay</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Terms and Conditions */}
            <div style={{ border: '1px solid #000', padding: '10px', marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '10pt' }}>Terms and Conditions</h4>
                <ol style={{ fontSize: '8pt', lineHeight: '1.5', margin: 0, paddingLeft: '20px' }}>
                    <li>Goods once sold will not be taken back or exchanged</li>
                    <li>All disputes are subject to Delhi jurisdiction only</li>
                    <li>Payment Terms: 50% Advance after confirmation of purchase order, and rest 50% before dispatch</li>
                    <li>Quality \u0026 Qty Confirmation: Quantity \u0026 Quality of Material confirm within 24 Hrs</li>
                    <li>Price: After starting production + 10% increase or decrease.</li>
                    <li>Lead time one month after payment and design approved</li>
                </ol>
            </div>

            {/* Authorized Signature */}
            <div style={{ textAlign: 'right', paddingTop: '10px' }}>
                <img
                    src="/aman sign.jpeg"
                    alt="Authorized Signature"
                    style={{ width: '120px', height: '60px', objectFit: 'contain', display: 'block', marginLeft: 'auto' }}
                />
                <p style={{ fontSize: '10pt', margin: 0, fontWeight: 'bold' }}>Authorised Signatory For</p>
                <p style={{ fontSize: '10pt', margin: '5px 0 0 0', fontWeight: 'bold' }}>AYUCAN HEALTHCARE</p>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .invoice-container {
            box-shadow: none !important;
            page-break-after: avoid;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
