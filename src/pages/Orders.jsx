import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(null);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4001/api/order/all');
      if (response.status === 200) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      setStatusLoading(orderId);
      const response = await axios.patch(`http://localhost:4001/api/order/update-status`, {
        orderId,
        status: newStatus
      });
      
      if (response.status === 200) {
        toast.success('Đã cập nhật trạng thái đơn hàng');
        getOrders(); // Refresh danh sách
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      toast.error('Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setStatusLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
        <p className="text-gray-500">Xem và cập nhật trạng thái đơn hàng</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10">
          <p>Không có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Mã đơn hàng</th>
                <th className="py-3 px-4 text-left">Ngày đặt</th>
                <th className="py-3 px-4 text-left">Khách hàng</th>
                <th className="py-3 px-4 text-left">Tổng tiền</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">#{order._id.slice(-6)}</td>
                  <td className="py-3 px-4">{formatDate(order.date)}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{order.user.name}</p>
                      <p className="text-sm text-gray-500">{order.user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{Number(order.amount).toLocaleString()} VND</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {statusLoading === order._id ? (
                      <div className="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full"></div>
                    ) : (
                      <select 
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
