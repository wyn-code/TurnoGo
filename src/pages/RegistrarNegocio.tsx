import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Trash2, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { categories } from "@/data/mockData";
import { CLOUDINARY_CONFIG } from "@/lib/cloudinary";

const DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
const STEPS = [
  "Información",
  "Imagen",
  "Contacto",
  "Ubicación",
  "Servicios",
  "Empleados",
  "Horarios",
];

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100),
  category: z.string().min(1, "Seleccioná un rubro"),
  description: z.string().min(10, "Mínimo 10 caracteres").max(500),
  image: z.string().min(1, "Subí una imagen del negocio"),
  whatsapp: z.string().min(6, "Ingresá un número válido"),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  website: z.string().optional(),
  address: z.string().min(3, "Ingresá una dirección"),
  city: z.string().min(2, "Ingresá una ciudad"),
  locality: z.string().optional(),
  province: z.string().min(2, "Ingresá una provincia"),
  services: z
    .array(
      z.object({
        name: z.string().min(2),
        duration: z.number().min(5),
        price: z.number().min(0),
        description: z.string().optional(),
      }),
    )
    .min(1, "Agregá al menos un servicio"),
  employees: z
    .array(
      z.object({
        name: z.string().min(2),
        specialty: z.string().min(2),
      }),
    )
    .min(1, "Agregá al menos un empleado"),
  schedule: z.record(
    z.string(),
    z.object({
      open: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
  ),
});

type FormData = z.infer<typeof schema>;

const defaultSchedule = Object.fromEntries(
  DAYS.map((d) => [d, { open: d !== "Domingo", start: "09:00", end: "18:00" }]),
);

