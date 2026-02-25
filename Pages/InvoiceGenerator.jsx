import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, Plus, Trash2, Save, Search, User, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import InvoiceTemplate from './InvoiceTemplate';
import axiosInstance from '../utils/axios';

const InvoiceGenerator = () => {
    const invoiceRef = useRef();

    // Get next invoice number from database API
    const fetchNextInvoiceNumber = async () => {
        try {
            const response = await axiosInstance.get('/offline-invoices/next-number');
            return response.data.nextInvoiceNumber;
        } catch (error) {
            console.error('Error fetching next invoice number:', error);
            // Fallback to INV-1 if API fails
            return 'INV-1';
        }
    };

    // Customer selection state
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerSearch, setCustomerSearch] = useState('');
    const [customerResults, setCustomerResults] = useState([]);
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

    // GST rate state
    const [cgstRate, setCgstRate] = useState(0);
    const [sgstRate, setSgstRate] = useState(0);

    // Payment tracking state
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paidAmount, setPaidAmount] = useState(0);

    const [invoiceData, setInvoiceData] = useState({
        invoiceNumber: '', // Will be fetched from API
        invoiceDate: new Date().toISOString().split('T')[0],
        billTo: {
            name: '',
            address: '',
            gstin: '',
            mobile: '',
            pan: ''
        },
        shipTo: {
            name: '',
            address: ''
        },
        items: [],
        bankDetails: {
            name: 'Ayucan Healthcare',
            ifsc: '',
            account: '',
            bank: ''
        },
        paymentQRData: 'devashishraj8271@oksbi'
    });

    // Fetch next invoice number from database on component mount
    useEffect(() => {
        const initializeInvoiceNumber = async () => {
            const nextNumber = await fetchNextInvoiceNumber();
            setInvoiceData(prev => ({
                ...prev,
                invoiceNumber: nextNumber
            }));
        };
        initializeInvoiceNumber();
    }, []);

    // Save invoice number to localStorage when downloading/printing
    const saveInvoiceNumber = () => {
        localStorage.setItem('lastInvoiceNumber', invoiceData.invoiceNumber);
    };

    // Calculate totals
    const calculateTotals = (items) => {
        const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
        const cgst = subtotal * (parseFloat(cgstRate) || 0) / 100;
        const sgst = subtotal * (parseFloat(sgstRate) || 0) / 100;
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

    // Search customers
    const searchCustomers = async (query) => {
        if (!query || query.length < 2) {
            setCustomerResults([]);
            return;
        }

        try {
            const response = await axiosInstance.get('/offline-customers', {
                params: { search: query, limit: 10 }
            });
            setCustomerResults(response.data.customers || []);
        } catch (error) {
            console.error('Error searching customers:', error);
        }
    };

    // Handle customer selection
    const selectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setCustomerSearch(customer.name);
        setShowCustomerDropdown(false);

        // Auto-fill customer details
        setInvoiceData(prev => ({
            ...prev,
            billTo: {
                name: customer.name,
                address: customer.address?.fullAddress || '',
                gstin: customer.gstin || '',
                mobile: customer.phone || '',
                pan: customer.pan || ''
            },
            shipTo: {
                name: customer.name,
                address: customer.address?.fullAddress || ''
            }
        }));
    };

    // Clear customer selection
    const clearCustomer = () => {
        setSelectedCustomer(null);
        setCustomerSearch('');
        setInvoiceData(prev => ({
            ...prev,
            billTo: {
                name: '',
                address: '',
                gstin: '',
                mobile: '',
                pan: ''
            }
        }));
    };

    // Save invoice to database
    const saveInvoiceToDatabase = async () => {
        try {
            // Validation
            if (!invoiceData.items || invoiceData.items.length === 0) {
                toast.error('Please add at least one item to the invoice');
                throw new Error('No items in invoice');
            }

            if (!invoiceData.billTo.name || invoiceData.billTo.name.trim() === '') {
                toast.error('Customer name is required');
                throw new Error('Customer name missing');
            }

            const invoicePayload = {
                invoiceNumber: invoiceData.invoiceNumber,
                invoiceDate: invoiceData.invoiceDate,
                customerId: selectedCustomer?._id,
                customerSnapshot: {
                    name: invoiceData.billTo.name,
                    phone: invoiceData.billTo.mobile,
                    email: selectedCustomer?.email || '',
                    address: invoiceData.billTo.address,
                    gstin: invoiceData.billTo.gstin,
                    pan: invoiceData.billTo.pan
                },
                items: invoiceData.items,
                subtotal: parseFloat(totals.subtotal),
                cgst: parseFloat(totals.cgst),
                sgst: parseFloat(totals.sgst),
                total: parseFloat(totals.total),
                amountInWords,
                paymentStatus,
                paymentMethod,
                paidAmount: parseFloat(paidAmount) || 0,
                shipTo: invoiceData.shipTo,
                bankDetails: invoiceData.bankDetails,
                upiId: invoiceData.paymentQRData
            };

            toast.loading('Saving invoice to database...', { id: 'save-invoice' });

            console.log('Sending invoice payload:', invoicePayload); // Debug log
            if (!invoicePayload.customerId) {
                console.warn('⚠️ WARNING: Invoice being saved WITHOUT customer link!');
            }

            const response = await axiosInstance.post('/offline-invoices', invoicePayload);

            toast.success(`Invoice ${invoiceData.invoiceNumber} saved successfully! 🎉`, {
                id: 'save-invoice',
                duration: 3000
            });

            // Fetch next invoice number from database for the next invoice
            const nextNumber = await fetchNextInvoiceNumber();
            setInvoiceData(prev => ({ ...prev, invoiceNumber: nextNumber }));

            return response.data.invoice;
        } catch (error) {
            console.error('Error saving invoice:', error);
            console.error('Error response:', error.response?.data); // Debug log

            const errorMessage = error.response?.data?.message || error.message || 'Failed to save invoice. Please try again.';

            toast.error(errorMessage, {
                id: 'save-invoice',
                duration: 4000
            });
            throw error;
        }
    };

    // Handle customer search input change
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (customerSearch) {
                searchCustomers(customerSearch);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [customerSearch]);


    // Download PDF
    const downloadPDF = async () => {
        try {
            // First save to database if items exist
            if (invoiceData.items.length > 0 && invoiceData.billTo.name) {
                await saveInvoiceToDatabase();
            }

            toast.loading('Generating PDF...', { id: 'pdf-download' });

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

            // Save current invoice number for reference
            saveInvoiceNumber();

            // Fetch next invoice number from database
            const nextNumber = await fetchNextInvoiceNumber();
            setInvoiceData(prev => ({ ...prev, invoiceNumber: nextNumber }));

            toast.success(`Invoice ${invoiceData.invoiceNumber} - PDF downloaded successfully! 📄`, {
                id: 'pdf-download',
                duration: 3000
            });
        } catch (error) {
            toast.error('Failed to generate PDF. Please try again.', {
                id: 'pdf-download',
                duration: 4000
            });
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
            setTimeout(async () => {
                const nextNumber = await fetchNextInvoiceNumber();
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

                        {/* Customer Selection Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="bg-white rounded-2xl shadow-lg p-6 border border-[#715036]/10"
                        >
                            <h2 className="text-xl font-bold text-[#2A3B28] mb-4">Select Customer</h2>
                            <div className="relative">
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Search customer by name or phone..."
                                            value={customerSearch}
                                            onChange={(e) => {
                                                setCustomerSearch(e.target.value);
                                                setShowCustomerDropdown(true);
                                            }}
                                            onFocus={() => setShowCustomerDropdown(true)}
                                            className="w-full pl-10 pr-4 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent"
                                        />
                                        {selectedCustomer && (
                                            <button
                                                onClick={clearCustomer}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Customer Dropdown */}
                                {showCustomerDropdown && customerResults.length > 0 && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {customerResults.map((customer) => (
                                            <div
                                                key={customer._id}
                                                onClick={() => selectCustomer(customer)}
                                                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{customer.name}</p>
                                                        <p className="text-sm text-gray-600">{customer.phone}</p>
                                                    </div>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                        {customer.customerType}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedCustomer && (
                                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <User size={16} />
                                        <span className="text-sm font-semibold">
                                            Selected: {selectedCustomer.name} - ₹{selectedCustomer.totalSpent?.toLocaleString() || 0} spent
                                        </span>
                                    </div>
                                </div>
                            )}
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
                                <div className="flex items-center justify-between text-sm gap-2">
                                    <div className="flex items-center gap-2 text-[#715036]">
                                        <span>CGST</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.5"
                                            value={cgstRate}
                                            onChange={(e) => setCgstRate(e.target.value)}
                                            className="w-16 px-2 py-1 border border-[#715036]/30 rounded-lg text-center text-sm focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent"
                                            placeholder="0"
                                        />
                                        <span>%</span>
                                    </div>
                                    <span className="font-semibold text-[#2A3B28]">₹{totals.cgst}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm gap-2">
                                    <div className="flex items-center gap-2 text-[#715036]">
                                        <span>SGST</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.5"
                                            value={sgstRate}
                                            onChange={(e) => setSgstRate(e.target.value)}
                                            className="w-16 px-2 py-1 border border-[#715036]/30 rounded-lg text-center text-sm focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent"
                                            placeholder="0"
                                        />
                                        <span>%</span>
                                    </div>
                                    <span className="font-semibold text-[#2A3B28]">₹{totals.sgst}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#715036]/20">
                                    <span className="text-[#2A3B28]">Total:</span>
                                    <span className="text-[#C17C3A]">₹{totals.total}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Details Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg p-6 border border-[#715036]/10"
                        >
                            <h2 className="text-xl font-bold text-[#2A3B28] mb-4">Payment Details</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#715036] mb-1">Payment Status</label>
                                    <select
                                        value={paymentStatus}
                                        onChange={(e) => setPaymentStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="partial">Partial</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#715036] mb-1">Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="upi">UPI</option>
                                        <option value="card">Card</option>
                                        <option value="netbanking">Net Banking</option>
                                        <option value="cheque">Cheque</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#715036] mb-1">Paid Amount</label>
                                    <input
                                        type="number"
                                        value={paidAmount}
                                        onChange={(e) => setPaidAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 border border-[#715036]/20 rounded-lg focus:ring-2 focus:ring-[#C17C3A] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-[#FDFBF7] rounded-lg">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#715036]">Total Amount:</span>
                                    <span className="font-bold text-[#2A3B28]">₹{totals.total}</span>
                                </div>
                                {paidAmount > 0 && (
                                    <>
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className="text-[#715036]">Paid Amount:</span>
                                            <span className="font-semibold text-green-600">₹{parseFloat(paidAmount).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className="text-[#715036]">Due Amount:</span>
                                            <span className="font-semibold text-red-600">
                                                ₹{(parseFloat(totals.total) - parseFloat(paidAmount)).toFixed(2)}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            {/* Save to Database Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={async () => {
                                    if (invoiceData.items.length === 0) {
                                        toast.error('Please add at least one item');
                                        return;
                                    }
                                    if (!invoiceData.billTo.name) {
                                        toast.error('Please select a customer or enter customer details');
                                        return;
                                    }
                                    try {
                                        await saveInvoiceToDatabase();
                                    } catch (error) {
                                        // Error already shown in function
                                    }
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg no-print"
                            >
                                <Save size={20} /> Save Invoice
                            </motion.button>

                            {/* Download PDF Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={downloadPDF}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2A3B28] text-white rounded-lg hover:bg-[#C17C3A] transition-colors font-semibold shadow-lg no-print"
                            >
                                <Download size={20} /> Download PDF
                            </motion.button>

                            {/* Print Button */}
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
                                        amountInWords,
                                        cgstRate,
                                        sgstRate
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div >
    );
};

export default InvoiceGenerator;
