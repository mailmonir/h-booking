import { z } from "zod";
const requiredString = z.string().min(1, "Required");

export const signinSchema = z.object({
  email: requiredString.email(),
  password: requiredString,
});

export const signupSchema = z
  .object({
    name: requiredString,
    email: requiredString.email("Invalid email"),
    password: z
      .string()
      .min(1, "Required")
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
        "Password must be at least 6 characters long, contain at least one uppercase letter, one number, and one special character"
      ),
    passwordConfirmation: requiredString,
    // role: z.enum(["admin", "buyer", "seller", "shipper", "manager", "sadmin"]),
    // bio: z.string().optional(),
    // image: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

// export const updateUserSchema = z
//   .object({
//     name: requiredString,
//     email: requiredString.email("Invalid email"),
//     password: z
//       .string()
//       .refine(
//         (value) => {
//           if (!value) return true; // allow empty password
//           const regex =
//             /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
//           return regex.test(value);
//         },
//         {
//           message:
//             "Password must be at least 6 characters long, contain at least one uppercase letter, one number, and one special character",
//         }
//       )
//       .optional(),
//     passwordConfirmation: z.string().optional(),
//     role: z.enum(["admin", "buyer", "seller", "shipper", "manager", "sadmin"]),
//     bio: z.string().optional(),
//     image: z.array(z.string()).optional(),
//   })
//   .refine((data) => data.password === data.passwordConfirmation, {
//     message: "Passwords do not match",
//     path: ["passwordConfirmation"],
//   });

export const forgotPassSchema = z.object({
  email: requiredString.email("Invalid email"),
});

export const resetPassSchema = z
  .object({
    password: z
      .string()
      .min(1, "Required")
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
        "Password must be at least 6 characters long, contain at least one uppercase letter, one number, and one special character"
      ),
    passwordConfirmation: requiredString,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export const verifySchema = z.object({
  code: requiredString,
  key: z.string().optional(),
});

export type SigninSchemaType = z.infer<typeof signinSchema>;
export type SignupSchemaType = z.infer<typeof signupSchema>;
// export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;
export type ForgotPassSchemaType = z.infer<typeof forgotPassSchema>;
export type ResetPassSchemaType = z.infer<typeof resetPassSchema>;
export type VerifySchemaType = z.infer<typeof verifySchema>;
