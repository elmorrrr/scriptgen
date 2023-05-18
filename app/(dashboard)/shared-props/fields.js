import { options, speeds } from "@/validation/zod/config-schema"

const fields = [
  {
    name: "name",
    type: "text",
    label: "Nom",
    // required: true,
  },
  // {
  // name: "email",
  // type: "email",
  // label: "Email",
  // required: true,
  // },
  // {
  // name: "phone",
  // type: "tel",
  // label: "Téléphone",
  // required: false,
  // },
  {
    name: "cin",
    type: "text",
    label: "CIN",
    // required: true,
  },
  {
    name: "address",
    type: "textarea",
    label: "Adresse",
    // required: true,
  },
  {
    name: "provider",
    label: "Fournisseur",
    type: "select",
    // required: true,
    placeholder: "--Fournisseur--",
    options: [
      {
        label: "--Fournisseur--",
        value: "",
      },
      {
        label: "Globalnet",
        value: "globalnet",
      },
      {
        label: "Topnet",
        value: "topnet",
      },
      {
        label: "Hexabyte",
        value: "hexabyte",
      },
    ],
  },
  {
    name: "speed",
    label: "Débit",
    type: "select",
    placeholder: "--Débit--",
    // required: true,
    options: options,
  },
  {
    name: "service",
    type: "select",
    label: "Type de service",
    placeholder: "--Type de service--",
    // required: true,
    options: [
      {
        label: "--Type de service--",
        value: "",
      },
      {
        label: "HSI",
        value: "HSI",
      },
      {
        label: "VoIP",
        value: "VoIP",
      },
    ],
  },
]

export default fields
