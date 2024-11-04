function getBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    reader.onerror = (error) => reject(error);
  });
}

export { getBase64 };
