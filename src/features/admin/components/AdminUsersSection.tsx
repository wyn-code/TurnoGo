import { useState, useEffect } from "react";
import type { ApiUsuario } from "@/types/api";
import { EditUserModal } from "@/features/admin/components/EditUserModal";
import { DeleteUserDialog } from "@/features/admin/components/DeleteUserDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Search } from "lucide-react";
import { userService } from "@/services/user.service";
import { toast } from "sonner";

function getUserRole(user: ApiUsuario) {
  return (user.role_us ?? user.rol ?? "—").toLowerCase();
}

function formatRole(role: string) {
  switch (role) {
    case "admin":
      return "Administrador";
    case "duenio":
    case "dueño":
      return "Dueño";
    case "cliente":
      return "Cliente";
    default:
      return role;
  }
}

export function AdminUsersSection() {
  const [users, setUsers] = useState<ApiUsuario[]>([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<ApiUsuario | null>(null);
  const [deleteUser, setDeleteUser] = useState<ApiUsuario | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllAdmin();
        setUsers(data);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        toast.error("No se pudieron cargar los usuarios");
      }
    };

    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const fullName = u.usuario_us.toLowerCase();
    return (
      fullName.includes(q) ||
      u.email_us.toLowerCase().includes(q) ||
      u.usuario_us.toLowerCase().includes(q)
    );
  });

  const handleSave = async (updated: ApiUsuario) => {
    try {
      const saved = await userService.update(updated.id_us, {
        usuario_us: updated.usuario_us,
        email_us: updated.email_us,
        role_us: updated.role_us ?? updated.rol,
        estado: updated.estado,
      });

      setUsers((prev) => prev.map((u) => (u.id_us === saved.id_us ? saved : u)));
      toast.success("Usuario actualizado");
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      toast.error("No se pudo actualizar el usuario");
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await userService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id_us !== id));
      toast.success("Usuario eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      toast.error("No se pudo eliminar el usuario");
    } finally {
      setDeleteUser(null);
    }
  };

const handleToggleStatus = async (user: ApiUsuario) => {
  try {
    const updated = await userService.toggleStatus(
      user.id_us,
      !user.estado,
    );

    setUsers((prev) =>
      prev.map((u) =>
        u.id_us === updated.id_us
          ? updated
          : u,
      ),
    );

    toast.success(
      updated.estado
        ? "Usuario habilitado"
        : "Usuario deshabilitado",
    );
  } catch (error) {
    console.error(error);
    toast.error(
      "No se pudo cambiar el estado",
    );
  }
};

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <p className="text-sm text-muted-foreground">Total usuarios</p>
          <p className="text-3xl font-bold text-foreground">{users.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <p className="text-sm text-muted-foreground">Habilitados</p>
          <p className="text-3xl font-bold text-primary">
            {users.filter((u) => u.estado).length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <p className="text-sm text-muted-foreground">Administradores</p>
          <p className="text-3xl font-bold text-foreground">
            {users.filter((u) => getUserRole(u) === "admin").length}
          </p>
        </div>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, email o usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Usuario</TableHead>
              <TableHead>Negocio</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => (
                <TableRow key={u.id_us}>
                  <TableCell className="font-medium">
                    {u.usuario_us}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.negocio || "-"}</TableCell>
                  <TableCell>{u.email_us}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{formatRole(getUserRole(u))}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.estado ? "default" : "outline"}>
                      {u.estado ? "Habilitado" : "Deshabilitado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(u)}
                        title={u.estado ? "Deshabilitar" : "Habilitar"}
                      >
                        {u.estado ? "Deshabilitar" : "Habilitar"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditUser(u)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteUser(u)}
                        title="Eliminar"
                        className="text-destructive hover:text-destructive"
                      >
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

      <EditUserModal
        key={editUser?.id_us ?? "none"}
        user={editUser}
        open={!!editUser}
        onOpenChange={(o) => !o && setEditUser(null)}
        onSave={handleSave}
      />
      <DeleteUserDialog
        user={deleteUser}
        open={!!deleteUser}
        onOpenChange={(o) => !o && setDeleteUser(null)}
        onConfirm={() => deleteUser && handleDelete(deleteUser.id_us)}
      />
    </>
  );
}
