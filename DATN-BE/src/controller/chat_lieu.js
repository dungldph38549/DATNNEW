import ChatLieu from '../models/chat_lieu.js';

export const getAllChatLieu = async (req, res) => {
  try {
    const danhSach = await ChatLieu.find();
    res.status(200).json(danhSach);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

export const createChatLieu = async (req, res) => {
  try {
    const { ten, ngay_tao, ngay_cap_nhat, trang_thai } = req.body;

    // Chuyển đổi ngày nếu định dạng là dd/MM/yyyy
    const parseDate = (dateStr) => {
      if (!dateStr) return undefined;
      const [day, month, year] = dateStr.split('/');
      return new Date(`${year}-${month}-${day}`);
    };

    const newChatLieu = new ChatLieu({
      ten,
      ngay_tao: parseDate(ngay_tao),
      ngay_cap_nhat: parseDate(ngay_cap_nhat),
      trang_thai
    });

    const saved = await newChatLieu.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Tạo mới thất bại', error: err.message });
  }
};

export const updateChatLieu = async (req, res) => {
  try {
    const { ten, ngay_tao, ngay_cap_nhat, trang_thai } = req.body;

    const parseDate = (dateStr) => {
      if (!dateStr) return undefined;
      const [day, month, year] = dateStr.split('/');
      return new Date(`${year}-${month}-${day}`);
    };

    const updatedChatLieu = await ChatLieu.findByIdAndUpdate(
      req.params.id,
      {
        ten,
        ngay_tao: parseDate(ngay_tao),
        ngay_cap_nhat: parseDate(ngay_cap_nhat),
        trang_thai
      },
      { new: true }
    );

    if (!updatedChatLieu) {
      return res.status(404).json({ message: 'Không tìm thấy chất liệu' });
    }

    res.status(200).json(updatedChatLieu);
  } catch (err) {
    res.status(400).json({ message: 'Cập nhật thất bại', error: err.message });
  }
};

export const deleteChatLieu = async (req, res) => {
  try {
    const deleted = await ChatLieu.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy chất liệu để xoá' });
    }

    res.status(200).json({ message: 'Xoá thành công' });
  } catch (err) {
    res.status(400).json({ message: 'Xoá thất bại', error: err.message });
  }
};