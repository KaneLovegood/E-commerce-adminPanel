import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

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
      case 'Đang xử lý':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đang giao hàng':
        return 'bg-blue-100 text-blue-800';
      case 'Đã giao hàng':
        return 'bg-green-100 text-green-800';
      case 'Đã hủy':
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

  // Hàm xuất một đơn hàng
  const exportOrder = async (orderId) => {
    try {
      setExportLoading(true);
      const response = await axios.get(`http://localhost:4001/api/order/export/${orderId}`, {
        responseType: 'blob'
      });
      
      // Tạo đường dẫn URL tạm thời cho blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Tạo thẻ a để tải xuống
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `order_${orderId}_${Date.now()}.json`);
      document.body.appendChild(link);
      
      // Kích hoạt tải xuống
      link.click();
      
      // Dọn dẹp
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success('Đã xuất đơn hàng thành công');
    } catch (error) {
      console.error('Lỗi khi xuất đơn hàng:', error);
      toast.error('Không thể xuất đơn hàng');
    } finally {
      setExportLoading(false);
    }
  };

  // Hàm xuất nhiều đơn hàng theo khoảng thời gian
  const exportOrdersByDateRange = async (e) => {
    e.preventDefault();
    
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.warning('Vui lòng chọn khoảng thời gian');
      return;
    }
    
    try {
      setExportLoading(true);
      const response = await axios.post(`http://localhost:4001/api/order/export-by-date`, dateRange, {
        responseType: 'blob'
      });
      
      // Tạo đường dẫn URL tạm thời cho blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Tạo thẻ a để tải xuống
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_export_${Date.now()}.json`);
      document.body.appendChild(link);
      
      // Kích hoạt tải xuống
      link.click();
      
      // Dọn dẹp
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success('Đã xuất đơn hàng thành công');
    } catch (error) {
      console.error('Lỗi khi xuất đơn hàng:', error);
      toast.error('Không thể xuất đơn hàng');
    } finally {
      setExportLoading(false);
    }
  };

  // Xử lý thay đổi input khoảng thời gian
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
        <p className="text-gray-500">Xem và cập nhật trạng thái đơn hàng</p>
      </div>

      {/* Form xuất đơn hàng theo khoảng thời gian */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium mb-3">Xuất đơn hàng theo khoảng thời gian</h3>
        <form onSubmit={exportOrdersByDateRange} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Từ ngày</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Đến ngày</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={exportLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
          >
            {exportLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-t-2 border-white rounded-full mr-2"></div>
                Đang xuất...
              </>
            ) : (
              <>Xuất đơn hàng</>
            )}
          </button>
        </form>
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
                  <td className="py-3 px-4">{formatDate(order.orderDate)}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{order.userId?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{order.userId?.email || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{Number(order.totalAmount).toLocaleString()} VND</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    {statusLoading === order._id ? (
                      <div className="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full"></div>
                    ) : (
                      <>
                        <select 
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                        >
                          <option value="Đang xử lý">Đang xử lý</option>
                          <option value="Đang giao hàng">Đang giao hàng</option>
                          <option value="Đã giao hàng">Đã giao hàng</option>
                          <option value="Đã hủy">Đã hủy</option>
                        </select>
                        <button 
                          onClick={() => exportOrder(order._id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Xuất đơn hàng"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </>
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
