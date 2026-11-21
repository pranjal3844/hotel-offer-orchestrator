export class SuppliersUnavailableError extends Error {
  constructor() {
    super("Both hotel suppliers are currently unavailable");

    this.name = "SuppliersUnavailableError";
  }
}