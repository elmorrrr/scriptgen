const ROLES: any = [
  [1000, "User"],
  [2000, "CustomerService"],
  [3000, "SupplyManager"],
  [3100, "SalesManager"],
  [4000, "ProductManager"],
  [5000, "Admin"],
  [5100, "HRAdmin"],
  [5200, "TechAdmin"],
  [6000, "BusinessAnalysts"],
  [7000, "SuperAdmin"],
];

const ROLES_MAP = new Map(ROLES);

export default class Role {
  constructor(public roleIds: number[]) {}

  set roles(ids: number[]) {
    if (!Array.isArray(ids) || !ids.every((id) => typeof id === "number")) {
      throw new Error("Array of numbers required.");
    }
    this.roleIds = ids;
  }

  private getSortedRoleIds(order: "ASC" | "DESC" = "ASC"): number[] {
    const compareFn =
      order === "ASC"
        ? (a: number, b: number) => a - b
        : (a: number, b: number) => b - a;
    return [...this.roleIds].sort(compareFn);
  }

  getRoles(format: "array" | "string" = "array"): number[] | string {
    const roleIds = this.getSortedRoleIds();
    const roleNames = roleIds.map((id) => ROLES_MAP.get(id));
    if (format === "array") {
      return roleIds;
    } else {
      return roleNames.join(", ");
    }
  }

  getHigherRole(
    type: "number" | "string" | "object" = "number"
  ): number | string | object {
    const highestRoleId = this.getSortedRoleIds("DESC")[0] || 1000;
    const highestRoleName = ROLES_MAP.get(highestRoleId) || "User";
    switch (type) {
      case "number":
        return highestRoleId;
      case "string":
        return highestRoleName;
      case "object":
        return { [highestRoleId]: highestRoleName };
      default:
        return highestRoleId;
    }
  }
}
