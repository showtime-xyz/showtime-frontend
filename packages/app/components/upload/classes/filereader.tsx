import * as FileSystem from "expo-file-system";
import { toByteArray } from "react-native-quick-base64";

interface IFileInput {
  uri: string;
}

export default class TusFileReader {
  async openFile(input: IFileInput, chunkSize: number): Promise<FileSource> {
    console.log("receiving input", input);
    const fileInfo = await FileSystem.getInfoAsync(input.uri);
    console.log("fileInfo", fileInfo);
    if (fileInfo.exists) {
      return new FileSource(input, fileInfo.size);
    } else {
      throw new Error(`File at URI ${input.uri} does not exist.`);
    }
  }
}

class FileSource {
  private _file: IFileInput;
  private _size: number;

  get size(): number {
    return this._size;
  }

  constructor(file: IFileInput, size: number) {
    this._file = file;
    this._size = size;
  }

  async slice(start: number, end: number) {
    globalThis?.gc?.();

    // If start is beyond the file size, it means we've already processed the last chunk
    if (start >= this._size) {
      return { value: new Uint8Array(0), done: true }; // No more data, indicate completion
    }

    // Adjust 'end' to not exceed the file size and calculate length
    end = Math.min(end, this._size);
    const length = end - start;

    const dataUri = await FileSystem.readAsStringAsync(this._file.uri, {
      encoding: FileSystem.EncodingType.Base64,
      length: length,
      position: start,
    });
    const value = toByteArray(dataUri);

    return { value, done: false };
  }

  close(): void {
    // Implementation for close method if needed
  }
}
