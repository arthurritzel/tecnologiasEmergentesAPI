import yup from "yup"

export default yup
    .object()
    .shape({
        name: yup
            .string()
            .min(3, "Nome muito curto")
            .max(80, "Nome muito longo")
            .required("Nome é obrigatorio"),
        email: yup
            .string()
            .email()
            .required("Email é obrigatorio"),
        password: yup
            .string()
            .min(6, "Senha curta")
            .max(80, "Senha muito longa")
            .required("Senha é obrigatoria"),
    })
