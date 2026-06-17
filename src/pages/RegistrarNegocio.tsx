
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import BookingStepper from "@/components/booking/BookingStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { businessService } from "@/services/business.service";
import type { ApiCategory } from "@/types/api";
import ScheduleEditor, { defaultWeekSchedule } from "../components/business/ScheduleEditor";

const STEPS = ["Información", "Contacto", "Ubicación", "Servicios", "Empleados", "Horarios", "Branding"];

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100),
  category: z.string().min(1, "Seleccioná un rubro"),
  description: z.string().min(10, "Mínimo 10 caracteres").max(500),
  whatsapp: z.string().min(6, "Ingresá un número válido"),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  website: z.string().optional(),
  address: z.string().min(3, "Ingresá una dirección"),
  city: z.string().min(2, "Ingresá una ciudad"),
  locality: z.string().optional(),
  province: z.string().min(2, "Ingresá una provincia"),
  services: z.array(z.object({
    name: z.string().min(2),
    duration: z.number().min(5),
    price: z.number().min(0),
    description: z.string().optional(),
  })).min(1, "Agregá al menos un servicio"),
  employees: z.array(z.object({
    name: z.string().min(2),
    specialty: z.string().min(2),
  })).min(1, "Agregá al menos un empleado"),
  schedule: z.record(
  z.string(),
  z.object({
    open: z.boolean(),
    shifts: z.array(
      z.object({
        start: z.string(),
        end: z.string(),
      })
    ).min(1),
  }),
),
});

type FormData = z.infer<typeof schema>;

const defaultSchedule = defaultWeekSchedule;

const RegistrarNegocio = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", category: "", description: "",
      whatsapp: "", phone: "", instagram: "", website: "",
      address: "", city: "", locality: "", province: "",
      services: [{ name: "", duration: 30, price: 0, description: "" }],
      employees: [{ name: "", specialty: "" }],
      schedule: defaultSchedule,
    },
    mode: "onTouched",
  });

  const { register, control, formState: { errors }, trigger, getValues, setValue, watch } = form;

  const servicesField = useFieldArray({ control, name: "services" });
  const employeesField = useFieldArray({ control, name: "employees" });
  const schedule = watch("schedule");

  const fieldsPerStep: (keyof FormData)[][] = [
    ["name", "category", "description"],
    ["whatsapp", "phone", "instagram", "website"],
    ["address", "city", "locality", "province"],
    ["services"],
    ["employees"],
    ["schedule"],
    [],
  ];

