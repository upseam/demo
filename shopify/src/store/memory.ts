import type { ProductSummary } from "../products/queries.ts";

export class ProductStore {
  private readonly products = new Map<string, ProductSummary>();

  upsert(product: ProductSummary): "created" | "updated" | "unchanged" {
    const existing = this.products.get(product.id);
    this.products.set(product.id, product);
    if (!existing) {
      return "created";
    }
    return existing.updatedAt === product.updatedAt ? "unchanged" : "updated";
  }

  remove(id: string): boolean {
    return this.products.delete(id);
  }

  get(id: string): ProductSummary | undefined {
    return this.products.get(id);
  }

  all(): ProductSummary[] {
    return [...this.products.values()];
  }

  latestUpdate(): string | undefined {
    return this.all()
      .map((product) => product.updatedAt)
      .sort()
      .at(-1);
  }
}
