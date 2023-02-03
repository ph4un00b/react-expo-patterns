import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useCallback, useState } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
    Gesture,
    GestureDetector,
    RectButton,
} from "react-native-gesture-handler";

export const profiles: ProfileModel[] = [
    {
        id: "1",
        name: "Caroline",
        age: 24,
        profile: require("./assets/necro.webp"),
    },
    {
        id: "2",
        name: "Jack",
        age: 30,
        profile: require("./assets/necro.webp"),
    },
    {
        id: "3",
        name: "Anet",
        age: 21,
        profile: require("./assets/necro.webp"),
    },
    {
        id: "4",
        name: "John",
        age: 28,
        profile: require("./assets/necro.webp"),
    },
];

export function GestureTinder() {
    return <Profiles {...{ profiles }} />;
}

interface ProfilesProps {
    profiles: ProfileModel[];
}

export function Profiles({ profiles: defaultProfiles }: ProfilesProps) {
    const [profiles, setProfiles] = useState(defaultProfiles);
    const onSwipe = useCallback(() => {
        setProfiles(profiles.slice(0, profiles.length - 1));
    }, [profiles]);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.screenHeader}>
                <Icon name="user" size={32} color="gray" />
                <Icon name="message-circle" size={32} color="gray" />
            </View>
            <View style={styles.cards}>
                {profiles.map((profile, index) => {
                    const onTop = index === profiles.length - 1;
                    return (
                        <Swipeable
                            key={profile.id}
                            profile={profile}
                            onSwipe={onSwipe}
                            onTop={onTop}
                        />
                    );
                })}
            </View>
            <View style={styles.screenFooter}>
                <RectButton style={styles.circle}>
                    <Icon name="x" size={32} color="#ec5288" />
                </RectButton>
                <RectButton style={styles.circle}>
                    <Icon name="heart" size={32} color="#6ee3b4" />
                </RectButton>
            </View>
        </SafeAreaView>
    );
}

interface SwiperProps {
    onSwipe: () => void;
    profile: ProfileModel;
    onTop: boolean;
}

export function Swipeable({ profile, onTop }: SwiperProps) {
    const gesture = Gesture.Pan();
    return (
        <GestureDetector gesture={gesture}>
            <Profile profile={profile} onTop={onTop} />
        </GestureDetector>
    );
}

export interface ProfileModel {
    id: string;
    name: string;
    age: number;
    profile: number;
}

export const α = Math.PI / 12;

interface CardProps {
    profile: ProfileModel;
    onTop: boolean;
}

export function Profile({ profile }: CardProps) {
    return (
        <View style={[StyleSheet.absoluteFill]}>
            <Image style={styles.image} source={profile.profile} />
            <View style={styles.overlay}>
                <View style={styles.cardHeader}>
                    <View style={[styles.like]}>
                        <Text style={styles.likeLabel}>LIKE</Text>
                    </View>
                    <View style={[styles.nope]}>
                        <Text style={styles.nopeLabel}>NOPE</Text>
                    </View>
                </View>
                <View style={styles.cardFooter}>
                    <Text style={styles.name}>{profile.name}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        justifyContent: "space-evenly",
    },
    screenHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
    },
    cards: {
        flex: 1,
        marginHorizontal: 16,
        zIndex: 100,
    },
    screenFooter: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: 16,
    },
    circle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        shadowColor: "gray",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 2,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
        borderRadius: 8,
    },
    overlay: {
        flex: 1,
        justifyContent: "space-between",
        padding: 16,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cardFooter: {
        flexDirection: "row",
    },
    name: {
        color: "white",
        fontSize: 32,
    },
    like: {
        borderWidth: 4,
        borderRadius: 5,
        padding: 8,
        borderColor: "#6ee3b4",
    },
    likeLabel: {
        fontSize: 32,
        color: "#6ee3b4",
        fontWeight: "bold",
    },
    nope: {
        borderWidth: 4,
        borderRadius: 5,
        padding: 8,
        borderColor: "#ec5288",
    },
    nopeLabel: {
        fontSize: 32,
        color: "#ec5288",
        fontWeight: "bold",
    },
});
