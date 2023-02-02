import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { FieldInstanceBaseProps } from "../field/types";
import { FieldArrayContext } from "./context";
import { FieldArrayInstance } from "./types";
import {
  useFieldLike,
  useListenToListenToArray,
} from "../field/use-field-like";
import { useFieldLikeSync } from "../field/use-field-like-sync";

export interface FieldArrayRenderProps<T = any>
  extends FieldInstanceBaseProps<T> {
  children: (props: FieldArrayInstance<T>) => JSX.Element;
  initialValue?: T[];
}

function FieldArrayComp<T>(
  props: FieldArrayRenderProps<T>,
  ref: ForwardedRef<FieldArrayInstance<T>>
) {
  const {
    value,
    errors,
    setErrors,
    setValue: setValues,
    isTouched,
    isDirty,
    isValid,
    _normalizedDotName,
    runFieldValidation,
    valueRef,
    setIsDirty,
    setIsTouched,
  } = useFieldLike<T, FieldArrayInstance<T>>({
    props,
    initialValue: [] as T[],
  });

  useListenToListenToArray({
    listenTo: props.listenTo,
    runFieldValidation,
    valueRef,
  });

  const setValue = useCallback(
    (index: number, value: T) => {
      setValues((v) => {
        const newValues = [...v];
        newValues[index] = value;
        return newValues;
      });
    },
    [setValues]
  );

  /* Helpers */
  const add = useCallback(
    (val: T) => {
      setValues((v) => [...v, val]);
    },
    [setValues]
  );

  const remove = useCallback(
    (index: number) => {
      setValues((v) => {
        const newValue = [...v];
        newValue.splice(index, 1);
        return newValue;
      });
    },
    [setValues]
  );

  const insert = useCallback(
    (index: number, val: T) => {
      setValues((v) => {
        const newValue = [...v];
        newValue.splice(index, 0, val);
        return newValue;
      });
    },
    [setValues]
  );

  const move = useCallback(
    (from: number, to: number) => {
      setValues((v) => {
        const newValue = [...v];
        const value = newValue[from];
        newValue.splice(from, 1);
        newValue.splice(to, 0, value);
        return newValue;
      });
    },
    [setValues]
  );

  const replace = useCallback(
    (index: number, val: T) => {
      setValues((v) => {
        const newValue = [...v];
        newValue[index] = val;
        return newValue;
      });
    },
    [setValues]
  );

  const swap = useCallback(
    (indexA: number, indexB: number) => {
      setValues((v) => {
        const newValue = [...v];
        const a = newValue[indexA];
        newValue[indexA] = newValue[indexB];
        newValue[indexB] = a;
        return newValue;
      });
    },
    [setValues]
  );

  const fieldArrayInstance = useMemo(() => {
    return {
      value,
      add,
      move,
      insert,
      remove,
      swap,
      replace,
      setValue,
      props,
      _normalizedDotName,
      errors,
      setErrors,
      isValid,
      setIsDirty,
      isDirty,
      setIsTouched,
      isTouched,
    };
  }, [
    value,
    add,
    move,
    insert,
    remove,
    swap,
    replace,
    setValue,
    props,
    _normalizedDotName,
    errors,
    setErrors,
    isValid,
    setIsDirty,
    isDirty,
    setIsTouched,
    isTouched,
  ]);

  const mutableRef = useRef<FieldArrayInstance<T>>(fieldArrayInstance);

  useFieldLikeSync<T, FieldArrayInstance<T>>({
    value,
    mutableRef,
    isValid,
    isDirty,
    isTouched,
    props,
    errors,
  });

  useImperativeHandle(ref, () => fieldArrayInstance, [fieldArrayInstance]);

  return (
    <FieldArrayContext.Provider value={fieldArrayInstance}>
      {props.children(fieldArrayInstance)}
    </FieldArrayContext.Provider>
  );
}

export const FieldArray = memo(forwardRef(FieldArrayComp)) as <T>(
  props: FieldArrayRenderProps<T> & {
    ref?: ForwardedRef<FieldArrayInstance<T>>;
  }
) => ReturnType<typeof FieldArrayComp>;