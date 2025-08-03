import { useEffect } from 'react';
import {
  Form, Input, InputNumber, Button, Checkbox, Upload,
  Select, Space, Card, Divider, message,
  Table
} from 'antd';
import { PlusOutlined, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProductById,
  createProduct,
  updateProduct,
  uploadImage,
  uploadImages,
  getAllBrands,
  getAllCategories
} from './../api/index';

const { TextArea } = Input;

const ProductDetail = ({ productId = null, onClose }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: productData, isLoading } = useQuery({
    queryKey: ['admin-product-detail', productId],
    queryFn: () => getProductById(productId),
    enabled: productId !== null && productId !== 'create',
  });

  const { data: brands } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: () => getAllBrands('all'),
    keepPreviousData: true,
  });
  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => getAllCategories('all'),
    keepPreviousData: true,
  })

  const mutation = useMutation({
    mutationFn: productId !== 'create' ? updateProduct : createProduct,
    onSuccess: () => {
      Swal.fire('Thành công', `${productId !== 'create' ? 'Cập nhật' : 'Tạo'
        } sản phẩm thành công!`, 'success');
      queryClient.invalidateQueries(['admin-products']);
      onClose();
    },
    onError: (err) => {
      if (err.response?.data?.message)
        Swal.fire('Thất bại', err.response.data.message, 'warning');
    }
  });

  useEffect(() => {
    if (productData) {
      form.setFieldsValue({
        ...productData,
        attributes: productData.attributes || [],
        variants: productData.variants || [],
      });
    }
  }, [productData, form]);

  const handleMainUpload = async ({ file }) => {
    const formD = new FormData();
    formD.append('file', file);
    const res = await uploadImage(formD);
    form.setFieldsValue({ image: res.path });
  };

  const handleChangeSubImages = async (e) => {
    const files = Array.from(e.target.files);

    try {
      const formDataMulti = new FormData();
      files.forEach((file) => formDataMulti.append('files', file));
      const result = await uploadImages(formDataMulti);
      form.setFieldsValue({ srcImages: result.paths });
    } catch (err) {
      console.error('Upload ảnh phụ thất bại:', err);
    }
  };

  const handleRemoveSubImage = (indexToRemove) => {
    const currrent = form.getFieldValue('srcImages') || [];
    form.setFieldsValue({ srcImages: currrent.filter((_, i) => i !== indexToRemove) });
  };

  const onFinish = (values) => {
    mutation.mutate({ id: productId !== 'create' ? productId : undefined, payload: { ...values, srcImages: form.getFieldValue('srcImages') } });
  };

  return (
    <Card
      title={productId !== 'create' ? '✏️ Sửa sản phẩm' : '➕ Tạo sản phẩm mới'}
      loading={isLoading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          hasVariants: false,
          variants: [],
          attributes: [],
        }}
      >
        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="sortDescription" label="Miêu tả ngắn" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="brandId" label="Thương hiệu" rules={[{ required: true }]}>
          <Select options={brands?.data?.map(b => ({ label: b.name, value: b._id }))} />
        </Form.Item>

        <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
          <Select options={categories?.data?.map(c => ({ label: c.name, value: c._id }))} />
        </Form.Item>

        <Form.Item
          name="image"
          label="Ảnh chính"
          rules={[{ required: true, message: 'Ảnh chính là bắt buộc' }]}
        >
          <Upload
            customRequest={handleMainUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh chính</Button>
          </Upload>
          <Form.Item noStyle shouldUpdate={(prev, cur) => prev.image !== cur.image}>
            {({ getFieldValue }) =>
              getFieldValue('image') ? (
                <img
                  src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${getFieldValue('image')}`}
                  alt="Preview"
                  style={{ width: 120, marginTop: 10 }}
                />
              ) : null
            }
          </Form.Item>
        </Form.Item>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ảnh phụ
          </label>

          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif"
              multiple
              onChange={handleChangeSubImages}
            />
            {/* Hiển thị ảnh preview */}
            <Form.Item shouldUpdate>
              {({ getFieldValue }) => {
                const images = getFieldValue('srcImages') || [];
                return (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {images.map((imgPath, index) => (
                      <div key={index} className="relative" style={{ width: "120px" }}>
                        <img
                          src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${imgPath}`}
                          alt={`Ảnh phụ ${index + 1}`}
                          style={{ width: "120px" }}
                          className="w-full h-20 object-cover rounded border border-gray-300 shadow"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSubImage(index)}
                          className="absolute top-0 right-0 text-white w-6 h-6 flex items-center justify-center"
                          title="Xoá ảnh"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                );
              }}
            </Form.Item>
          </div>
        </div>

        <Space size="large">
          <Form.Item
            name="price"
            label="Giá tiền"
            rules={[{ required: true, type: 'number', min: 0 }]}
          >
            <InputNumber formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            name="countInStock"
            label="Tồn kho"
            rules={[{ required: true, type: 'number', min: 0 }]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
        </Space>

        <Form.Item name="hasVariants" valuePropName="checked">
          <Checkbox>Có biến thể?</Checkbox>
        </Form.Item>

        <Form.Item shouldUpdate={(prev, cur) => prev.hasVariants !== cur.hasVariants}>
          {({ getFieldValue }) =>
            getFieldValue('hasVariants') && (
              <>
                <Divider orientation="left">Thuộc tính biến thể</Divider>

                <Form.Item
                  name="attributes"
                  label="Attributes (phân cách dấu phẩy)"
                  rules={[
                    {
                      validator: (_, val) =>
                        Array.isArray(val)
                          ? Promise.resolve()
                          : Promise.reject('Cần nhập thuộc tính'),
                    },
                  ]}
                >
                  <Select mode="tags" placeholder="e.g. Color, Size" />
                </Form.Item>

                {/* Bao toàn bộ Form.List trong shouldUpdate để re-render khi attributes đổi */}
                <Form.Item shouldUpdate={(prev, cur) => prev.attributes !== cur.attributes}>
                  {({ getFieldValue }) => {
                    const attributes = getFieldValue('attributes') || [];

                    return (
                      <Form.List name="variants">
                        {(fields, { add, remove }) => {
                          const columns = [
                            {
                              title: 'SKU',
                              dataIndex: 'sku',
                              render: (_, __, index) => (
                                <Form.Item
                                  name={[index, 'sku']}
                                  rules={[{ required: true, message: 'Nhập SKU' }]}
                                >
                                  <Input />
                                </Form.Item>
                              ),
                            },
                            {
                              title: 'Giá',
                              dataIndex: 'price',
                              render: (_, __, index) => (
                                <Form.Item
                                  name={[index, 'price']}
                                  rules={[
                                    {
                                      required: true,
                                      type: 'number',
                                      min: 1,
                                      message: 'Nhập giá hợp lệ',
                                    },
                                  ]}
                                >
                                  <InputNumber style={{ width: '100%' }} />
                                </Form.Item>
                              ),
                            },
                            {
                              title: 'Tồn kho',
                              dataIndex: 'stock',
                              render: (_, __, index) => (
                                <Form.Item
                                  name={[index, 'stock']}
                                  rules={[
                                    {
                                      required: true,
                                      type: 'number',
                                      min: 0,
                                      message: 'Nhập tồn kho hợp lệ',
                                    },
                                  ]}
                                >
                                  <InputNumber style={{ width: '100%' }} />
                                </Form.Item>
                              ),
                            },
                            ...attributes.map((attr) => ({
                              title: attr,
                              dataIndex: ['attributes', attr],
                              render: (_, __, index) => (
                                <Form.Item
                                  name={[index, 'attributes', attr]}
                                  rules={[
                                    {
                                      required: true,
                                      message: `Vui lòng nhập ${attr}`,
                                    },
                                  ]}
                                >
                                  <Input placeholder={`Giá trị cho ${attr}`} />
                                </Form.Item>
                              ),
                            })),
                            {
                              title: 'Hành động',
                              dataIndex: 'action',
                              render: (_, __, index) => (
                                <Button
                                  danger
                                  style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}
                                  type="link"
                                  icon={<MinusCircleOutlined />}
                                  onClick={() => remove(index)}
                                >
                                  Xoá
                                </Button>
                              ),
                            },
                          ];

                          const dataSource = fields.map((field, index) => ({
                            key: field.key,
                            ...field,
                          }));

                          return (
                            <>
                              <Table
                                pagination={false}
                                dataSource={dataSource}
                                columns={columns}
                                rowKey="key"
                              />
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  onClick={() => add()}
                                  block
                                  icon={<PlusOutlined />}
                                >
                                  Thêm biến thể
                                </Button>
                              </Form.Item>
                            </>
                          );
                        }}
                      </Form.List>
                    );
                  }}
                </Form.Item>
              </>
            )
          }
        </Form.Item>


        <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {productId !== 'create' ? 'Cập nhật' : 'Tạo mới'}
            </Button>
            <Button onClick={onClose}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductDetail;
