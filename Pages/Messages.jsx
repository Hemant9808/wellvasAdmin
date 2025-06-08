import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axios';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get('/contact/getAllMessages');
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Contact Messages</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr
                key={msg._id}
                className="hover:bg-gray-100 cursor-pointer border-b"
                onClick={() => setSelectedMessage(msg)}
              >
                <td className="px-4 py-2">{msg.name}</td>
                <td className="px-4 py-2">{msg.email}</td>
                <td className="px-4 py-2">{msg.phone || '-'}</td>
                <td className="px-4 py-2">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for message details */}
      {selectedMessage && (
        <div className="fixed inset-0 shadow-lg bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-lg w-full relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setSelectedMessage(null)}
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-2">Message Details</h3>
            <p><strong>Name:</strong> {selectedMessage.name}</p>
            <p><strong>Email:</strong> {selectedMessage.email}</p>
            <p><strong>Phone:</strong> {selectedMessage.phone || 'N/A'}</p>
            <p><strong>Subject:</strong> {selectedMessage.subject || 'N/A'}</p>
            <p className="mt-4"><strong>Message:</strong></p>
            <p className="bg-gray-100 p-3 rounded mt-1">{selectedMessage.message}</p>
            <p className="mt-3 text-sm text-gray-500">
              Submitted on: {new Date(selectedMessage.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
