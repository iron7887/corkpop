import { z } from 'zod';

export const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9]{2,20}$/;
export const PASSWORD_PATTERN =
  /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,}$/;

const signupFieldsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, '이메일을 입력해 주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  nickname: z
    .string()
    .trim()
    .min(2, '닉네임은 2자 이상 입력해 주세요.')
    .max(20, '닉네임은 20자 이하로 입력해 주세요.')
    .regex(NICKNAME_PATTERN, '닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .regex(
      PASSWORD_PATTERN,
      '비밀번호는 숫자와 특수문자를 각각 1개 이상 포함해야 합니다.',
    ),
  confirmPassword: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
});

export const apiSignupSchema = signupFieldsSchema.pick({
  email: true,
  nickname: true,
  password: true,
});

export const signupSchema = signupFieldsSchema.refine(
  (values) => values.password === values.confirmPassword,
  {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  },
);

export type SignupFormValues = z.infer<typeof signupSchema>;

export const checkNicknameSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .regex(NICKNAME_PATTERN),
});

export const checkEmailSchema = z.object({
  email: z.string().trim().email(),
});
