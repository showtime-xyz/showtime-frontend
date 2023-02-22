import { useEffect, useMemo, useRef, useState } from "react";

import { SetFieldValue, UseFormWatch } from "react-hook-form";
import { MMKV } from "react-native-mmkv";

import { FileStorage } from "app/lib/file-storage/file-storage";

const store = new MMKV();

type FormPersistConfig = {
  watch: UseFormWatch<any>;
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
    exclude,
    onDataRestored,
    defaultValues,
    validate = false,
    dirty = false,
    touch = false,
    onTimeout,
    timeout = 86400000,
  }: FormPersistConfig
) => {
  const fileStorage = useMemo(() => new FileStorage(name), [name]);
  let persistDebounceTimeout = useRef<any>(null);
  const [restoringFiles, setRestoringFiles] = useState<{
    [key: string]: boolean;
  }>({});
  const clearStorage = () => {
    store.delete(name);
    fileStorage.clearStorage();
  };

  useEffect(() => {
    async function restoreForm() {
      const dataRestored: { [key: string]: any } = {};

      if (defaultValues) {
        for (let key in defaultValues) {
          const shouldSet = !exclude?.includes(key);
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

      const str = store.getString(name);

      if (str) {
        const { _timestamp = null, ...values } = JSON.parse(str);
        const currTimestamp = Date.now();

        if (timeout && currTimestamp - _timestamp > timeout) {
          onTimeout?.();
          clearStorage();
          return;
        }

        for (let key in values) {
          const shouldSet = !exclude?.includes(key);
          if (shouldSet) {
            if (values[key] === "instanceof File") {
              setRestoringFiles((prev) => ({ ...prev, [key]: true }));
              fileStorage
                .getFile(key)
                .then((file) => {
                  setRestoringFiles((prev) => {
                    let newPrev = { ...prev };
                    delete newPrev[key];
                    return newPrev;
                  });
                  setValue(key, file);
                  dataRestored[key] = file;
                })
                .catch(() => {
                  setRestoringFiles((prev) => {
                    let newPrev = { ...prev };
                    delete newPrev[key];
                    return newPrev;
                  });
                });

              // IndexedDB can halt sometimes if it's writing file in more than one tab, so we add this timeout as a fail safe
              setTimeout(() => {
                setRestoringFiles((prev) => {
                  let newPrev = { ...prev };
                  if (newPrev[key]) {
                    delete newPrev[key];
                  }
                  return newPrev;
                });
              }, 2000);
            } else {
              const value = values[key] ?? defaultValues?.[key];
              dataRestored[key] = value;
              setValue(key, value, {
                shouldValidate: validate,
                shouldDirty: dirty,
                shouldTouch: touch,
              });
            }
          }
        }
      }

      onDataRestored?.(dataRestored);
    }
    restoreForm();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, onDataRestored, setValue]);

  useEffect(() => {
    function persistFormValues(watchedValues: any) {
      let stringValues: any = {};
      for (let key in watchedValues) {
        if (!exclude?.includes(key)) {
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
    }

    const subscription = watch((watchedValues) => {
      if (persistDebounceTimeout.current) {
        clearTimeout(persistDebounceTimeout.current);
      }
      persistDebounceTimeout.current = setTimeout(() => {
        if (Object.keys(restoringFiles).length === 0)
          persistFormValues(watchedValues);
      }, 300);
    });

    return () => {
      if (persistDebounceTimeout.current) {
        clearTimeout(persistDebounceTimeout.current);
      }
      subscription.unsubscribe();
    };
  }, [watch, restoringFiles, timeout, exclude, fileStorage, name]);

  return {
    clearStorage,
    restoringFiles,
  };
};
