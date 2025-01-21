import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/Ecom-store";
import { createProduct, deleteProduct } from "../../api/product";
import { toast } from "react-toastify";
import UploadFile from "./UploadFile";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/datefrom";

const initialState = {
  title: "",
  description: "",
  price: 0,
  quantity: 0,
  categoryId: "",
  images: [],
};

const FormProduct = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    categoryId: "",
    images: [],
  });

  useEffect(() => {
    getCategory();
    getProduct(100);
  }, []);

  const handleOnChange = (e) => {
    console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProduct(token, form);
      console.log(res);
      setForm(initialState);
      getProduct();
      toast.success(`เพิ่มข้อมูล ${res.data.title} สำเร็จ`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDalete = async (id) => {
    console.log(id);
    if (window.confirm("ยืนยันการลบ")) {
      try {
        const res = await deleteProduct(token, id);
        console.log(res);
        toast.success("Delete สินค้าเรียบร้อยแล้ว");
        getProduct();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <form onSubmit={handleSubmit}>
        <h1>เพิ่มข้อมูลสินค้า</h1>
        <input
          className="border"
          value={form.title}
          onChange={handleOnChange}
          placeholder="Title"
          name="title"
        />
        <input
          className="border"
          value={form.description}
          onChange={handleOnChange}
          placeholder="Description"
          name="description"
        />
        <input
          type="number"
          className="border"
          value={form.price}
          onChange={handleOnChange}
          placeholder="Price"
          name="price"
        />
        <input
          className="border"
          value={form.quantity}
          onChange={handleOnChange}
          placeholder="Quantity"
          name="quantity"
        />
        <select
          className="border"
          name="categoryId"
          onChange={handleOnChange}
          required
          value={form.categoryId}
        >
          <option value="" disabled>
            Please Select
          </option>
          {categories.map((item, index) => (
            <option key={index} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <hr />

        <UploadFile form={form} setForm={setForm} />

        <button className="bg-green-600 p-2 rounded-md shadow-md hover:scale-105 hover:translate-y-1 hover:duration-200">
          เพิ่มสินค้า
        </button>

        <hr />
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-200 border">
              <th scope="col">#</th>
              <th scope="col">รูปภาพ</th>
              <th scope="col">ชื่อสินค้า</th>
              <th scope="col">รายละเอียด</th>
              <th scope="col">ราคา</th>
              <th scope="col">จำนวน</th>
              <th scope="col">จำนวนที่ขายได้</th>
              <th scope="col">วันที่อัพเดต</th>
              <th scope="col">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    {item.images.length > 0 ? (
                      <img
                        className="w-24 h-24 rounded-lg shadow-md"
                        src={item.images[0].url}
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center shadow-sm">
                        No image
                      </div>
                    )}
                  </td>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{numberFormat(item.price)}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center">{item.sold}</td>
                  <td>{dateFormat(item.updatedAt)}</td>
                  <td className=" flex gap-3">
                    <p className="bg-yellow-400 rounded-md p-1 shadow-md hover:scale-105 hover:translate-y-1 hover:duration-200">
                      <Link to={"/admin/product/" + item.id}>
                        <Pencil />
                      </Link>
                    </p>
                    <p
                      className="bg-red-400 rounded-md p-1 shadow-md hover:scale-105 hover:translate-y-1 hover:duration-200"
                      onClick={() => handleDalete(item.id)}
                    >
                      {" "}
                      <Trash2 />
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default FormProduct;
