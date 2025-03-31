import React, { useState } from "react";

const listaGeneralAcreedores = [
  { NIT: "12345", ciudad: "Medellín", dirección: "Calle 1", email: "correo1@ejemplo.com", nombre: "Bancolombia", teléfono: "1111111" },
  { NIT: "67890", ciudad: "Bogotá", dirección: "Carrera 2", email: "correo2@ejemplo.com", nombre: "Davivienda", teléfono: "2222222" },
  { NIT: "678989", ciudad: "Bogotá", dirección: "Carrera 2", email: "correo1@ejemplo.com", nombre: "Colpatria", teléfono: "2222222" },
 { NIT: "678936", ciudad: "Cali", dirección: "Carrera 2", email: "correo2@ejemplo.com", nombre: "Colpatria 2", teléfono: "2222222" },
  { NIT: "6789996", ciudad: "Armenia", dirección: "Carrera 2", email: "correo3@ejemplo.com", nombre: "Colpatria 3", teléfono: "2222222" },
  // Más acreedores...
];


export function EditarInsolvenc() {

  const initialData = {
  cedulaCliente: "8025014",
  email: "carlos@protonmail.com",
  nombres: "Carlos Juan",
  apellidos: "Restrepo Gomez",
  Solicituds: [
    {
      Acreedors: [
        { nombre: "Bancolombia" },
        { nombre: "Davivienda" },
      ],
    },
  ],
};

  const [clienteData, setClienteData] = useState(initialData);
  const [coincidencias, setCoincidencias] = useState([]); // Para almacenar las coincidencias encontradas
  const [selectedAcreedores, setSelectedAcreedores] = useState({}); // Manejar acreedores seleccionados individualmente por campo

  const handleInputChange = (e, field, arrayName, parentArrayIndex, itemIndex) => {
    const updatedArray = [...clienteData[arrayName]];
    const updatedParent = { ...updatedArray[parentArrayIndex] };
    const updatedChildArray = [...updatedParent.Acreedors];

    // Actualizar el valor ingresado
    updatedChildArray[itemIndex][field] = e.target.value;

    // Si se está modificando el campo "nombre", buscar coincidencias
    if (field === "nombre") {
      const matches = listaGeneralAcreedores.filter(
        (acreedor) => acreedor.nombre.toLowerCase() === e.target.value.toLowerCase()
      );
      setCoincidencias(matches);
      setSelectedAcreedores((prev) => ({
        ...prev,
        [`${parentArrayIndex}-${itemIndex}`]: null, // Resetear selección específica
      }));
    }

    updatedParent.Acreedors = updatedChildArray;
    updatedArray[parentArrayIndex] = updatedParent;
    setClienteData({ ...clienteData, [arrayName]: updatedArray });
  };

  const handleSelectChange = (selectedIndex, arrayName, parentArrayIndex, itemIndex) => {
    const updatedArray = [...clienteData[arrayName]];
    const updatedParent = { ...updatedArray[parentArrayIndex] };
    const updatedChildArray = [...updatedParent.Acreedors];

    // Llenar los campos automáticamente con el acreedor seleccionado
    const acreedorSeleccionado = coincidencias[selectedIndex];
    updatedChildArray[itemIndex] = { ...acreedorSeleccionado };

    updatedParent.Acreedors = updatedChildArray;
    updatedArray[parentArrayIndex] = updatedParent;
    setClienteData({ ...clienteData, [arrayName]: updatedArray });

    setSelectedAcreedores((prev) => ({
      ...prev,
      [`${parentArrayIndex}-${itemIndex}`]: selectedIndex, // Guardar la selección específica
    }));
  };

  const handleAddAcreedor = (parentArrayIndex) => {
    const updatedArray = [...clienteData.Solicituds];
    const updatedParent = { ...updatedArray[parentArrayIndex] };
    updatedParent.Acreedors = [...updatedParent.Acreedors, { nombre: "" }];
    updatedArray[parentArrayIndex] = updatedParent;
    setClienteData({ ...clienteData, Solicituds: updatedArray });
  };

  const handleDeleteAcreedor = (parentArrayIndex, itemIndex) => {
    const updatedArray = [...clienteData.Solicituds];
    const updatedParent = { ...updatedArray[parentArrayIndex] };
    updatedParent.Acreedors = updatedParent.Acreedors.filter((_, index) => index !== itemIndex);
    updatedArray[parentArrayIndex] = updatedParent;
    setClienteData({ ...clienteData, Solicituds: updatedArray });
  };

  const handleSubmit = () => {
    console.log("Datos guardados:", clienteData);
    // Aquí puedes implementar la lógica para enviar los datos al backend.
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h2>Datos del Cliente</h2>
      <label>
        Cédula:
        <input
          type="text"
          value={clienteData.cedulaCliente}
          onChange={(e) => handleInputChange(e, "cedulaCliente")}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          value={clienteData.email}
          onChange={(e) => handleInputChange(e, "email")}
        />
      </label>
      <br />

      {/* Renderizar y permitir modificaciones en los arreglos internos */}
      {clienteData.Solicituds &&
        clienteData.Solicituds.map((solicitud, i) => (
          <div key={i}>
            <h3>Solicitud {i + 1}</h3>
            {solicitud.Acreedors &&
              solicitud.Acreedors.map((acreedor, j) => (
                <div key={j}>
                  <label>
                    Acreedor {j + 1} - Nombre:
                    <input
                      type="text"
                      value={acreedor.nombre}
                      onChange={(e) =>
                        handleInputChange(e, "nombre", "Solicituds", i, j)
                      }
                    />
                  </label>
                  <br />
                  {/* Mostrar el selector si hay coincidencias */}
                  {coincidencias.length > 0 && (
                    <label>
                      Seleccionar Acreedor:
                      <select
                        value={selectedAcreedores[`${i}-${j}`] || ""}
                        onChange={(e) =>
                          handleSelectChange(
                            parseInt(e.target.value),
                            "Solicituds",
                            i,
                            j
                          )
                        }
                      >
                        <option value="" disabled>
                          Seleccione una opción
                        </option>
                        {coincidencias.map((opcion, index) => (
                          <option key={index} value={index}>
                            {opcion.nombre} - {opcion.ciudad}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <br />
                  <label>
                    Ciudad:
                    <input
                      type="text"
                      value={acreedor.ciudad || ""}
                      readOnly
                    />
                  </label>
                  <br />
                  <label>
                    Dirección:
                    <input
                      type="text"
                      value={acreedor.dirección || ""}
                      readOnly
                    />
                  </label>
                  <br />
                  <label>
                    Email:
                    <input
                      type="email"
                      value={acreedor.email || ""}
                      readOnly
                    />
                  </label>
                  <br />
                  <label>
                    Teléfono:
                    <input
                      type="text"
                      value={acreedor.teléfono || ""}
                      readOnly
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteAcreedor(i, j)}
                  >
                    Eliminar Acreedor
                  </button>
                  <br />
                </div>
              ))}
            <button type="button" onClick={() => handleAddAcreedor(i)}>
              Agregar Acreedor
            </button>
          </div>
        ))}

      <button type="button" onClick={handleSubmit}>
        Guardar
      </button>
    </form>
  );


}
