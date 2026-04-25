import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

import businessService from "@/services/business.service";
import type { BusinessSchedulePayload } from "@/services/business.service";
import { toCreateCompleteBusinessRequest } from "./mapper";
import { schema, type FormData } from "./schema";
import { defaultValues, fieldsPerStep, STEPS } from "./defaults";

import SuccessView from "./components/SuccessView";
import BusinessInfoStep from "./components/BusinessInfoStep";
import BusinessImageStep from "./components/BusinessImageStep";
import BusinessContactStep from "./components/BusinessContactStep";
import BusinessLocationStep from "./components/BusinessLocationStep";
import BusinessServicesStep from "./components/BusinessServicesStep";
import BusinessEmployeesStep from "./components/BusinessEmployeesStep";
import BusinessScheduleStep from "./components/BusinessScheduleStep";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import BookingStepper from "@/components/booking/BookingStepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RegistrarNegocioPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues,
    mode: "onTouched",
  });

  const { trigger, getValues } = form;

  const next = async () => {
    const valid = await trigger(fieldsPerStep[step - 1] as (keyof FormData)[]);
    if (valid) {
      setStep((current) => Math.min(current + 1, STEPS.length));
    }
  };

  const prev = () => {
    setStep((current) => Math.max(current - 1, 1));
  };

  const dayMap: Record<keyof FormData["schedule"], number> = {
    Lunes: 0,
    Martes: 1,
    Miércoles: 2,
    Jueves: 3,
    Viernes: 4,
    Sábado: 5,
    Domingo: 6,
  };

  const formatScheduleForBackend = (
    schedule: FormData["schedule"]
  ): BusinessSchedulePayload[] => {
    return (Object.entries(schedule) as Array<
      [keyof FormData["schedule"], FormData["schedule"][keyof FormData["schedule"]]]
    >)
      .filter(([_, value]) => value.open && value.start && value.end)
      .map(([day, value]) => ({
        dia_semana: dayMap[day],
        hora_apertura: `${value.start}:00`,
        hora_cierre: `${value.end}:00`,
      }));
  };

  const getBusinessIdFromResponse = (response: unknown): number | null => {
    if (!response || typeof response !== "object") {
      return null;
    }

    const candidate = response as {
      id_negocio?: number;
      negocio?: { id_negocio?: number };
    };

    if (typeof candidate.id_negocio === "number") {
      return candidate.id_negocio;
    }

    if (typeof candidate.negocio?.id_negocio === "number") {
      return candidate.negocio.id_negocio;
    }

    return null;
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setIsLoading(true);

      const payload = toCreateCompleteBusinessRequest(data);
      const horarios = formatScheduleForBackend(data.schedule);

      const negocioCreado = await businessService.createCompleteBusiness(payload);
      const idNegocio = getBusinessIdFromResponse(negocioCreado);

      if (!idNegocio) {
        throw new Error("No se pudo obtener el id del negocio creado.");
      }

      if (horarios.length > 0) {
        await businessService.createHorarios(idNegocio, horarios);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error al crear negocio:", err);
      alert("Hubo un problema al registrar el negocio.");
    } finally {
      setIsLoading(false);
    }
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Prevent accidental submit before the last step (e.g. pressing Enter).
    if (step < STEPS.length) {
      event.preventDefault();
      void next();
      return;
    }

    void onSubmit(event);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BusinessInfoStep form={form} />;
      case 2:
        return <BusinessImageStep form={form} />;
      case 3:
        return <BusinessContactStep form={form} />;
      case 4:
        return <BusinessLocationStep form={form} />;
      case 5:
        return <BusinessServicesStep form={form} />;
      case 6:
        return <BusinessEmployeesStep form={form} />;
      case 7:
        return <BusinessScheduleStep form={form} />;
      default:
        return null;
    }
  };

  if (submitted) {
    return <SuccessView data={getValues()} navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Registrar tu negocio
        </h1>
        <p className="text-muted-foreground mb-6">
          Completá los datos y creá tu página en minutos.
        </p>

        <BookingStepper currentStep={step} steps={STEPS} />

        <Card className="mt-8">
          <form onSubmit={handleFormSubmit}>
          <CardContent className="p-6 space-y-5">
            {renderStep()}

            <div className="flex justify-between pt-4 border-t border-border">
              <button
                type="button"
                onClick={prev}
                disabled={step === 1}
                className="border px-4 py-2 rounded"
              >
                Anterior
              </button>

              {step < STEPS.length ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    next();
                  }}
                  className="border px-4 py-2 rounded"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="border px-4 py-2 rounded"
                >
                  {isLoading ? "Registrando..." : "Registrar negocio"}
                </button>
              )}
            </div>
          </CardContent>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}