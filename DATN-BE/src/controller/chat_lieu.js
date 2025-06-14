import chat_lieu from "../models/chat_lieu.js";

export const getAll = async (req, res) => {
  try {
    const data = await chat_lieu.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const newData = new ChatLieu(req.body);
    const saved = await newData.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await ChatLieu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await ChatLieu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xoá thành công' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
