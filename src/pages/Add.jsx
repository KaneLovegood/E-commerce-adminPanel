import axios from "axios";
import React, { useState } from "react";
import { assets } from "../assets/assets";

const Add = () => {
  const [img1, setimg1] = useState(false);
  const [img2, setimg2] = useState(false);
  const [img3, setimg3] = useState(false);
  const [img4, setimg4] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  // References cho input file
  const fileInput1 = React.useRef(null);
  const fileInput2 = React.useRef(null);
  const fileInput3 = React.useRef(null);
  const fileInput4 = React.useRef(null);

const submit = async (e) => {
  e.preventDefault();
  if (!name || !description || !price || !img1) {
    alert("Vui lòng nhập đầy đủ thông tin sản phẩm và tải lên ít nhất 1 ảnh.");
    return;
  }
  
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("subcategory", subCategory);
    formData.append("bestseller", bestseller);
    formData.append("sizes", JSON.stringify(sizes));
    
    if (img1) formData.append("image1", img1);
    if (img2) formData.append("image2", img2);
    if (img3) formData.append("image3", img3);
    if (img4) formData.append("image4", img4);

    // Gửi dữ liệu lên server
    const response = await axios.post("http://localhost:4001/api/addproduct", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 200) {
      alert("Sản phẩm đã được thêm thành công!");
      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Men");
      setSubCategory("Topwear");
      setBestseller(false);
      setSizes([]);
      setimg1(false);
      setimg2(false);
      setimg3(false);
      setimg4(false);
    } else {
      alert("Lỗi: " + response.data.message);
    }
  } catch (err) {
    console.error("Lỗi khi thêm sản phẩm:", err);
    alert("Đã xảy ra lỗi khi thêm sản phẩm.");
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
      
      <form className="flex flex-col w-full items-start gap-3">
        <div>
          <p className="mb-2 font-semibold">Upload image <span className="text-red-500">*</span></p>
          <div className="flex gap-2">
            <div
              onClick={() => fileInput1.current.click()}
              className="cursor-pointer"
            >
              <img
                className="w-20 h-20 object-cover border border-gray-300"
                src={!img1 ? assets.upload_area : URL.createObjectURL(img1)}
                alt="Upload 1"
              />
              <input
                ref={fileInput1}
                type="file"
                hidden
                onChange={(e) => setimg1(e.target.files[0])}
              />
            </div>

            <div
              onClick={() => fileInput2.current.click()}
              className="cursor-pointer"
            >
              <img
                className="w-20 h-20 object-cover border border-gray-300"
                src={!img2 ? assets.upload_area : URL.createObjectURL(img2)}
                alt="Upload 2"
              />
              <input
                ref={fileInput2}
                type="file"
                hidden
                onChange={(e) => setimg2(e.target.files[0])}
              />
            </div>

            <div
              onClick={() => fileInput3.current.click()}
              className="cursor-pointer"
            >
              <img
                className="w-20 h-20 object-cover border border-gray-300"
                src={!img3 ? assets.upload_area : URL.createObjectURL(img3)}
                alt="Upload 3"
              />
              <input
                ref={fileInput3}
                type="file"
                hidden
                onChange={(e) => setimg3(e.target.files[0])}
              />
            </div>

            <div
              onClick={() => fileInput4.current.click()}
              className="cursor-pointer"
            >
              <img
                className="w-20 h-20 object-cover border border-gray-300"
                src={!img4 ? assets.upload_area : URL.createObjectURL(img4)}
                alt="Upload 4"
              />
              <input
                ref={fileInput4}
                type="file"
                hidden
                onChange={(e) => setimg4(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2 font-semibold">Product name <span className="text-red-500">*</span></p>
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
          <p className="mb-2 font-semibold">Product description <span className="text-red-500">*</span></p>
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
            <p className="mb-2 font-semibold">Product category <span className="text-red-500">*</span></p>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                // Reset subcategory when changing main category
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
            <p className="mb-2 font-semibold">Sub category <span className="text-red-500">*</span></p>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              {displaySelectedSubcategories()}
            </select>
          </div>

          <div>
            <p className="mb-2 font-semibold">Product price <span className="text-red-500">*</span></p>
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
            <div>
              <p
                className={`border border-gray-300 px-3 py-1 cursor-pointer rounded ${
                  sizes.includes("S") ? "bg-blue-500 text-white border-blue-500" : "bg-slate-100"
                }`}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("S")
                      ? prev.filter((s) => s !== "S")
                      : [...prev, "S"]
                  )
                }
              >
                S
              </p>
            </div>

            <div>
              <p
                className={`border border-gray-300 px-3 py-1 cursor-pointer rounded ${
                  sizes.includes("M") ? "bg-blue-500 text-white border-blue-500" : "bg-slate-100"
                }`}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("M")
                      ? prev.filter((s) => s !== "M")
                      : [...prev, "M"]
                  )
                }
              >
                M
              </p>
            </div>

            <div>
              <p
                className={`border border-gray-300 px-3 py-1 cursor-pointer rounded ${
                  sizes.includes("L") ? "bg-blue-500 text-white border-blue-500" : "bg-slate-100"
                }`}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("L")
                      ? prev.filter((s) => s !== "L")
                      : [...prev, "L"]
                  )
                }
              >
                L
              </p>
            </div>

            <div>
              <p
                className={`border border-gray-300 px-3 py-1 cursor-pointer rounded ${
                  sizes.includes("XL") ? "bg-blue-500 text-white border-blue-500" : "bg-slate-100"
                }`}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("XL")
                      ? prev.filter((s) => s !== "XL")
                      : [...prev, "XL"]
                  )
                }
              >
                XL
              </p>
            </div>

            <div>
              <p
                className={`border border-gray-300 px-3 py-1 cursor-pointer rounded ${
                  sizes.includes("XXL") ? "bg-blue-500 text-white border-blue-500" : "bg-slate-100"
                }`}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("XXL")
                      ? prev.filter((s) => s !== "XXL")
                      : [...prev, "XXL"]
                  )
                }
              >
                XXL
              </p>
            </div>
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
          onClick={submit} 
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
