import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import Home from "../components/Home";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

const PropiedadesFiltradasPage = () => {
  const [markers, setMarkers] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filtros, setFiltros] = useState({
    habitaciones: "",
    precioMin: "",
    precioMax: "",
    latitud: "",
    longitud: "",
    distancia: "",
    balc_n: "",
    se_admiten_mascotas: "",
    piscina: "",
    jard_n: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const mapRef = useRef(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
    if (mapRef.current) {
        mapRef.current.panTo({ lat: parseFloat(property.lat), lng: parseFloat(property.lng) });
      }
  };

  const handleMarkerClose = () => {
    setSelectedProperty(null);
  };

  const handlePrintPDF = () => {
    const pdf = new jsPDF();
    const columns = [
      "Título",
      "Anunciante",
      "Descripción",
      "Precio",
      "Balcón",
      "Pet Friendly",
      "Piscina",
      "Contacto",
      "Jardín",
    ];
    const rows = propiedades.map((propiedad) => [
      propiedad.titulo,
      propiedad.anunciante,
      propiedad.descripcion,
      `Q.${propiedad.precio}`,
      propiedad.balc_n === "TRUE" ? "Si" : "No",
      propiedad.se_admiten_mascotas === "TRUE" ? "Si" : "No",
      propiedad.piscina === "TRUE" ? "Si" : "No",
      propiedad.telefonos,
      propiedad.jard_n === "TRUE" ? "Si" : "No",
    ]);
    pdf.autoTable({
      startY: 30,
      head: [columns],
      body: rows,
    });
    pdf.save("propiedades.pdf");
  };

  const handleFilter = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "No se ha iniciado sesión. Por favor, inicie sesión para cargar el archivo."
        );
      }

      const response = await fetch(
        `https://nodeupload-s10t.onrender.com/api/propiedadesFiltradas?${new URLSearchParams(
          filtros
        ).toString()}`,
        {
          method: "GET",
          headers: {
            authorization: `bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Error al filtrar propiedades. Por favor, inténtelo de nuevo más tarde."
        );
      }

      const data = await response.json();
      setPropiedades(data.propiedades_en_area);

      const validMarkersData = data.propiedades_en_area
        .filter(propiedad => !isNaN(parseFloat(propiedad.latitud)) && !isNaN(parseFloat(propiedad.longitud)))
        .map((propiedad) => ({
          lat: parseFloat(propiedad.latitud),
          lng: parseFloat(propiedad.longitud),
          title: propiedad.titulo,
        }));

      setMarkers(validMarkersData);
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error al filtrar propiedades:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
  };


  // se realiza cambio
  const handleDownloadCSV = () => {
    try {
      const csvData = convertToCSV(propiedades);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "propiedades_filtradas.csv");
    } catch (error) {
      console.error("Error al descargar CSV:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al descargar CSV. Por favor, inténtelo de nuevo más tarde.",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(",");
    const csvData = data.map((obj) => Object.values(obj).join(",")).join("\n");
    return `${headers}\n${csvData}`;
  };


  return (
    <div className="container">
      <Home />
      <h2 className="mb-4">Filtrar Propiedades</h2>
      <div className="row">
        <div className="col-md-3 mb-3">
          <label htmlFor="habitaciones" className="form-label">
            Habitaciones:
          </label>
          <input
            type="number"
            className="form-control"
            id="habitaciones"
            name="habitaciones"
            value={filtros.habitaciones}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="precioMin" className="form-label">
            Precio Mínimo:
          </label>
          <input
            type="number"
            className="form-control"
            id="precioMin"
            name="precioMin"
            value={filtros.precioMin}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="precioMax" className="form-label">
            Precio Máximo:
          </label>
          <input
            type="number"
            className="form-control"
            id="precioMax"
            name="precioMax"
            value={filtros.precioMax}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="latitud" className="form-label">
            Latitud:
          </label>
          <input
            type="number"
            className="form-control"
            id="latitud"
            name="latitud"
            value={filtros.latitud}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="longitud" className="form-label">
            Longitud:
          </label>
          <input
            type="number"
            className="form-control"
            id="longitud"
            name="longitud"
            value={filtros.longitud}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="distancia" className="form-label">
            Distancia:
          </label>
          <input
            type="number"
            className="form-control"
            id="distancia"
            name="distancia"
            value={filtros.distancia}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="balc_n" className="form-label">
            Balcón:
          </label>
          <select
            className="form-select"
            id="balc_n"
            name="balc_n"
            value={filtros.balc_n}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="TRUE">Sí</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="se_admiten_mascotas" className="form-label">
            Se admiten mascotas:
          </label>
          <select
            className="form-select"
            id="se_admiten_mascotas"
            name="se_admiten_mascotas"
            value={filtros.se_admiten_mascotas}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="TRUE">Sí</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="piscina" className="form-label">
            Piscina:
          </label>
          <select
            className="form-select"
            id="piscina"
            name="piscina"
            value={filtros.piscina}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="TRUE">Sí</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="jard_n" className="form-label">
            Jardín:
          </label>
          <select
            className="form-select"
            id="jard_n"
            name="jard_n"
            value={filtros.jard_n}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="TRUE">Sí</option>
          </select>
        </div>
      </div>
      <button className="btn btn-primary mb-3" onClick={handleFilter}>
        Aplicar Filtro
      </button>
      <button className="btn btn-success mb-3 ms-2" onClick={handleDownloadCSV}>
        Descargar CSV
      </button>
      <button className="btn btn-info mb-3 ms-2" onClick={handlePrintPDF}>
        Imprimir PDF
      </button>

      <div>
        <GoogleMap
         ref={mapRef}
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={{ lat: 40.36756, lng: -3.60932 }}
          zoom={6}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
              onClick={() => handleMarkerClick(marker)}
            >
              {marker.showInfo && (
                <InfoWindow onCloseClick={() => handleMarkerClose(marker)}>
                  <div>{marker.title}</div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </div>

      {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Anunciante</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Balcon</th>
              <th>Pet Friendly</th>
              <th>Piscina</th>
              <th>Contacto</th>
              <th>Jardín</th>
            </tr>
          </thead>
          <tbody>
            {propiedades.map((propiedad, index) => (
              <tr key={index}>
                <td>{propiedad.titulo}</td>
                <td>{propiedad.anunciante}</td>
                <td>{propiedad.descripcion}</td>
                <td>Q.{propiedad.precio}</td>
                <td>{propiedad.balc_n === "TRUE" ? "Si" : "No"}</td>
                <td>
                  {propiedad.se_admiten_mascotas === "TRUE" ? "Si" : "No"}
                </td>
                <td>{propiedad.piscina === "TRUE" ? "Si" : "No"}</td>
                <td>{propiedad.telefonos}</td>
                <td>{propiedad.jard_n === "TRUE" ? "Si" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropiedadesFiltradasPage;
