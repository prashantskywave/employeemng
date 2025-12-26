import { Employee } from "@/types/employee";
import { Request, Response } from "express";
import EmployeeModel from "@/models/Employee";

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees: Employee[] = await EmployeeModel.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const data: Employee = req.body;
    const employee = await EmployeeModel.create(data);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: "Failed to create employee" });
  }
};
