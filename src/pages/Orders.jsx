import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
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

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      filterOrdersByDateRange();
    } else {
      setFilteredOrders(Array.isArray(orders) ? orders : []);
    }
  }, [dateRange, orders]);

  const getOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await axios.get('http://localhost:4001/api/order/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        const ordersData = Array.isArray(response.data.orders) ? response.data.orders : [];
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        return;
      }
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByDateRange = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await axios.post('http://localhost:4001/api/order/export-by-date', dateRange, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        const filteredData = Array.isArray(response.data.orders) ? response.data.orders : [];
        setFilteredOrders(filteredData);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        return;
      }
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      setStatusLoading(orderId);
      const token = localStorage.getItem('token');
      
      if (!token) {
        return;
      }

      const response = await axios.patch(
        `http://localhost:4001/api/order/update-status`, 
        {
          orderId,
          status: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200 && response.data.success) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        );
        
        setFilteredOrders(prevFilteredOrders => 
          prevFilteredOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        );
        
        toast.success('Đã cập nhật trạng thái đơn hàng');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        return;
      }
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

  const exportOrder = async (orderId) => {
    try {
      setExportLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      const response = await axios.get(`http://localhost:4001/api/order/export/${orderId}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `order_${orderId}_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success('Đã xuất đơn hàng thành công');
    } catch (error) {
      console.error('Lỗi khi xuất đơn hàng:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      } else {
        toast.error('Không thể xuất đơn hàng');
      }
    } finally {
      setExportLoading(false);
    }
  };

  const exportOrdersByDateRange = async (e) => {
    e.preventDefault();
    
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.warning('Vui lòng chọn khoảng thời gian');
      return;
    }
    
    try {
      setExportLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      const response = await axios.post(`http://localhost:4001/api/order/export-by-date`, dateRange, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_export_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success('Đã xuất đơn hàng thành công');
    } catch (error) {
      console.error('Lỗi khi xuất đơn hàng:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      } else {
        toast.error('Không thể xuất đơn hàng');
      }
    } finally {
      setExportLoading(false);
    }
  };

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

      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium mb-3">Lọc đơn hàng theo khoảng thời gian</h3>
        <div className="flex flex-wrap items-end gap-3">
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
            onClick={exportOrdersByDateRange}
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
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !Array.isArray(filteredOrders) || filteredOrders.length === 0 ? (
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
              {filteredOrders.map((order) => (
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
