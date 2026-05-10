import PC from '../models/pcModel.js';

export const getAllPCs = async (req, res) => {
  try {
    const pcs = await PC.find();
    res.json(pcs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addPC = async (req, res) => {
  try {
    const { pcName, lab, ip, status } = req.body;

    const pc = await PC.create({
      pcName,
      lab,
      ip,
      status,
      lastSeen: new Date(),
    });

    res.status(201).json(pc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePCStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'Online' && status !== 'Offline') {
      return res.status(400).json({ message: "Invalid status. Use 'Online' or 'Offline'." });
    }

    const updatedPC = await PC.findByIdAndUpdate(
      id,
      {
        status,
        lastSeen: new Date(),
      },
      { new: true }
    );

    if (!updatedPC) {
      return res.status(404).json({ message: 'PC not found' });
    }

    res.json(updatedPC);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
