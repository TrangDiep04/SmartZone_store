import React, { useEffect, useState } from 'react';
import { productAdminApi, type Product } from '../../api/productAdminApi';
import { categoryApi } from '../../api/categoryApi';

const AdminProductManager: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    
    const initialFormState: Product = {
        name: '', brand: '', image: '', price: 0, 
        description: '', color: '', status: 'Còn hàng', stock: 0,
        category: { id: 1 }
    };

    const [formData, setFormData] = useState<Product>(initialFormState);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Giải nén kết quả: prodRes (AxiosResponse), catData (Mảng trực tiếp)
            const [prodRes, catData] = await Promise.all([
                productAdminApi.getAll(),
                categoryApi.getAll() 
            ]);
            
            setProducts(prodRes.data);
            setCategories(catData); // Sửa lỗi không dùng .data ở đây vì file categoryApi đã return res.data rồi

            if (!formData.id && catData.length > 0) {
                setFormData(prev => ({...prev, category: { id: catData[0].id }}));
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await productAdminApi.update(formData.id, formData);
                alert("Cập nhật thành công!");
            } else {
                await productAdminApi.create(formData);
                alert("Thêm mới thành công!");
            }
            setShowForm(false);
            loadData();
        } catch (error) {
            alert("Lỗi khi lưu dữ liệu!");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
            await productAdminApi.delete(id);
            loadData();
        }
    };

    return (
        <div style={{ marginTop: '20px', color: '#333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>📦 Quản lý Sản phẩm</h2>
                <button 
                    onClick={() => { setFormData(initialFormState); setShowForm(true); }}
                    style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    + Thêm sản phẩm mới
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }} border={1}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Thương hiệu</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id} style={{ textAlign: 'center' }}>
                            <td style={{ padding: '10px' }}>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.price?.toLocaleString()}đ</td>
                            <td>{p.brand}</td>
                            <td><span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#e9ecef' }}>{p.status}</span></td>
                            <td>
                                <button onClick={() => { setFormData(p); setShowForm(true); }} style={{ marginRight: '8px', cursor: 'pointer' }}>Sửa</button>
                                <button onClick={() => handleDelete(p.id!)} style={{ color: 'red', cursor: 'pointer' }}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3>{formData.id ? '🛠️ Hiệu chỉnh sản phẩm' : '✨ Thêm sản phẩm mới'}</h3>
                        
                        <label>Tên sản phẩm</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={inputFull} />
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label>Giá bán</label>
                                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required style={inputFull} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Số lượng kho</label>
                                <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} style={inputFull} />
                            </div>
                        </div>

                        <label>Danh mục</label>
                        <select value={formData.category.id} onChange={e => setFormData({...formData, category: {id: Number(e.target.value)}})} style={inputFull}>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <label>Trạng thái (Text)</label>
                        <input 
                            type="text" 
                            value={formData.status} 
                            onChange={e => setFormData({...formData, status: e.target.value})} 
                            placeholder="VD: Còn hàng, Mới về..." 
                            style={inputFull} 
                        />

                        <label>Thương hiệu</label>
                        <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={inputFull} />

                        <label>Mô tả</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ ...inputFull, height: '80px' }} />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', cursor: 'pointer' }}>Hủy</button>
                            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Lưu thay đổi</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const inputFull = { width: '100%', marginBottom: '15px', padding: '10px', boxSizing: 'border-box' as const, borderRadius: '4px', border: '1px solid #ccc', display: 'block', marginTop: '5px' };

export default AdminProductManager;