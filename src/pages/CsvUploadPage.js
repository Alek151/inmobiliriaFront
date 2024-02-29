import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import Swal from 'sweetalert2'
import Home from '../components/Home';


const CsvUploadPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
    };
  
    const handleUpload = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local
        console.log(token)
        if (!token) {
          throw new Error('No se ha iniciado sesión. Por favor, inicie sesión para cargar el archivo.');
        }
  
        const csvFile = new FormData();
        csvFile.append('csvFile', selectedFile);
  
        const response = await fetch('https://nodeupload-s10t.onrender.com/api/uploadCsv', {
          method: 'POST',
          headers: {
            'authorization': `bearer ${token}`
          },
          body: csvFile
        });
  
        console.log(response)
  
        if (!response.ok) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
                footer: '<a href="#">Why do I have this issue?</a>'
              });        }
  
        // Éxito al cargar el archivo
        Swal.fire({
          icon: 'success',
          title: 'Carga exitosa',
          text: 'El archivo CSV se cargó exitosamente a la base de datos.',
        });
      } catch (error) {
        setErrorMessage(error.message);
        console.error('Error al cargar el archivo CSV:', error);
  
        // Muestra un mensaje de error utilizando SweetAlert
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="#">Why do I have this issue?</a>'
          });
      }
    };
  
    return (
    
      <div className="container">
          <Home />
        <h2 className="mb-4">Cargar Archivo CSV</h2>
        <div className="input-group mb-3">
          <input type="file" className="form-control" accept=".csv" name='csvFile' onChange={handleFileChange} />
          <label className="input-group-text" htmlFor="inputGroupFile">Elegir archivo</label>
        </div>
        <button className="btn btn-primary" onClick={handleUpload}>
          Subir CSV
        </button>
        {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
        <p className="mt-3">Al subir el archivo CSV, se cargará en la base de datos del sistema inmobiliario.</p>
        <p>Por favor, asegúrese de que el archivo esté en formato CSV.</p>
        <p>Los datos del archivo CSV se utilizarán para actualizar la base de datos con información de casas y apartamentos.</p>
      </div>
    );
  };
  
  export default CsvUploadPage;