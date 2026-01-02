const express = require("express");
const router = express.Router();
const EmployeeModel = require("../../models/Employee"); 

router.post("/", async (req, res) => {
  try {
    const employee = await EmployeeModel.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const { search, department, designation, status } = req.query;

    let filter: any = {}; 
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (department) filter.department = department;
    if (designation) filter.designation = designation;
    if (status) filter.status = status;

    const employees = await EmployeeModel.find(filter).sort({ createdAt: -1 });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const employee = await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const employee = await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await EmployeeModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
