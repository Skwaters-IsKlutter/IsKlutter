import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import AddPost from '../../src/AddPost.js';

export default function AddPostScreen() {
	return (
		<GluestackUIProvider>
			<Center>
				<AddPost />
			</Center>
		</GluestackUIProvider>
	);
}