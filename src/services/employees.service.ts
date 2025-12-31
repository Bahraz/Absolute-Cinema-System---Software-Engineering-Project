import { employeesRepository } from "@repositories/employees.repository";
import { userRepository } from "@repositories/user.repository";
import { EmployeeRole } from "@models/employees.model";

const ALLOWED_ROLES: EmployeeRole[] = ["Pracownik", "Kierownik"];

export class EmployeesService {
  async addEmployee(userId: string, role: EmployeeRole) {
    if (!ALLOWED_ROLES.includes(role)) {
      throw new Error("INVALID_ROLE");
    }

    const user = await userRepository.findById(userId);
    if (!user) throw new Error("USER_NOT_FOUND");

    const existing = await employeesRepository.findByUserId(userId);
    if (existing) throw new Error("ALREADY_EMPLOYEE");

    const employee = await employeesRepository.create({
      user_id: user._id.toString(),
      role,
    });

    return employee;
  }

  findAllWithUserNames() {
    return employeesRepository.findAllWithUserNames();
  }

  async updateRole(id: string, role: EmployeeRole) {
    if (!ALLOWED_ROLES.includes(role)) {
      throw new Error("INVALID_ROLE");
    }

    const updated = await employeesRepository.update(id, role);
    if (!updated) throw new Error("EMPLOYEE_NOT_FOUND");

    return updated;
  }

  async removeEmployee(id: string) {
    const found = await employeesRepository.findById(id);
    if (!found) throw new Error("EMPLOYEE_NOT_FOUND");

    await employeesRepository.delete(id);
    return true;
  }
}

export const employeesService = new EmployeesService();
