import React, { useEffect, useState } from 'react';
import { productAdminApi, type Product } from '../../api/productAdminApi';
import { categoryApi } from '../../api/categoryApi';

const AdminProductManager: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    
    // --- STATE PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Mỗi trang hiện 10 sản phẩm

    const initialFormState: Product = {
        name: '', brand: '', image: '', price: 0, 
        description: '', color: '', status: 'Còn hàng', stock: 0,
        category: { id: 1 }
    };

    const [formData, setFormData] = useState<Product>(initialFormState);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [prodRes, catData] = await Promise.all([
                productAdminApi.getAll(),
                categoryApi.getAll()
            ]);
            setProducts(prodRes.data);
            setCategories(catData);
        } catch (error) {
            console.error("Lỗi tải dữ liệu");
        }
    };

    // --- LOGIC PHÂN TRANG GÓI GỌN ---
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    // --- CÁC HÀM XỬ LÝ CRUD ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData.id) await productAdminApi.update(formData.id, formData);
            else await productAdminApi.create(formData);
            setShowForm(false);
            loadData();
            alert("Thành công!");
        } catch (error) { alert("Lỗi lưu dữ liệu!"); }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Xác nhận xóa?")) {
            await productAdminApi.delete(id);
            loadData();
        }
    };

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>📦 Danh sách sản phẩm ({products.length})</h3>
                <button onClick={() => { setFormData(initialFormState); setShowForm(true); }} style={btnSuccess}>
                    + Thêm mới
                </button>
            </div>

            <table style={tableStyle}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={tdStyle}>Ảnh</th>
                        <th style={tdStyle}>Tên sản phẩm</th>
                        <th style={tdStyle}>Giá</th>
                        <th style={tdStyle}>Kho</th>
                        <th style={tdStyle}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={tdStyle}><img src={p.image} width="45" height="45" style={{ borderRadius: '4px', objectFit: 'cover' }} alt="p" /></td>
                            <td style={{ ...tdStyle, fontWeight: 500 }}>{p.name}</td>
                            <td style={tdStyle}>{p.price?.toLocaleString()}đ</td>
                            <td style={tdStyle}>{p.stock}</td>
                            <td style={tdStyle}>
                                <button onClick={() => { setFormData(p); setShowForm(true); }} style={btnEdit}>Sửa</button>
                                <button onClick={() => handleDelete(p.id!)} style={btnDelete}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* --- PHÂN TRANG GÓI GỌN (CHỈ HIỆN: TRƯỚC - TRANG X/Y - SAU) --- */}
            <div style={{ 
                marginTop: '30px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '20px',
                padding: '10px',
                backgroundColor: '#fff',
                borderRadius: '8px'
            }}>
                <button 
                    disabled={currentPage === 1}
                    onClick={goToPrevPage}
                    style={{
                        ...pageBtnStyle,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === 1 ? 0.5 : 1
                    }}
                >
                    &laquo; Trang trước
                </button>

                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                    Trang <span style={{ color: '#007bff' }}>{currentPage}</span> / {totalPages || 1}
                </div>

                <button 
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={goToNextPage}
                    style={{
                        ...pageBtnStyle,
                        cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
                        opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1
                    }}
                >
                    Trang sau &raquo;
                </button>
            </div>

            {/* MODAL FORM GIỮ NGUYÊN */}
            {showForm && (
                <div style={modalOverlay}>
                    <form onSubmit={handleSubmit} style={modalForm}>
                        <h3>{formData.id ? 'Cập nhật' : 'Thêm mới'}</h3>
                        <input placeholder="Tên sản phẩm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
                        <input placeholder="Link ảnh URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={inputStyle} required />
                        <input type="number" placeholder="Giá" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} style={inputStyle} required />
                        <div style={{ textAlign: 'right', marginTop: '10px' }}>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 15px', marginRight: '10px' }}>Hủy</button>
                            <button type="submit" style={btnPrimary}>Lưu lại</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const tableStyle = { width: '100%', borderCollapse: 'collapse' as const };
const tdStyle = { padding: '12px', borderBottom: '1px solid #eee', textAlign: 'left' as const };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' as const };
const modalOverlay = { position: 'fixed' as const, top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalForm = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '450px' };
const btnSuccess = { padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const btnPrimary = { padding: '8px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const btnEdit = { marginRight: '8px', padding: '4px 10px', cursor: 'pointer' };
const btnDelete = { color: 'red', padding: '4px 10px', cursor: 'pointer' };
const pageBtnStyle = { 
    padding: '8px 20px', 
    border: '1px solid #ddd', 
    borderRadius: '4px', 
    backgroundColor: '#fff',
    fontWeight: '500',
    transition: '0.2s'
};

export default AdminProductManager;