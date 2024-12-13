import { extendTheme } from "@chakra-ui/react";

// Colores
const colors = {
    primario: {
        1: "#FDA633",
        2: "#9B3922"
    },
    secundario: {
        1: '#481E14',
        2: 'black'
    }
}

// Extiende el tema de Chakra
const theme = extendTheme({
    colors,
    fonts: {
        body: '"Poppins", sans-serif',
        heading: '"Poppins", sans-serif',
        mono: '"Poppins", sans-serif',
    },
    fontWeights: {
        normal: 400,
        medium: 500,
        bold: 700
    }
})

export default theme;