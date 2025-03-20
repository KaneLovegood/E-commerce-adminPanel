import axios from "axios";
import React, { useState, useRef } from "react";
import { assets } from "../assets/assets";

const Add = () => {
  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [img3, setImg3] = useState(null);
  const [img4, setImg4] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileInput1 = useRef(null);
  const fileInput2 = useRef(null);
  const fileInput3 = useRef(null);
  const fileInput4 = useRef(null);

  const submit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!name || !description || !price) {
        alert("Vui lòng điền đầy đủ các trường bắt buộc (tên, mô tả, giá)!");
        return;
    }

    // Kiểm tra file hình ảnh
    const validateFile = (file) => {
        if (!file) return false;
        if (file.size === 0) {
            alert("File hình ảnh không được rỗng!");
            return false;
        }
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            alert("Chỉ chấp nhận file hình ảnh (PNG, JPEG, JPG)!");
            return false;
        }
        return true;
    };

    // Kiểm tra ít nhất một hình ảnh hợp lệ
    if (!img1 && !img2 && !img3 && !img4) {
        alert("Vui lòng chọn ít nhất một hình ảnh!");
        return;
    }

    // Kiểm tra từng file
    if (img1 && !validateFile(img1)) return;
    if (img2 && !validateFile(img2)) return;
    if (img3 && !validateFile(img3)) return;
    if (img4 && !validateFile(img4)) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", Number(price));
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("bestseller", bestseller ? "true" : "false");
    formData.append("sizes", JSON.stringify(sizes));

    if (img1) formData.append("image1", img1);
    if (img2) formData.append("image2", img2);
    if (img3) formData.append("image3", img3);
    if (img4) formData.append("image4", img4);

    try {
        const response = await axios.post(
            "http://localhost:4001/api/products/add",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        console.log("📥 Response từ server:", response.data);
        alert("Sản phẩm đã được thêm thành công!");
        setName("");
        setDescription("");
        setPrice("");
        setImg1(null);
        setImg2(null);
        setImg3(null);
        setImg4(null);
        setSizes([]);
        setBestseller(false);
    } catch (err) {
        console.error("❌ Lỗi khi gửi dữ liệu:", err);
        alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
        setLoading(false);
    }
};

  const displaySelectedSubcategories = () => {
    if (category === "Men") {
      return (
        <>
          <option value="Topwear">Topwear</option>
          <option value="Bottomwear">Bottomwear</option>
          <option value="Shoes">Shoes</option>
          <option value="Accessories">Accessories</option>
        </>
      );
    } else if (category === "Women") {
      return (
        <>
          <option value="Dresses">Dresses</option>
          <option value="Topwear">Topwear</option>
          <option value="Bottomwear">Bottomwear</option>
          <option value="Shoes">Shoes</option>
          <option value="Accessories">Accessories</option>
        </>
      );
    } else if (category === "Kids") {
      return (
        <>
          <option value="Boys">Boys</option>
          <option value="Girls">Girls</option>
          <option value="Footwear">Footwear</option>
          <option value="Toys">Toys</option>
        </>
      );
    }
  };

  return (
    <div className="p-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Thêm sản phẩm mới</h2>
        <p className="text-gray-500">Thêm thông tin chi tiết về sản phẩm mới</p>
      </div>

      <form onSubmit={submit} className="flex flex-col w-full items-start gap-3">
        <div>
          <p className="mb-2 font-semibold">
            Upload image <span className="text-red-500">*</span>
          </p>
          <div className="flex gap-2">
            <div onClick={() => fileInput1.current.click()} className="cursor-pointer">
              <img
                className="w-20 h-20 object-cover border border-gray-300"
                src={!img1 ? assets.upload_area : URL.createObjectURL(img1)}
                alt="Upload 1"
              />
              <input
                ref={fileInput1}
                type="file"
                hidden
                onChange={(e) => setImg1(e.target.files[0])}
              />
            </div>
            <div onClick={() => fileInput2.current.click()} className="cursor-pointer">
              <img
                className="w-20 h-20 object-cover border border-gray-300"
                src={!img2 ? assets.upload_area : URL.createObjectURL(img2)}
                alt="Upload 2"
              />
              <input
                ref={fileInput2}
                type="file"
                hidden
                onChange={(e) => setImg2(e.target.files[0])}
              />
            </div>
            <div onClick={() => fileInput3.current.click()} className="cursor-pointer">
              <img
                className="w-20 h-20 object-cover border border-gray-300"
                src={!img3 ? assets.upload_area : URL.createObjectURL(img3)}
                alt="Upload 3"
              />
              <input
                ref={fileInput3}
                type="file"
                hidden
                onChange={(e) => setImg3(e.target.files[0])}
              />
            </div>
            <div onClick={() => fileInput4.current.click()} className="cursor-pointer">
              <img
                className="w-20 h-20 object-cover border border-gray-300"
                src={!img4 ? assets.upload_area : URL.createObjectURL(img4)}
                alt="Upload 4"
              />
              <input
                ref={fileInput4}
                type="file"
                hidden
                onChange={(e) => setImg4(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2 font-semibold">
            Product name <span className="text-red-500">*</span>
          </p>
          <input
            className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="Nhập tên sản phẩm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2 font-semibold">
            Product description <span className="text-red-500">*</span>
          </p>
          <textarea
            className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded min-h-[100px]"
            placeholder="Mô tả chi tiết sản phẩm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div>
            <p className="mb-2 font-semibold">
              Product category <span className="text-red-500">*</span>
            </p>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value === "Men") setSubCategory("Topwear");
                else if (e.target.value === "Women") setSubCategory("Dresses");
                else if (e.target.value === "Kids") setSubCategory("Boys");
              }}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <p className="mb-2 font-semibold">
              Sub category <span className="text-red-500">*</span>
            </p>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              {displaySelectedSubcategories()}
            </select>
          </div>
          <div>
            <p className="mb-2 font-semibold">
              Product price <span className="text-red-500">*</span>
            </p>
            <input
              className="w-full px-3 py-2 sm:w-[120px] border border-gray-300 rounded"
              type="number"
              placeholder="25"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold">Product sizes</p>
          <div className="flex gap-3">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div key={size}>
                <p
                  className={`border border-gray-300 px-3 py-1 cursor-pointer rounded ${
                    sizes.includes(size)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-slate-100"
                  }`}
                  onClick={() =>
                    setSizes((prev) =>
                      prev.includes(size)
                        ? prev.filter((s) => s !== size)
                        : [...prev, size]
                    )
                  }
                >
                  {size}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <input
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={(e) => setBestseller(e.target.checked)}
          />
          <label className="cursor-pointer" htmlFor="bestseller">
            Add to best seller
          </label>
        </div>

        <button
          type="submit"
          className="w-28 py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Adding..." : "ADD"}
        </button>
      </form>
    </div>
  );
};

export default Add;