import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const BASE = {
  buttonsStyling: false,
  customClass: {
    popup: 'dss-swal-popup',
    title: 'dss-swal-title',
    htmlContainer: 'dss-swal-text',
    confirmButton: 'dss-swal-confirm',
    icon: 'dss-swal-icon',
    container: 'dss-swal-container',
  },
};

/** Stylish success popup — form submitted / application updated */
export function showSuccessPopup({
  title = 'Success!',
  text = 'Your form has been submitted successfully.',
  confirmText = 'OK',
} = {}) {
  return Swal.fire({
    ...BASE,
    icon: 'success',
    title,
    text,
    confirmButtonText: confirmText,
    timer: 3200,
    timerProgressBar: true,
    backdrop: true,
    allowOutsideClick: false,
    showClass: {
      popup: 'swal2-show dss-swal-in',
      backdrop: 'swal2-backdrop-show dss-swal-backdrop',
    },
  });
}

/** Stylish error popup */
export function showErrorPopup({
  title = 'Something went wrong',
  text = 'Please try again.',
  confirmText = 'OK',
} = {}) {
  return Swal.fire({
    ...BASE,
    icon: 'error',
    title,
    text,
    confirmButtonText: confirmText,
    backdrop: true,
    allowOutsideClick: false,
    showClass: {
      popup: 'swal2-show dss-swal-in',
      backdrop: 'swal2-backdrop-show dss-swal-backdrop',
    },
  });
}
