import React from 'react';
import {
    View,
    Image
} from '@gluestack-ui/themed';
import Carousel from 'react-native-reanimated-carousel';

export default function ImgCarousel() {
    const carouselPics = [
        require('../../assets/img/item.jpg'),
        require('../../assets/img/item2.jpg'),
    ]

    const renderCarousel = () => {
        return carouselPics.map((item, index) => {
            <View key={index}>
                <Image image={item.source} />
            </View>
        });
    }

    const CarouselCards = () => {
        const isCarousel = React.useRef(null)

    return (
        <Carousel 
            ref={isCarousel}
            renderItem={renderCarousel}
            data={carouselPics}
        />
    )}
}