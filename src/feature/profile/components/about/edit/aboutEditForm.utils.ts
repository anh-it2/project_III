import { z } from "zod";
import type { FieldDef, FormValues } from "../../../data/mock";

export function buildDefaults(
  fields: FieldDef[],
  initial?: FormValues
): FormValues {
  const base: FormValues = {};
  for (const f of fields) {
    base[f.name] = f.kind === "checkbox" ? false : "";
  }
  return { ...base, ...(initial ?? {}) };
}

export function buildZodSchema(fields: FieldDef[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    shape[f.name] =
      f.kind === "checkbox" ? z.boolean().optional() : z.string().optional();
  }
  return z.object(shape).superRefine((data, ctx) => {
    const record = data as Record<string, unknown>;
    for (const f of fields) {
      if (!f.required) continue;
      if (f.hideWhen && record[f.hideWhen.name] === f.hideWhen.equals) continue;
      const val = record[f.name];
      const empty =
        val === undefined ||
        val === null ||
        (typeof val === "string" && val.trim() === "");
      if (empty) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [f.name],
          message: `${f.label} is required`,
        });
      }
    }
  });
}

export function cleanValues(
  fields: FieldDef[],
  raw: FormValues
): FormValues {
  const cleaned: FormValues = {};
  const record = raw as Record<string, unknown>;
  for (const f of fields) {
    if (f.hideWhen && record[f.hideWhen.name] === f.hideWhen.equals) continue;
    const v = raw[f.name];
    if (typeof v === "string") cleaned[f.name] = v.trim();
    else if (typeof v === "boolean") cleaned[f.name] = v;
  }
  return cleaned;
}
