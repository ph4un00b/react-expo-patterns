import { ReactElement } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
const { width } = Dimensions.get("window");

const ASPECT_RATIO = 228 / 362;
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = CARD_WIDTH * ASPECT_RATIO;

const assets = [
    require("./assets/necro.webp"),
    require("./assets/necro.webp"),
    require("./assets/necro.webp"),
    require("./assets/necro.webp"),
    require("./assets/necro.webp"),
    require("./assets/necro.webp"),
];

enum Cards {
    Card1 = 0,
    Card2 = 1,
    Card3 = 2,
    Card4 = 3,
    Card5 = 4,
    Card6 = 5,
}

const cards = [Cards.Card1, Cards.Card2, Cards.Card3, Cards.Card4];

export function GestureSortableScreen() {
    return (
        <SortableList item={{ width, height: CARD_HEIGHT + 32 }}>
            {cards.map((card, index) => (
                <View style={styles.card} key={index}>
                    <Card card={card} />
                </View>
            ))}
        </SortableList>
    );
}

interface CardProps {
    card: Cards;
}

function Card({ card }: CardProps) {
    return <Image style={styles.cardImg} source={assets[card]} />;
}

interface SortableListProps {
    children: ReactElement[];
    item: { width: number; height: number };
}

function SortableList({ children }: SortableListProps) {
    return <ScrollView>{children}</ScrollView>;
}

const styles = StyleSheet.create({
    card: {
        height: CARD_HEIGHT,
        width: "100%",
        alignItems: "center",
        marginTop: 32,
    },
    cardImg: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 16,
    },
});
