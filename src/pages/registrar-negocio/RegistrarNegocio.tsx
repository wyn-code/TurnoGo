import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

import businessService from "@/services/business.service";
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
    resolver: zodResolver(schema),
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

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setIsLoading(true);

      const payload = toCreateCompleteBusinessRequest(data);
      await businessService.createCompleteBusiness(payload);

      setSubmitted(true);
    } catch (err) {
      console.error("Error al crear negocio:", err);
      alert("Error al crear negocio");
    } finally {
      setIsLoading(false);
    }
  });

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
          <CardContent className="p-6 space-y-5">
            {renderStep()}

            <div className="flex justify-between pt-4 border-t border-border">
              <Button variant="outline" onClick={prev} disabled={step === 1}>
                <ArrowLeft size={16} className="mr-2" />
                Anterior
              </Button>

              {step < STEPS.length ? (
                <Button onClick={next}>
                  Siguiente
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Button onClick={onSubmit} disabled={isLoading} className="gap-2">
                  {isLoading ? "Registrando..." : "Registrar negocio"}
                  {!isLoading && <CheckCircle size={16} />}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}