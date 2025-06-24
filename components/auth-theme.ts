import { Theme } from "@aws-amplify/ui-react"

export const authTheme: Theme = {
  name: "auth-theme",
  tokens: {
    colors: {
      brand: {
        primary: {
          "10": "{colors.green.100}",
          "20": "{colors.green.90}",
          "40": "{colors.green.60}",
          "60": "{colors.green.60}",
          "80": "{colors.emerald.600}",
          "90": "{colors.emerald.500}",
          "100": "{colors.emerald.400}",
        },
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: "{colors.brand.primary.80}",
          _hover: {
            backgroundColor: "{colors.brand.primary.90}",
          },
        },
      },
      fieldcontrol: {
        _focus: {
          borderColor: "{colors.brand.primary.90}",
          boxShadow: "0 0 0 1px {colors.brand.primary.90}",
        },
      },
    },
  },
} 