import { EmployeeRole, Employees } from "@models/employees.model";

export class EmployeesRepository {
  findAllWithUserNames() {
    return Employees.find().populate({
      path: "user_id",
      select: "name surname email",
    });
  }

  findById(id: string) {
    return Employees.findById(id).populate({
      path: "user_id",
      select: "name surname email",
    });
  }

  findByUserId(userId: string) {
    return Employees.findOne({ user_id: userId }).populate({
      path: "user_id",
      select: "name surname email",
    });
  }

  create(data: { user_id: string; role: EmployeeRole }) {
    return Employees.create(data);
  }

  update(id: string, role: EmployeeRole) {
    return Employees.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );
  }

  delete(id: string) {
    return Employees.findByIdAndDelete(id);
  }

  count() {
    return Employees.countDocuments();
  }
}

export const employeesRepository = new EmployeesRepository();
