export default function parseJsonFile<T extends object>(file: File) {
  return new Promise<T>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) =>
      resolve(event.target && JSON.parse(event.target.result as string));
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
}
