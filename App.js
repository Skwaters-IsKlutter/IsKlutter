import React from 'react';
import { NativeBaseProvider, VStack, Text, Image, Center } from 'native-base';

export default function App() {
	return (
		<NativeBaseProvider>
			<VStack width={"100%"} height={"100%"} alignItems="center" justifyContent="center" space="2">
				<Center>
					<Text fontSize="4xl" color="#5C0001" bottom={200} bold>Welcome to IsKlutter</Text>
					<Image source={require("./assets/img/logo-1.png")} width={200} height={200} alt="logo"></Image>
				</Center>
			</VStack>
		</NativeBaseProvider>
	);
}