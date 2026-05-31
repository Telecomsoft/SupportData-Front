import getEndpoint from "@utility/getEndPoint";
import axios from 'axios';
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { signInType } from '@type/signInType.ts';
import { LoginFormData } from "@components/screen/Login.tsx";

export default function useSignIn(): UseMutationResult<signInType, Error, LoginFormData> {
   return useMutation({
      mutationKey: ['sign-in'],
      mutationFn: (data: LoginFormData) => axios.post(getEndpoint() + 'api/Base/Login', data)
   });
}
