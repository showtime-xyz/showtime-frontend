import { useEffect, useMemo } from "react";

import { SetFieldValue } from "react-hook-form";
import { MMKV } from "react-native-mmkv";

import { FileStorage } from "app/lib/file-storage/file-storage";

const store = new MMKV();

type FormPersistConfig = {
  watch: (names?: string | string[]) => any;
  setValue: SetFieldValue<any>;
  exclude?: string[];
  onDataRestored?: (data: any) => void;
  validate?: boolean;
  dirty?: boolean;
  touch?: boolean;
  onTimeout?: () => void;
  timeout?: number;
  defaultValues?: { [key: string]: any };
};

export const usePersistForm = (
  name: string,
  {
    watch,
    setValue,
    exclude = [],
    onDataRestored,
    defaultValues,
    validate = false,
    dirty = false,
    touch = false,
    onTimeout,
    timeout = 86400000,
  }: FormPersistConfig
) => {
  const watchedValues = watch();
  const fileStorage = useMemo(() => new FileStorage(name), [name]);

  const clearStorage = () => {
    store.delete(name);
    fileStorage.clearStorage();
  };

  useEffect(() => {
    async function restoreForm() {
      const dataRestored: { [key: string]: any } = {};

      const str = store.getString(name);
      if (str) {
        const { _timestamp = null, ...values } = JSON.parse(str);
        const currTimestamp = Date.now();

        if (timeout && currTimestamp - _timestamp > timeout) {
          onTimeout?.();
          clearStorage();
          return;
        }
        let fileValues: any = {};
        for (let key in values) {
          const shouldSet = !exclude.includes(key);
          if (shouldSet) {
            if (values[key] === "instanceof File") {
              fileValues[key] = values[key];
            } else {
              const value = values[key];
              dataRestored[key] = value;
              setValue(key, value, {
                shouldValidate: validate,
                shouldDirty: dirty,
                shouldTouch: touch,
              });
            }
          }
        }

        for (let key in fileValues) {
          fileStorage.getFile(key).then((file) => {
            setValue(key, file);
            dataRestored[key] = file;
          });
        }
      } else if (defaultValues) {
        for (let key in defaultValues) {
          const shouldSet = !exclude.includes(key);
          if (shouldSet) {
            const value = defaultValues?.[key];
            dataRestored[key] = value;
            setValue(key, value, {
              shouldValidate: validate,
              shouldDirty: dirty,
              shouldTouch: touch,
            });
          }
        }
      }

      onDataRestored?.(dataRestored);
    }
    restoreForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, onDataRestored, setValue]);

  useEffect(() => {
    let stringValues: any = {};
    for (let key in watchedValues) {
      if (!exclude.includes(key)) {
        if (watchedValues[key] instanceof File) {
          fileStorage.saveFile(watchedValues[key], key);
          stringValues[key] = "instanceof File";
        } else {
          stringValues[key] = watchedValues[key];
        }
      }
    }

    if (Object.keys(stringValues).length) {
      if (timeout !== undefined) {
        stringValues._timestamp = Date.now();
      }
      store.set(name, JSON.stringify(stringValues));
    }
  }, [watchedValues, timeout, exclude, fileStorage, name]);

  return {
    clearStorage,
  };
};
