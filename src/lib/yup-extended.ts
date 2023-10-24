import * as Yup from "yup";

declare module "yup" {
  interface StringSchema {
    unique(msg: string, data: string[] | undefined): this;
  }
}

Yup.addMethod<Yup.StringSchema>(
  Yup.string,
  "unique",
  function (msg: string, data: string[]) {
    return this.test("uniqueIn", msg, function (value) {
      if (!value) return false;
      if (!data) return false;
      return !data.includes(value);
    });
  }
);

export default Yup;
