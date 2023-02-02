import { expect, test } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { FieldArray, FieldArrayItem, Form } from "houseform";
import { useState } from "react";
import { z } from "zod";

test("Field array item should submit with values in tact", async () => {
  const SubmitValues = () => {
    const [values, setValues] = useState<string | null>(null);

    if (values) return <p>{values}</p>;

    return (
      <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
        {({ submit }) => (
          <div>
            <FieldArray<{ thing: number }>
              initialValue={[{ thing: 1 }]}
              name={"people"}
            >
              {({ value }) => (
                <>
                  {value.map((person, i) => (
                    <FieldArrayItem<number>
                      key={person.thing}
                      name={`people[${i}].thing`}
                    >
                      {({ value, setValue }) => (
                        <div>
                          <p>Value: {value}</p>
                          <button onClick={() => setValue(2)}>Set value</button>
                        </div>
                      )}
                    </FieldArrayItem>
                  ))}
                </>
              )}
            </FieldArray>
            <button onClick={submit}>Submit</button>
          </div>
        )}
      </Form>
    );
  };

  const { getByText, container } = render(<SubmitValues />);

  expect(getByText("Value: 1")).toBeInTheDocument();

  await user.click(getByText("Set value"));

  expect(getByText("Value: 2")).toBeInTheDocument();

  await user.click(getByText("Submit"));

  await waitFor(() =>
    expect(container).toMatchInlineSnapshot(`
      <div>
        <p>
          {"people":[{"thing":2}]}
        </p>
      </div>
    `)
  );
});

test("Field array item be able to set a value", async () => {
  const { getByText } = render(
    <Form>
      {() => (
        <FieldArray<{ thing: number }>
          initialValue={[{ thing: 1 }]}
          name={"people"}
        >
          {({ value }) => (
            <>
              {value.map((person, i) => (
                <FieldArrayItem<number>
                  key={person.thing}
                  name={`people[${i}].thing`}
                >
                  {({ value, setValue }) => (
                    <div>
                      <p>Value: {value}</p>
                      <button onClick={() => setValue(2)}>Set value</button>
                    </div>
                  )}
                </FieldArrayItem>
              ))}
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(getByText("Value: 1")).toBeInTheDocument();

  await user.click(getByText("Set value"));

  expect(getByText("Value: 2")).toBeInTheDocument();
});

test("field array item should track `isDirty`", async () => {
  const { queryByText, getByText } = render(
    <Form>
      {() => (
        <FieldArray<{ thing: number }>
          initialValue={[{ thing: 1 }]}
          name={"people"}
        >
          {({ value }) => (
            <>
              {value.map((person, i) => (
                <FieldArrayItem<number>
                  key={`people[${i}].thing`}
                  name={`people[${i}].thing`}
                >
                  {({ setValue, isDirty }) => (
                    <div>
                      {isDirty && <p>Is dirty</p>}
                      <button onClick={() => setValue(2)}>Set value</button>
                    </div>
                  )}
                </FieldArrayItem>
              ))}
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(queryByText("Is dirty")).not.toBeInTheDocument();

  await user.click(getByText("Set value"));

  expect(getByText("Is dirty")).toBeInTheDocument();
});

test("field array item should track `isTouched`", async () => {
  const { queryByText, getByText } = render(
    <Form>
      {() => (
        <FieldArray<{ thing: number }>
          initialValue={[{ thing: 1 }]}
          name={"people"}
        >
          {({ value }) => (
            <>
              {value.map((person, i) => (
                <FieldArrayItem<number>
                  key={`people[${i}].thing`}
                  name={`people[${i}].thing`}
                >
                  {({ isTouched, onBlur }) => (
                    <div>
                      {isTouched && <p>Is touched</p>}
                      <button onClick={() => onBlur()}>Blur</button>
                    </div>
                  )}
                </FieldArrayItem>
              ))}
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(queryByText("Is touched")).not.toBeInTheDocument();

  await user.click(getByText("Blur"));

  expect(getByText("Is touched")).toBeInTheDocument();
});

test("field array item should validate onChange", async () => {
  const { queryByText, getByText } = render(
    <Form>
      {() => (
        <FieldArray<{ thing: number }>
          initialValue={[{ thing: 1 }]}
          name={"people"}
        >
          {({ value }) => (
            <>
              {value.map((person, i) => (
                <FieldArrayItem<number>
                  key={`people[${i}].thing`}
                  name={`people[${i}].thing`}
                  onChangeValidate={z.number().min(3, "Must be at least 3")}
                >
                  {({ setValue, errors }) => (
                    <div>
                      <button onClick={() => setValue(2)}>Set value</button>
                      {errors.map((error) => (
                        <p key={error}>{error}</p>
                      ))}
                    </div>
                  )}
                </FieldArrayItem>
              ))}
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(queryByText("Must be at least 3")).not.toBeInTheDocument();

  await user.click(getByText("Set value"));

  expect(getByText("Must be at least 3")).toBeInTheDocument();
});

test("field array item should validate onBlur", async () => {
  const { queryByText, getByText } = render(
    <Form>
      {() => (
        <FieldArray<{ thing: number }>
          initialValue={[{ thing: 1 }]}
          name={"people"}
        >
          {({ value }) => (
            <>
              {value.map((person, i) => (
                <FieldArrayItem<number>
                  key={`people[${i}].thing`}
                  name={`people[${i}].thing`}
                  onBlurValidate={z.number().min(3, "Must be at least 3")}
                >
                  {({ onBlur, errors }) => (
                    <div>
                      <button onClick={() => onBlur()}>Blur</button>
                      {errors.map((error) => (
                        <p key={error}>{error}</p>
                      ))}
                    </div>
                  )}
                </FieldArrayItem>
              ))}
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(queryByText("Must be at least 3")).not.toBeInTheDocument();

  await user.click(getByText("Blur"));

  expect(getByText("Must be at least 3")).toBeInTheDocument();
});

test.todo("field array item should validate onSubmit");

test.todo("Should work with listenTo");
