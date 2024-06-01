import { useFonts } from 'expo-font';
// if not working, run sa terminal npx expo install @expo-google-fonts/poppins
import {
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black
} from '@expo-google-fonts/poppins';

export const usePoppinsFonts = () => {
    const [fontsLoaded] = useFonts({
        Poppins_100Thin,
        Poppins_200ExtraLight,
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
        Poppins_800ExtraBold,
        Poppins_900Black
    });

    // usePoppinsFonts();

    return {
        thin: { fontFamily: 'Poppins_100Thin' },
        extraLight: { fontFamily: 'Poppins_200ExtraLight' },
        light: { fontFamily: 'Poppins_300Light' },
        regular: { fontFamily: 'Poppins_400Regular' },
        medium: { fontFamily: 'Poppins_500Medium' },
        semiBold: { fontFamily: 'Poppins_600SemiBold' },
        bold: { fontFamily: 'Poppins_700Bold' },
        extraBold: { fontFamily: 'Poppins_800ExtraBold' },
        black: { fontFamily: 'Poppins_900Black' },
        fontsLoaded
    };
};

// export default {
//     thin: "Poppins_100Thin",
//     bold: "Poppins_700Bold",
// }


/* Monserrat Font
import {
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black
} from '@expo-google-fonts/montserrat';

export const useMontserratFonts = () => {
    const [fontsLoaded] = useFonts({
        Montserrat_100Thin,
        Montserrat_200ExtraLight,
        Montserrat_300Light,
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
        Montserrat_800ExtraBold,
        Montserrat_900Black
    });

    return {
        thin: { fontFamily: 'Montserrat_100Thin' },
        extraLight: { fontFamily: 'Montserrat_200ExtraLight' },
        light: { fontFamily: 'Montserrat_300Light' },
        regular: { fontFamily: 'Montserrat_400Regular' },
        medium: { fontFamily: 'Montserrat_500Medium' },
        semiBold: { fontFamily: 'Montserrat_600SemiBold' },
        bold: { fontFamily: 'Montserrat_700Bold' },
        extraBold: { fontFamily: 'Montserrat_800ExtraBold' },
        black: { fontFamily: 'Montserrat_900Black' },
        fontsLoaded
    };
};
*/
