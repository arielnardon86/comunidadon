import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function Modification({ token, building }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL || "https://comunidadon-backend.onrender.com";

  console.log("Building recibido en Modification:", building);

  // Función para decodificar el payload del token JWT
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const decodedToken = decodeToken(token);
  const isAdmin = decodedToken?.username === "admin";
  console.log("isAdmin en Modification:", isAdmin);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token || !building) {
        console.log("No hay token o building para cargar usuarios");
        return;
      }
      console.log("Solicitando usuarios a:", `${apiUrl}/${building}/api/users`);
      try {
        const response = await fetch(`${apiUrl}/${building}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al cargar usuarios: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log("Usuarios cargados:", data);
        setUsers(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    fetchUsers();
  }, [token, building]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser || !token || !building) return;
    try {
      const response = await fetch(`${apiUrl}/${building}/api/users/${selectedUser}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword, phone_number: newPhone, email: newEmail }),
      });
      if (!response.ok) throw new Error("Error al actualizar usuario");
      Swal.fire({
        icon: "success",
        title: "Actualización exitosa",
        text: "Usuario actualizado correctamente.",
      });
      setNewPassword("");
      setNewPhone("");
      setNewEmail("");
      const updatedUsers = await (await fetch(`${apiUrl}/${building}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })).json();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || !token || !building) return;
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${apiUrl}/${building}/api/users/${selectedUser}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error("Error al eliminar usuario");
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "Usuario eliminado correctamente.",
          });
          setSelectedUser("");
          setNewPassword("");
          setNewPhone("");
          setNewEmail("");
          const updatedUsers = await (await fetch(`${apiUrl}/${building}/api/users`, {
            headers: { Authorization: `Bearer ${token}` },
          })).json();
          setUsers(updatedUsers);
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message,
          });
        }
      }
    });
  };

  const selectedUserData = users.find(user => user.username === selectedUser) || {};

  if (!isAdmin) {
    return null;
  }

  return (
    <div
      className="p-4 max-w-md mx-auto border border-gray-300 rounded-lg shadow-md bg-white"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 className="text-2xl mb-4 text-center text-gray-900">Gestión de Usuarios</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Seleccionar Usuario:</label>
          <select
            value={selectedUser}
            onChange={(e) => {
              const user = users.find(u => u.username === e.target.value);
              setSelectedUser(e.target.value);
              setNewPassword("");
              setNewPhone(user?.phone_number || "");
              setNewEmail(user?.email || "");
            }}
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}
          >
            <option value="">-- Seleccionar usuario --</option>
            {users.map((user) => (
              <option key={user.username} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        {selectedUser && (
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Nueva Contraseña (dejar en blanco para no cambiar):
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Teléfono:</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Email:</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition-colors duration-200"
              style={{ backgroundColor: "#3b82f6", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.375rem" }}
            >
              Actualizar Usuario
            </button>
            <button
              type="button"
              onClick={handleDeleteUser}
              className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600 transition-colors duration-200"
              style={{ backgroundColor: "#ef4444", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.375rem" }}
            >
              Eliminar Usuario
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Modification;