const RegistrarNegocio = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      image: "",
      whatsapp: "",
      phone: "",
      instagram: "",
      website: "",
      address: "",
      city: "",
      locality: "",
      province: "",
      services: [{ name: "", duration: 30, price: 0, description: "" }],
      employees: [{ name: "", specialty: "" }],
      schedule: defaultSchedule,
    },
    mode: "onTouched",
  });

  const {
    register,
    control,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    watch,
  } = form;

  const servicesField = useFieldArray({ control, name: "services" });
  const employeesField = useFieldArray({ control, name: "employees" });
  const schedule = watch("schedule");

  const fieldsPerStep: (keyof FormData)[][] = [
    ["name", "category", "description"],
    ["image"],
    ["whatsapp", "phone", "instagram", "website"],
    ["address", "city", "locality", "province"],
    ["services"],
    ["employees"],
    ["schedule"],
  ];

  const next = async () => {
    const fields = fieldsPerStep[step - 1];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      // Validar todos los campos antes de enviar
      const allFields = fieldsPerStep.flat() as (keyof typeof data)[];
      const valid = await trigger(allFields);

      if (!valid) {
        console.error("Validación fallida");
        alert("Por favor completá todos los campos correctamente");
        setIsLoading(false);
        return;
      }

      // Preparar datos para enviar al backend
      // NOTA: Reemplaza el import y la llamada según tu backend
      // import { businessService } from "@/services/business.service";
      
      // Generar slug a partir del nombre
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const businessData = {
        name: data.name,
        slug,
        category: data.category,
        description: data.description,
        image: data.image,
        address: data.address,
        city: data.city,
        province: data.province,
        locality: data.locality || undefined,
        phone: data.phone || undefined,
        whatsapp: data.whatsapp,
        instagram: data.instagram || undefined,
        website: data.website || undefined,
      };

      console.log("Enviando datos al backend:", businessData);

      // TODO: Descomentar cuando tengas el backend listo
      // const response = await businessService.createBusiness(businessData);
      // console.log("Negocio creado:", response);

      // Por ahora, simular respuesta exitosa
      setSubmitted(true);

      // Aquí puedes también guardar servicios y empleados:
      // for (const service of data.services) {
      //   await serviceService.createService(response.id, {
      //     name: service.name,
      //     duration: service.duration,
      //     price: service.price,
      //     description: service.description,
      //   });
      // }
      //
      // for (const employee of data.employees) {
      //   await professionalService.createProfessional(response.id, {
      //     name: employee.name,
      //     specialty: employee.specialty,
      //     photo: "",
      //   });
      // }
    } catch (error) {
      console.error("Error al registrar:", error);
      const message = error instanceof Error ? error.message : "Error desconocido";
      alert(`Error al registrar el negocio: ${message}`);
    } finally {
      setIsLoading(false);
    }
  });

  if (submitted) {
    const data = getValues();
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <CheckCircle size={64} className="mx-auto text-primary" />
          <h1 className="mt-4 text-3xl font-bold text-foreground">
            ¡Negocio registrado!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tu página pública se está generando.
          </p>

          <Card className="mt-8 text-left">
            <CardContent className="p-6 space-y-2">
              <h3 className="font-semibold text-foreground text-lg">
                {data.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {data.category} · {data.city}, {data.province}
              </p>
              <p className="text-sm text-muted-foreground">
                {data.description}
              </p>
              <p className="text-sm text-muted-foreground">
                {data.services.length} servicios · {data.employees.length}{" "}
                empleados
              </p>
            </CardContent>
          </Card>

          <div className="mt-6 flex gap-3 justify-center">
            <Button onClick={() => navigate("/dashboard")}>
              Ir al Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Volver al inicio
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
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
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Información básica
                </h3>
                <div className="space-y-2">
                  <Label>Nombre del negocio *</Label>
                  <Input
                    {...register("name")}
                    placeholder="Ej: Barbería Don Carlos"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Rubro *</Label>
                  <Select
                    value={watch("category")}
                    onValueChange={(v) => setValue("category", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rubro" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">
                      {errors.category.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Descripción *</Label>
                  <Textarea
                    {...register("description")}
                    placeholder="Describí tu negocio..."
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Foto del negocio
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Subí una foto que represente tu negocio. Se usará como imagen
                  de portada.
                </p>
                <Label>Imagen *</Label>
                <ImageUpload
                  value={watch("image")}
                  onChange={(url) => setValue("image", url)}
                  cloudName={CLOUDINARY_CONFIG.cloudName}
                  uploadPreset={CLOUDINARY_CONFIG.uploadPreset}
                />
                {errors.image && (
                  <p className="text-sm text-destructive">
                    {errors.image.message}
                  </p>
                )}
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Contacto
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>WhatsApp *</Label>
                    <Input
                      {...register("whatsapp")}
                      placeholder="+54 11 1234-5678"
                    />
                    {errors.whatsapp && (
                      <p className="text-sm text-destructive">
                        {errors.whatsapp.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input
                      {...register("phone")}
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                      {...register("instagram")}
                      placeholder="@tunegocio"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sitio web</Label>
                    <Input
                      {...register("website")}
                      placeholder="https://tunegocio.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Ubicación
                </h3>
                <div className="space-y-2">
                  <Label>Dirección *</Label>
                  <Input
                    {...register("address")}
                    placeholder="Av. Corrientes 1234"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Ciudad *</Label>
                    <Input {...register("city")} placeholder="Buenos Aires" />
                    {errors.city && (
                      <p className="text-sm text-destructive">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Localidad</Label>
                    <Input {...register("locality")} placeholder="Palermo" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Provincia *</Label>
                  <Input {...register("province")} placeholder="Buenos Aires" />
                  {errors.province && (
                    <p className="text-sm text-destructive">
                      {errors.province.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Servicios
                </h3>
                <p className="text-sm text-muted-foreground">
                  Agregá los servicios que ofrecés.
                </p>
                {servicesField.fields.map((field, i) => (
                  <div
                    key={field.id}
                    className="rounded-lg border border-border p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        Servicio {i + 1}
                      </span>
                      {servicesField.fields.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => servicesField.remove(i)}
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      )}
                    </div>
                    <Input
                      {...register(`services.${i}.name`)}
                      placeholder="Nombre del servicio"
                    />
                    <div className="grid gap-3 grid-cols-2">
                      <Input
                        {...register(`services.${i}.duration`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        placeholder="Duración (min)"
                      />

                      <Input
                        {...register(`services.${i}.price`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        placeholder="Precio ($)"
                      />
                    </div>
                    <Input
                      {...register(`services.${i}.description`)}
                      placeholder="Descripción (opcional)"
                    />
                  </div>
                ))}
                {errors.services && (
                  <p className="text-sm text-destructive">
                    {typeof errors.services.message === "string"
                      ? errors.services.message
                      : "Completá los servicios"}
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    servicesField.append({
                      name: "",
                      duration: 30,
                      price: 0,
                      description: "",
                    })
                  }
                >
                  <Plus size={16} className="mr-2" /> Agregar servicio
                </Button>
              </div>
            )}

            {/* Step 6 */}
            {step === 6 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Empleados
                </h3>
                <p className="text-sm text-muted-foreground">
                  Agregá tu equipo de trabajo.
                </p>
                {employeesField.fields.map((field, i) => (
                  <div
                    key={field.id}
                    className="rounded-lg border border-border p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        Empleado {i + 1}
                      </span>
                      {employeesField.fields.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => employeesField.remove(i)}
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      )}
                    </div>
                    <Input
                      {...register(`employees.${i}.name`)}
                      placeholder="Nombre completo"
                    />
                    <Input
                      {...register(`employees.${i}.specialty`)}
                      placeholder="Especialidad"
                    />
                  </div>
                ))}
                {errors.employees && (
                  <p className="text-sm text-destructive">
                    {typeof errors.employees.message === "string"
                      ? errors.employees.message
                      : "Completá los empleados"}
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    employeesField.append({ name: "", specialty: "" })
                  }
                >
                  <Plus size={16} className="mr-2" /> Agregar empleado
                </Button>
              </div>
            )}

            {/* Step 7 */}
            {step === 7 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Horarios de atención
                </h3>
                {DAYS.map((day) => {
                  const daySchedule = schedule?.[day] ?? {
                    open: false,
                    start: "09:00",
                    end: "18:00",
                  };
                  return (
                    <div
                      key={day}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <Switch
                        checked={daySchedule.open}
                        onCheckedChange={(v) =>
                          setValue(`schedule.${day}.open`, v)
                        }
                      />
                      <span className="w-24 text-sm font-medium text-foreground">
                        {day}
                      </span>
                      {daySchedule.open ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Input
                            type="time"
                            className="w-28"
                            value={daySchedule.start}
                            onChange={(e) =>
                              setValue(`schedule.${day}.start`, e.target.value)
                            }
                          />
                          <span className="text-muted-foreground">a</span>
                          <Input
                            type="time"
                            className="w-28"
                            value={daySchedule.end}
                            onChange={(e) =>
                              setValue(`schedule.${day}.end`, e.target.value)
                            }
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Cerrado
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Resumen antes de enviar */}
                <div className="mt-8 rounded-lg bg-accent p-4 space-y-3">
                  <h4 className="font-semibold text-foreground text-sm">
                    Resumen de tu negocio:
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Nombre</p>
                      <p className="font-medium text-foreground">
                        {watch("name")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rubro</p>
                      <p className="font-medium text-foreground">
                        {watch("category")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Servicios</p>
                      <p className="font-medium text-foreground">
                        {servicesField.fields.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Empleados</p>
                      <p className="font-medium text-foreground">
                        {employeesField.fields.length}
                      </p>
                    </div>
                  </div>
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
                <Button
                  onClick={onSubmit}
                  disabled={isLoading}
                  className="gap-2"
                >
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
};

export default RegistrarNegocio;
