import getFlagEmoji from "@/helpers/getFlagEmoji"
import countries from "i18n-iso-countries"
import en from "i18n-iso-countries/langs/en.json"

countries.registerLocale(en)

// function getDateOfBirth(age = 16) {
//   // Get the current date
//   const currentDate = new Date()

//   // Calculate the date that is 'age' years ago
//   const birthDate = new Date()
//   birthDate.setFullYear(currentDate.getFullYear() - age)

//   // Format the date as YYYY-MM-DD
//   const year = birthDate.getFullYear()
//   const month = (birthDate.getMonth() + 1).toString().padStart(2, "0")
//   const day = birthDate.getDate().toString().padStart(2, "0")
//   return `${year}-${month}-${day}`
// }

// const fields = [
//   // {
//   //   name: "first_name",
//   //   type: "text",
//   //   label: "First Name",
//   //   autocomplete: "given-name",
//   //   placeholder: "Enter your first name",
//   //   validation: {
//   //     required: true,
//   //     minLength: 2,
//   //     maxLength: 50,
//   //   },
//   // },
//   // {
//   //   name: "last_name",
//   //   type: "text",
//   //   label: "Last Name",
//   //   placeholder: "Enter your last name",
//   //   autocomplete: "family-name",
//   //   validation: {
//   //     required: true,
//   //     minLength: 2,
//   //     maxLength: 50,
//   //   },
//   // },

//   {
//     name: "email",
//     type: "email",
//     label: "Email",
//     placeholder: "Enter your email address",
//     disabled: true,
//     validation: {
//       required: true,
//       pattern: /^\S+@\S+\.\S+$/,
//       error: "Please enter a valid email address.",
//     },
//     error: "Please enter a valid email address.",
//     text: "You can't change email",
//   },
//   {
//     name: "username",
//     type: "text",
//     label: "Username",
//     autocomplete: "username",
//     placeholder: "Enter your username address",
//     disabled: true,
//     required: true,
//     pattern: "^S+@S+.S+$",
//     error: "Please enter a valid username address.",
//     text: "You can change username only three times",
//   },
//   {
//     name: "name",
//     type: "text",
//     label: "Name",
//     placeholder: "Enter your name",
//     required: true,
//     pattern: "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$",
//     text: "Name must contain only letters",
//     maxLength: 30,
//     minLength: 3,
//   },
//   {
//     // name: "password",
//     type: "password",
//     label: "Password",
//     autocomplete: "current-password",
//     placeholder: "Enter a strong password",
//     validation: {
//       required: true,
//       minLength: 8,
//       maxLength: 50,
//       pattern: "^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$",
//       error:
//         "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one number.",
//     },
//     text: "Your password should be at least 8 characters long and include a mix of letters, numbers, and symbols.",
//   },
//   // {
//   //   name: "phone",
//   //   type: "tel",
//   //   as: "string",
//   //   label: "Phone",
//   //   autocomplete: "tel",
//   //   placeholder: "Enter your phone number",
//   //   required: true,
//   //   pattern: "[0-9()+.-]*",
//   //   // ^\+?([0-9]{3})([- .]?)([0-9]{2})\2([0-9]{3})\2([0-9]{3})$
//   //   error: "Please enter your phone number in the format +xxx xx-xxx-xxx.",
//   //   text: "Please enter your phone number in the format +xxx xx-xxx-xxx.",
//   // },
//   {
//     name: "birthdate",
//     type: "date",
//     autocomplete: "bday",
//     min: getDateOfBirth(40),
//     max: getDateOfBirth(16),
//     label: "Birthdate",
//     placeholder: "Enter your birthdate",
//   },
//   {
//     name: "gender",
//     type: "radio",
//     autocomplete: "sex",
//     label: "Gender",
//     options: [
//       { value: "MALE", label: "Male" },
//       { value: "FEMALE", label: "Female" },
//     ],
//   },
//   // {
//   //   name: "emailUpdates",
//   //   type: "checkbox",
//   //   label: "Receive Email Updates",
//   //   caption: "Would you like to receive email updates?",
//   // },
//   {
//     name: "type",
//     type: "select",
//     label: "User Type",
//     placeholder: "Select your user type",
//     options: [
//       { value: "MEMBER", label: "Member" },
//       { value: "EMPLOYEE", label: "Employee" },
//       { value: "EMPLOYER", label: "Employeer" },
//     ],
//   },
//   // {
//   //   name: "hobbies[]",
//   //   type: "select",
//   //   options: ["Gaming", "Reading", "TV", "Music"],
//   //   validation: {
//   //     required: true,
//   //     minItems: 1,
//   //   },
//   //   label: "Hobbies",
//   // },
//   {
//     name: "position",
//     type: "text",
//     // autocomplete: "organization-title",
//     placeholder: "Position",
//     maxLength: 20,
//     label: "Position (job position)",
//   },
//   {
//     name: "bio",
//     type: "textarea",
//     placeholder: "Bio",
//     maxLength: 500,
//   },
//   {
//     name: "address.city",
//     type: "text",
//     placeholder: "City",
//     validation: {
//       minLength: 2,
//       maxLength: 50,
//     },
//     label: "City",
//     // autocomplete: "address-line2",
//   },
//   {
//     name: "address.street",
//     type: "text",
//     autocomplete: "street-address",
//     placeholder: "Street",
//     minLength: 2,
//     maxLength: 100,
//     label: "Street",
//   },
//   {
//     name: "address.state",
//     type: "text",
//     placeholder: "State",
//     autocomplete: "address-line1",
//     minLength: 2,
//     maxLength: 50,
//     label: "State",
//   },
//   {
//     name: "address.zip",
//     type: "text",
//     placeholder: "Zip",
//     autocomplete: "postal-code",
//     // pattern: "^d{5}(-d{4})?$",
//     label: "Zip code",
//   },
// ]