useEffect(() => {
  const loadCategories = async () => {
    try {
      const data =
        await businessService.getCategories();

      setCategories(data);
    } catch (error) {
      console.error(
        "Error cargando categorías",
        error,
      );
    }
  };

  loadCategories();
}, []);

  
  const next = async () => {
    const fields = fieldsPerStep[step - 1];
    const valid = await trigger(fields as any);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = () => {
    setModalOpen(true);
  };

  if (submitted) {
    const data = getValues();
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <CheckCircle size={64} className="mx-auto text-primary" />
          <h1 className="mt-4 text-3xl font-bold text-foreground">¡Negocio registrado!</h1>
          <p className="mt-2 text-muted-foreground">Tu página pública se está generando.</p>

          <Card className="mt-8 text-left">
            <CardContent className="p-6 space-y-2">
              <h3 className="font-semibold text-foreground text-lg">{data.name}</h3>
              <p className="text-sm text-muted-foreground">{data.category} · {data.city}, {data.province}</p>
              <p className="text-sm text-muted-foreground">{data.description}</p>
              <p className="text-sm text-muted-foreground">{data.services.length} servicios · {data.employees.length} empleados</p>
            </CardContent>
          </Card>

          <div className="mt-6 flex gap-3 justify-center">
            <Button onClick={() => navigate("/dashboard")}>Ir al Dashboard</Button>
            <Button variant="outline" onClick={() => navigate("/")}>Volver al inicio</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">Verificación pendiente</DialogTitle>
          <DialogDescription className="text-base mt-2">
            En Breve se le confirmará y verificará el negocio, se le avisará vía mail.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-4">
          <Button onClick={() => { setModalOpen(false); setSubmitted(true); }}>
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Registrar tu negocio</h1>
        <p className="text-muted-foreground mb-6">Completá los datos y creá tu página en minutos.</p>

        <BookingStepper currentStep={step} steps={STEPS} />

        <Card className="mt-8">
          <CardContent className="p-6 space-y-5">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Información básica</h3>
                <div className="space-y-2">
                  <Label>Nombre del negocio *</Label>
                  <Input {...register("name")} placeholder="Ej: Barbería Don Carlos" />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Rubro *</Label>
                  <Select value={watch("category")} onValueChange={(v) => setValue("category", v)}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar rubro" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem
                          key={c.id_categoria}
                          value={c.nombre}
                        >
                          {c.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Descripción *</Label>
                  <Textarea {...register("description")} placeholder="Describí tu negocio..." />
                  {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Contacto</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>WhatsApp *</Label>
                    <Input {...register("whatsapp")} placeholder="+54 11 1234-5678" />
                    {errors.whatsapp && <p className="text-sm text-destructive">{errors.whatsapp.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input {...register("phone")} placeholder="+54 11 1234-5678" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input {...register("instagram")} placeholder="@tunegocio" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sitio web</Label>
                    <Input {...register("website")} placeholder="https://tunegocio.com" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Ubicación</h3>
                <div className="space-y-2">
                  <Label>Dirección *</Label>
                  <Input {...register("address")} placeholder="Av. Corrientes 1234" />
                  {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Ciudad *</Label>
                    <Input {...register("city")} placeholder="Buenos Aires" />
                    {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Localidad</Label>
                    <Input {...register("locality")} placeholder="Palermo" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Provincia *</Label>
                  <Input {...register("province")} placeholder="Buenos Aires" />
                  {errors.province && <p className="text-sm text-destructive">{errors.province.message}</p>}
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Servicios</h3>
                <p className="text-sm text-muted-foreground">Agregá los servicios que ofrecés.</p>
                {servicesField.fields.map((field, i) => (
                  <div key={field.id} className="rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Servicio {i + 1}</span>
                      {servicesField.fields.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => servicesField.remove(i)}><Trash2 size={16} className="text-destructive" /></Button>
                      )}
                    </div>
                    <Input {...register(`services.${i}.name`)} placeholder="Nombre del servicio" />
                    <div className="grid gap-3 grid-cols-2">
                      <Input
                        type="number"
                        {...register(
                          `services.${i}.duration`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                      />

                      <Input
                        type="number"
                        {...register(
                          `services.${i}.price`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                      />
                    </div>
                    <Input {...register(`services.${i}.description`)} placeholder="Descripción (opcional)" />
                  </div>
                ))}
                {errors.services && <p className="text-sm text-destructive">{typeof errors.services.message === "string" ? errors.services.message : "Completá los servicios"}</p>}
                <Button variant="outline" className="w-full" onClick={() => servicesField.append({ name: "", duration: 30, price: 0, description: "" })}>
                  <Plus size={16} className="mr-2" /> Agregar servicio
                </Button>
              </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Empleados</h3>
                <p className="text-sm text-muted-foreground">Agregá tu equipo de trabajo.</p>
                {employeesField.fields.map((field, i) => (
                  <div key={field.id} className="rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Empleado {i + 1}</span>
                      {employeesField.fields.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => employeesField.remove(i)}><Trash2 size={16} className="text-destructive" /></Button>
                      )}
                    </div>
                    <Input {...register(`employees.${i}.name`)} placeholder="Nombre completo" />
                    <Input {...register(`employees.${i}.specialty`)} placeholder="Especialidad" />
                  </div>
                ))}
                {errors.employees && <p className="text-sm text-destructive">{typeof errors.employees.message === "string" ? errors.employees.message : "Completá los empleados"}</p>}
                <Button variant="outline" className="w-full" onClick={() => employeesField.append({ name: "", specialty: "" })}>
                  <Plus size={16} className="mr-2" /> Agregar empleado
                </Button>
              </div>
            )}

            {/* Step 6 */}
            {step === 6 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Horarios de atención</h3>
                <p className="text-sm text-muted-foreground">
                  Configurá cuándo atendés. Podés usar un preset, copiar entre días o agregar pausas para turnos partidos.
                </p>
                <ScheduleEditor
                  value={schedule as any}
                  onChange={(next) => setValue("schedule", next as any, { shouldValidate: true })}
                />
              </div>
            )}

            {/* Step 7 */}
            {step === 7 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Branding</h3>
                <p className="text-sm text-muted-foreground">Subí el logo y fotos de tu negocio. (Disponible próximamente con almacenamiento en la nube)</p>
                <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                  <p className="text-muted-foreground">Arrastrá o hacé clic para subir tu logo</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG hasta 5MB</p>
                </div>
                <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                  <p className="text-muted-foreground">Fotos del negocio</p>
                  <p className="text-xs text-muted-foreground mt-1">Hasta 5 fotos, PNG o JPG</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t border-border">
              <Button variant="outline" onClick={prev} disabled={step === 1}>
                <ArrowLeft size={16} className="mr-2" /> Anterior
              </Button>
              {step < STEPS.length ? (
                <Button onClick={next}>
                  Siguiente <ArrowRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Button onClick={form.handleSubmit(onSubmit)}>
                  Registrar negocio <CheckCircle size={16} className="ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default RegistrarNegocio;
