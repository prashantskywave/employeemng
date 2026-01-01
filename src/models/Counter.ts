import mongoose, { Schema, model, Document } from "mongoose";

interface ICounter extends Document {
  name: string;
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.models.Counter || model<ICounter>("Counter", counterSchema);
export default Counter;

export const getNextEmployeeId = async (): Promise<string> => {
  const counter = await (Counter as any).findOneAndUpdate(
    { name: "employee" },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" }
  );

  if (!counter) throw new Error("Failed to generate employee ID");

  const nextIdNumber = counter.seq;
  return `EMP${nextIdNumber.toString().padStart(4, "0")}`;
};
