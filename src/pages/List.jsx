import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  useEffect(() => {
    getProducts();
  }, [currentPage]);

  useEffect(() => {
    console.log(products);
  }, [products]);

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4001/api/products/list?page=${currentPage}&limit=${productsPerPage}`);
      if (response.status === 200 && response.data.success) {
        setProducts(response.data.products);
        setTotalProducts(response.data.total);
        setTotalPages(Math.max(1, Math.ceil(response.data.total / productsPerPage)));
        
        if (response.data.products.length === 0 && currentPage > 1) {
          setCurrentPage(1);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (_id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm này?`)) {
      try {
        setDeleteLoading(_id);
        const response = await axios.post(`http://localhost:4001/api/products/remove`, { _id });
  
        if (response.status === 200) {
          toast.success('Đã xóa sản phẩm thành công');
          getProducts(); // Tải lại danh sách sau khi xóa
        }
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        toast.error('Không thể xóa sản phẩm');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const renderPaginationButtons = () => {
    return (
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-6 py-2 rounded ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Trước
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-6 py-2 rounded ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Sau
        </button>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Danh sách sản phẩm</h2>
        <p className="text-gray-500">Quản lý tất cả sản phẩm của bạn</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10">
          <p>Không có sản phẩm nào.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Hình ảnh</th>
                  <th className="py-3 px-4 text-left">Tên sản phẩm</th>
                  <th className="py-3 px-4 text-left">Giá</th>
                  <th className="py-3 px-4 text-left">Danh mục</th>
                  <th className="py-3 px-4 text-left">Kích thước</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img 
                        src={product.image && product.image.length > 0 ? product.image[0] : ''} 
                        alt={product.name}
                        className="w-12 h-12 object-cover"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4">{Number(product.price).toLocaleString()} VND</td>
                    <td className="py-3 px-4">{product.category} - {product.subCategory}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {product.sizes && Array.isArray(product.sizes) ? product.sizes.map((size) => (
                          <span key={size} className="px-2 py-1 bg-gray-100 text-xs rounded">{size}</span>
                        )) : null}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleDelete(product._id)}
                          disabled={deleteLoading === product._id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          {deleteLoading === product._id ? (
                            <div className="animate-spin h-5 w-5 border-t-2 border-red-500 rounded-full"></div>
                          ) : (
                            <RiDeleteBin6Line />
                          )}
                        </button>
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="text-sm text-gray-600">
              Tổng số sản phẩm: {totalProducts}
            </div>
            {renderPaginationButtons()}
          </div>
        </>
      )}
    </div>
  );
};

export default List;
