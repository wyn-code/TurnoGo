import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  cloudName: string;
  uploadPreset: string;
}

export const ImageUpload = ({ value, onChange, cloudName, uploadPreset }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary no está configurado. Verificá .env.local");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Cloudinary upload failed", response.status, data);
        toast.error(data.error?.message || data.message || "No se pudo subir la imagen");
        return;
      }

      if (data.secure_url) {
        onChange(data.secure_url);
        setPreview(data.secure_url);
      } else {
        console.error("Cloudinary response no contenía secure_url", data);
        toast.error("Error al subir la imagen");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <Card className="relative overflow-hidden border-border p-2">
          <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3"
            onClick={handleClear}
          >
            <X size={16} />
          </Button>
        </Card>
      ) : (
        <Card
          className="border-2 border-dashed border-border p-6 text-center cursor-pointer transition-colors hover:border-primary hover:bg-accent"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            {uploading ? "Subiendo..." : "Haz clic para subir imagen"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {uploading ? "" : "PNG, JPG, GIF (máx. 5MB)"}
          </p>
        </Card>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Subiendo..." : "Seleccionar imagen"}
      </Button>
    </div>
  );
};
