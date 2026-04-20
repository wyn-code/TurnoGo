import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import {type AdminBusiness } from "@/data/adminMockData";
import { EditBusinessModal } from "@/components/admin/EditBusinessModal";
import { DeleteBusinessDialog } from "@/components/admin/DeleteBusinessDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, ExternalLink, Search, ShieldCheck, LogOut } from "lucide-react";
import { negocioService } from "../services/negocio.service";

const AdminPanel = () => {
  const { user, logout, isLoading } = useAuth();
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);  
  const [search, setSearch] = useState("");
  const [editBusiness, setEditBusiness] = useState<AdminBusiness | null>(null);
  const [deleteBusiness, setDeleteBusiness] = useState<AdminBusiness | null>(null);

useEffect(() => {
  const fetchNegocios = async () => {
    try {
      const data = await negocioService.getAll();
      console.log("NEGOCIOS BACK:", data);

  const mapped = data.map((n: any) => ({
    id: String(n.id_negocio), // 🔥 importante
    businessName: n.nombre,
    ownerFirstName: "Dueño", // temporal
    ownerLastName: "",
    ownerEmail: "email@email.com", // temporal
    category: n.rubro || "General", // 🔥 importante
    status: n.activo ? "activo" : "inactivo", // si existe en DB
    slug: n.slug || "negocio",
    primaryColor: "#000000",
    totalAppointments: 0,
  }));

    setBusinesses(mapped as AdminBusiness[]);  
  } catch (error) {
      console.error("Error cargando negocios:", error);
    }
  };

  fetchNegocios();
}, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const filtered = businesses.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.businessName.toLowerCase().includes(q) ||
      b.ownerFirstName.toLowerCase().includes(q) ||
      b.ownerLastName.toLowerCase().includes(q) ||
      b.ownerEmail.toLowerCase().includes(q)
    );
  });

  const handleSave = (updated: AdminBusiness) => {
    setBusinesses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleDelete = (id: string) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
    setDeleteBusiness(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-navbar">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground">Panel de Desarrolladores</h1>
              <p className="text-xs text-muted-foreground">Administración de Turnexo</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="text-sm text-muted-foreground">Total negocios</p>
            <p className="text-3xl font-bold text-foreground">{businesses.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="text-sm text-muted-foreground">Activos</p>
            <p className="text-3xl font-bold text-primary">{businesses.filter((b) => b.status === "activo").length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="text-sm text-muted-foreground">Turnos totales</p>
            <p className="text-3xl font-bold text-foreground">{businesses.reduce((sum, b) => sum + b.totalAppointments, 0)}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, dueño o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Dueño</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Negocio</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Enlace</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No se encontraron negocios
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">
                      {b.ownerFirstName} {b.ownerLastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{b.ownerEmail}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {b.primaryColor && (
                          <div className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: b.primaryColor }} />
                        )}
                        <span className="font-medium">{b.businessName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{b.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={b.status === "activo" ? "default" : "outline"} className={b.status === "activo" ? "" : "text-muted-foreground"}>
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`/negocio/${b.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        Ver <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditBusiness(b)} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteBusiness(b)} title="Eliminar" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <EditBusinessModal key={editBusiness?.id ?? "none"} business={editBusiness} open={!!editBusiness} onOpenChange={(o) => !o && setEditBusiness(null)} onSave={handleSave} />
      <DeleteBusinessDialog business={deleteBusiness} open={!!deleteBusiness} onOpenChange={(o) => !o && setDeleteBusiness(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default AdminPanel;
