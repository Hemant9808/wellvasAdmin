import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import InvoiceTemplate from './InvoiceTemplate';

const InvoiceGenerator = () => {
    const invoiceRef = useRef();

    // Get next invoice number from localStorage
    const getNextInvoiceNumber = () => {
        const lastNumber = localStorage.getItem('lastInvoiceNumber');
        const nextNumber = lastNumber ? parseInt(lastNumber) + 1 : 1;
        return nextNumber.toString();
    };

    const [invoiceData, setInvoiceData] = useState({
        invoiceNumber: getNextInvoiceNumber(),
        invoiceDate: new Date().toISOString().split('T')[0],
        billTo: {
            name: 'AYUCAN HEALTHCARE',
            address: 'Basement, E-46, Mohan Baba Nagar, Badarpur, New Delhi, South East Delhi, South Delhi, Delhi, 110044',
            gstin: '07JVTPK6524E1ZX',
            mobile: '9911324282',
            pan: 'JVTPK9524E'
        },
        shipTo: {
            name: 'AYUCAN HEALTHCARE',
            address: 'Basement, E-46, Mohan Baba Nagar, Badarpur, New Delhi, South East Delhi, South Delhi, Delhi, 110044'
        },
        items: [
            {
                name: 'Shilajit Product 420gm (Normal AGI Glass jar)',
                description: 'Ad jart wads golden caps tableks laminatios simbulle lab reporters Golden spoon + outer box outer box lamination +MGB warillaminaion',
                hsn: '30039011',
                quantity: 222,
                rate: 195,
                amount: 43290
            }
        ],
        bankDetails: {
            name: 'Ayucan Healthcare',
            ifsc: '',
            account: '',
            bank: ''
        },
        paymentQRData: 'devashishraj8271@oksbi'
    });

    // Save invoice number to localStorage when downloading/printing
    const saveInvoiceNumber = () => {
        localStorage.setItem('lastInvoiceNumber', invoiceData.invoiceNumber);
    };

    // Calculate totals
    const calculateTotals = (items) => {
        const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
        const cgst = subtotal * 0.025; // 2.5%
        const sgst = subtotal * 0.025; // 2.5%
        const total = subtotal + cgst + sgst;

        return {
            subtotal: subtotal.toFixed(2),
            cgst: cgst.toFixed(2),
            sgst: sgst.toFixed(2),
            total: total.toFixed(2)
        };
    };

    const totals = calculateTotals(invoiceData.items);

    // Convert number to words
    const numberToWords = (num) => {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

        const convertLessThanThousand = (n) => {
            if (n === 0) return '';
            if (n < 10) return ones[n];
            if (n < 20) return teens[n - 10];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
            return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
        };

        if (num === 0) return 'Zero';

        const crores = Math.floor(num / 10000000);
        const lakhs = Math.floor((num % 10000000) / 100000);
        const thousands = Math.floor((num % 100000) / 1000);
        const hundreds = num % 1000;

        let result = '';
        if (crores > 0) result += convertLessThanThousand(crores) + ' Crore ';
        if (lakhs > 0) result += convertLessThanThousand(lakhs) + ' Lakh ';
        if (thousands > 0) result += convertLessThanThousand(thousands) + ' Thousand ';
        if (hundreds > 0) result += convertLessThanThousand(hundreds);

        return result.trim() + ' Rupees Only';
    };

    const amountInWords = numberToWords(Math.floor(parseFloat(totals.total)));

    // Handle form changes
    const handleInputChange = (section, field, value) => {
        setInvoiceData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...invoiceData.items];
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };

        // Auto-calculate amount
        if (field === 'quantity' || field === 'rate') {
            const quantity = parseFloat(newItems[index].quantity) || 0;
            const rate = parseFloat(newItems[index].rate) || 0;
            newItems[index].amount = quantity * rate; // Store as number, not string
        }

        setInvoiceData(prev => ({
            ...prev,
            items: newItems
        }));
    };

    const addItem = () => {
        setInvoiceData(prev => ({
            ...prev,
            items: [...prev.items, {
                name: '',
                description: '',
                hsn: '',
                quantity: 0,
                rate: 0,
                amount: 0
            }]
        }));
    };

    const removeItem = (index) => {
        setInvoiceData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    // Download PDF
    const downloadPDF = async () => {
        try {
            toast.loading('Generating PDF...');

            // Create a temporary container for full-size invoice
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'fixed';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = '210mm';
            tempContainer.style.backgroundColor = 'white';
            document.body.appendChild(tempContainer);

            // Clone the invoice content
            const invoiceClone = invoiceRef.current.cloneNode(true);
            tempContainer.appendChild(invoiceClone);

            // Wait for images to load
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(invoiceClone, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            // Remove temporary container
            document.body.removeChild(tempContainer);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate dimensions maintaining aspect ratio
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            // If content is taller than one page, fit it to height
            if (imgHeight > pdfHeight) {
                const scaledWidth = (canvas.width * pdfHeight) / canvas.height;
                const scaledHeight = pdfHeight;
                const xOffset = (pdfWidth - scaledWidth) / 2;
                pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, scaledHeight);
            } else {
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            }

            pdf.save(`Invoice_${invoiceData.invoiceNumber}_${new Date().toISOString().split('T')[0]}.pdf`);

            // Save current invoice number and generate next
            saveInvoiceNumber();
            const nextNumber = (parseInt(invoiceData.invoiceNumber) + 1).toString();
            setInvoiceData(prev => ({ ...prev, invoiceNumber: nextNumber }));

            toast.dismiss();
            toast.success('PDF downloaded successfully!');
        } catch (error) {
            toast.dismiss();
            toast.error('Failed to generate PDF');
            console.error('PDF Error:', error);
        }
    };

    // Print Invoice
    const handlePrint = () => {
        // Create a hidden iframe
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const content = invoiceRef.current;
        const doc = iframe.contentWindow.document;

        // Write content to iframe
        doc.open();
        doc.write('<html><head><title>Print Invoice</title>');
        doc.write('</head><body style="margin: 0; padding: 0;">');
        doc.write(content.outerHTML);
        doc.write('</body></html>');
        doc.close();

        // Wait for resources to load then print
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();

            // Cleanup
            document.body.removeChild(iframe);

            // Save and increment invoice number
            saveInvoiceNumber();
            setTimeout(() => {
                const nextNumber = (parseInt(invoiceData.invoiceNumber) + 1).toString();
                setInvoiceData(prev => ({ ...prev, invoiceNumber: nextNumber }));
            }, 100);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-12 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-[#2A3B28] mb-2">Generate Invoice</h1>
                    <p className="text-[#715036]/80">Create professional proforma invoices for your customers</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Side - Form */}
                    <div className="space-y-6">

                        {/* Invoice Details Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-6 border border-[#715036]/10"
                        >
                            <h2 className="text-xl font-bold text-[#2A3B28] mb-4">Invoice Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#715036] mb-1">Invoice Number</label>
                                    <input
                                        type="text"
                                        value={invoiceData.invoiceNumber}
                                        onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                                        className="w-full px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#715036] mb-1">Invoice Date</label>
                                    <input
                                        type="date"
                                        value={invoiceData.invoiceDate}
                                        onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Bill To Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6 border border-[#715036]/10"
                        >
                            <h2 className="text-xl font-bold text-[#2A3B28] mb-4">Bill To</h2>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Company Name"
                                    value={invoiceData.billTo.name}
                                    onChange={(e) => handleInputChange('billTo', 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent"
                                />
                                <textarea
                                    placeholder="Address"
                                    value={invoiceData.billTo.address}
                                    onChange={(e) => handleInputChange('billTo', 'address', e.target.value)}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="GSTIN"
                                        value={invoiceData.billTo.gstin}
                                        onChange={(e) => handleInputChange('billTo', 'gstin', e.target.value)}
                                        className="w-full px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Mobile"
                                        value={invoiceData.billTo.mobile}
                                        onChange={(e) => handleInputChange('billTo', 'mobile', e.target.value)}
                                        className="w-full px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Items Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg p-6 border border-[#715036]/10"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[#2A3B28]">Items</h2>
                                <button
                                    onClick={addItem}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#C17C3A] text-white rounded-lg hover:bg-[#a6662e] transition-colors font-semibold text-sm"
                                >
                                    <Plus size={16} /> Add Item
                                </button>
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {invoiceData.items.map((item, index) => (
                                    <div key={index} className="p-4 bg-[#FDFBF7] rounded-lg border border-[#715036]/10 relative">
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Item Name"
                                                value={item.name}
                                                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent text-sm"
                                            />
                                            <textarea
                                                placeholder="Description"
                                                value={item.description}
                                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                rows="2"
                                                className="w-full px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent text-sm"
                                            />
                                            <div className="grid grid-cols-3 gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="HSN"
                                                    value={item.hsn}
                                                    onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                                                    className="px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent text-sm"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                    className="px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent text-sm"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Rate"
                                                    value={item.rate}
                                                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                                    className="px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent text-sm"
                                                />
                                            </div>
                                            <div className="text-right text-sm font-semibold text-[#2A3B28]">
                                                Amount: ₹{typeof item.amount === 'number' ? item.amount.toFixed(2) : item.amount}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="mt-4 pt-4 border-t border-[#715036]/20 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#715036]">Subtotal:</span>
                                    <span className="font-semibold text-[#2A3B28]">₹{totals.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#715036]">CGST (2.5%):</span>
                                    <span className="font-semibold text-[#2A3B28]">₹{totals.cgst}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#715036]">SGST (2.5%):</span>
                                    <span className="font-semibold text-[#2A3B28]">₹{totals.sgst}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#715036]/20">
                                    <span className="text-[#2A3B28]">Total:</span>
                                    <span className="text-[#C17C3A]">₹{totals.total}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={downloadPDF}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2A3B28] text-white rounded-lg hover:bg-[#C17C3A] transition-colors font-semibold shadow-lg no-print"
                            >
                                <Download size={20} /> Download PDF
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePrint}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#C17C3A] text-white rounded-lg hover:bg-[#a6662e] transition-colors font-semibold shadow-lg no-print"
                            >
                                <Printer size={20} /> Print
                            </motion.button>
                        </div>
                    </div>

                    {/* Right Side - Preview */}
                    <div className="lg:sticky lg:top-4 lg:self-start">
                        <div className="bg-white rounded-2xl shadow-2xl p-4 border border-[#715036]/10 overflow-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                            <h2 className="text-lg font-bold text-[#2A3B28] mb-4 no-print">Preview</h2>
                            <div className="transform scale-75 origin-top">
                                <InvoiceTemplate
                                    ref={invoiceRef}
                                    invoiceData={{
                                        ...invoiceData,
                                        ...totals,
                                        amountInWords
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default InvoiceGenerator;
