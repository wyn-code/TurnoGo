import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import type { FormData } from "@/features/register-business/schema";
import { defaultValues } from "@/features/register-business/defaults";
import BusinessEmployeesStep from "@/features/register-business/components/BusinessEmployeesStep";

const categoriasMock = vi.fn(() => ({ data: [], isLoading: false }));

vi.mock("@/hooks/useApi", () => ({
  useCategories: () => categoriasMock(),
}));

function renderStep(overrides: Partial<FormData> = {}) {
  function Wrapper() {
    const form = useForm<FormData>({ defaultValues: { ...defaultValues, ...overrides } });

    return <BusinessEmployeesStep form={form} />;
  }

  return render(<Wrapper />);
}

describe("BusinessEmployeesStep", () => {
  it("pide cantidad de espacios y oculta empleados para Deportes", () => {
    renderStep({ es_deportes: true, cantidad_espacios: 3 });

    expect(screen.getByLabelText("Cantidad de espacios")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Ej: Juan")).not.toBeInTheDocument();
    expect(screen.getByText(/Cancha 1/)).toBeInTheDocument();
  });

  it("pide empleados para las demás categorías", () => {
    renderStep({ es_deportes: false });

    expect(screen.getByPlaceholderText("Ej: Juan")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ej: Pérez")).toBeInTheDocument();
    expect(screen.queryByLabelText("Cantidad de espacios")).not.toBeInTheDocument();
  });
});
