function showToastMessage(id, delay = 2000) {
  const toastEl = document.getElementById(id);
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  toast.show();
  setTimeout(() => {
    toast.hide();
  }, delay);
}