// export default fields

function getDateOfBirth(age = 16) {
  // Get the current date
  const currentDate = new Date()

  // Calculate the date that is 'age' years ago
  const birthDate = new Date()
  birthDate.setFullYear(currentDate.getFullYear() - age)

  // Format the date as YYYY-MM-DD
  const year = birthDate.getFullYear()
  const month = (birthDate.getMonth() + 1).toString().padStart(2, "0")
  const day = birthDate.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}

const fields = [
  // {
  //   name: "first_name",
  //   type: "text",
  //   label: "First Name",
  //   autocomplete: "given-name",
  //   placeholder: "Enter your first name",
  //   validation: {
  //     required: true,
  //     minLength: 2,
  //     maxLength: 50,
  //   },
  // },
  // {
  //   name: "last_name",
  //   type: "text",
  //   label: "Last Name",
  //   placeholder: "Enter your last name",
  //   autocomplete: "family-name",
  //   validation: {
  //     required: true,
  //     minLength: 2,
  //     maxLength: 50,
  //   },
  // },
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Enter your name",
    required: true,
    pattern: "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$",
    error: "Name must contain only letters",
    maxLength: 30,
    minLength: 3,
  },
  {
    name: "birthdate",
    type: "date",
    autocomplete: "bday",
    min: getDateOfBirth(40),
    max: getDateOfBirth(16),
    label: "Birthdate",
    placeholder: "Enter your birthdate",
  },
  {
    name: "gender",
    type: "radio",
    autocomplete: "sex",
    label: "Gender",
    options: [
      { value: "MALE", label: "Male" },
      { value: "FEMALE", label: "Female" },
    ],
  },
  {
    name: "type",
    label: "User Type",
    type: "select",
    placeholder: "Select your user type",
    options: [
      { value: "MEMBER", label: "Member" },
      { value: "EMPLOYEE", label: "Employee" },
      { value: "EMPLOYER", label: "Employer" }, // fixed typo
    ],
  },
  {
    name: "username",
    type: "text",
    label: "Username",
    autocomplete: "username",
    placeholder: "Enter your username address",
    required: true,
    pattern: "^[a-zA-Z0-9._-]{3,}$",
    error:
      "Invalid username. Please enter a username consisting of at least three alphanumeric characters, periods, underscores, or hyphens.",
    text: "You can change your username only three times.",
  },
  {
    name: "email",
    type: "email",
    label: "Email (read only)",
    readonly: true,
    disabled: true,
    placeholder: "Enter your email address",
    required: true,
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}",
    // error: "Please enter a valid email address.",
  },
  // {
  //   name: "password",
  //   type: "password",
  //   label: "Password",
  //   autocomplete: "new-password", // changed from "current-password"
  //   placeholder: "Enter a strong password",
  //   required: true,
  //   disabled: true,
  //   minLength: 8,
  //   maxLength: 50,
  //   pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$", // fixed pattern
  //   // error:
  //   //   "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one number.",
  //   // text: "Your password should be at least 8 characters long and include a mix of letters, numbers, and symbols.",
  // },
  // {
  //   name: "phone",
  //   type: "tel",
  //   as: "string",
  //   label: "Phone",
  //   autocomplete: "tel",
  //   placeholder: "+216 54466551",
  //   required: true,
  //   pattern: "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s./0-9]*$", // changed pattern to allow various phone formats
  //   error:
  //     "Please enter a valid phone number. You can use digits, spaces, parentheses, hyphens, dots, and slashes (+ symbol allowed at the beginning).",
  //   text: "Please enter your phone number including country code and area code, if applicable.",
  // },

  // {
  //   name: "emailUpdates",
  //   type: "checkbox",
  //   label: "Receive Email Updates",
  //   caption: "Would you like to receive email updates?",
  // },

  // {
  //   name: "hobbies[]",
  //   type: "select",
  //   options: ["Gaming", "Reading", "TV", "Music"],
  //   validation: {
  //     required: true,
  //     minItems: 1,
  //   },
  //   label: "Hobbies",
  // },
  {
    name: "address.country",
    label: "Country",
    type: "select",
    placeholder: "Select your country",
    options: Object.entries(countries.getNames("en")).map(([code, name]) => ({
      value: code,
      label: getFlagEmoji(code) + " " + name,
    })),
  },
  // {
  //   name: "address.state",
  //   type: "text",
  //   placeholder: "Bizerte",
  //   autocomplete: "address-line1",
  //   minLength: 2,
  //   maxLength: 50,
  //   label: "State/Province/Region",
  // },
  {
    name: "address.city",
    type: "text",
    placeholder: "City",
    validation: {
      minLength: 2,
      maxLength: 50,
    },
    label: "City",
    autocomplete: "address-level2",
  },
  {
    name: "address.zip",
    type: "text",
    placeholder: "Zip code aka postal code",
    autocomplete: "postal-code",
    // pattern: "^d{5}(-d{4})?$",
    label: "Zip code",
  },
  {
    name: "address.street",
    type: "text",
    autocomplete: "street-address",
    placeholder: "123 Main Street, Apartment 4B",
    minLength: 2,
    maxLength: 100,
    label: "Street",
  },
  // {
  //   name: "address.name",
  //   type: "text",
  //   autocomplete: "address",
  //   placeholder: "17 Rue de la Liberté, Sidi Salem, Bizerte 7000, Tunisia",
  //   minLength: 5,
  //   maxLength: 100,
  //   label: "Full address",
  // },
  {
    name: "position",
    type: "text",
    // autocomplete: "organization-title",
    placeholder: "Position",
    maxLength: 20,
    label: "Position (job position)",
  },
  {
    name: "bio",
    type: "textarea",
    placeholder: "Bio",
    maxLength: 500,
  },
]

export default fields
