export const validateVehiculo = (vehiculo) => {
  const errors = [];

  // Validación de placa
  if (!vehiculo.placa) {
    errors.push('La placa es obligatoria.');
  } else if (!/^[A-Za-z0-9-]+$/.test(vehiculo.placa)) {
    errors.push('El número de placa solo puede contener letras, números y guiones.');
  } else if (vehiculo.placa.length < 6 || vehiculo.placa.length > 8) {
    errors.push('La placa debe tener entre 6 y 8 caracteres.');
  }

  // Validación de número de tarjeta
  if (!vehiculo.n_tarjeta) {
    errors.push('El número de tarjeta es obligatorio.');
  } else if (vehiculo.n_tarjeta.length < 6 || vehiculo.n_tarjeta.length > 12) {
    errors.push('El número de tarjeta debe tener entre 6 y 12 caracteres.');
  }

  // Validación de número de motor
  if (!vehiculo.n_motor) {
    errors.push('El número de motor es obligatorio.');
  } else if (vehiculo.n_motor.length < 11 || vehiculo.n_motor.length > 17) {
    errors.push('El número de motor debe tener entre 11 y 17 caracteres.');
  }

  // Validación de marca
  if (!vehiculo.marca) {
    errors.push('La marca es obligatoria.');
  } else if (vehiculo.marca.length < 3 || vehiculo.marca.length > 10) {
    errors.push('La marca debe tener entre 3 y 10 caracteres.');
  }

  // Validación de color
  if (!vehiculo.color) {
    errors.push('El color es obligatorio.');
  }

  // Validación de año de compra
  if (!vehiculo.ano_de_compra) {
    errors.push('El año de compra es obligatorio.');
  } else if (vehiculo.ano_de_compra < 1990 || vehiculo.ano_de_compra > new Date().getFullYear()) {
    errors.push('El año de compra no puede ser menor a 1990 ni mayor al año actual.');
  }

  // Validación de propietarios
  if (vehiculo.propietario1 === vehiculo.propietario2) {
    errors.push('Los propietarios no pueden ser iguales.');
  }

  return errors;
};
