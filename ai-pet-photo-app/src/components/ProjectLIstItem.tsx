import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useThemeContext } from "../../state/context/ThemeContext";
import { Theme } from "../../styles";

interface ProjectListItemProps {
  image: string;
  title: string;
  onPress: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}
export const ProjectListItem = ({
  image,
  title,
  onPress,
  isFirst,
  isLast,
}: ProjectListItemProps) => {
  const themeContext = useThemeContext();
  const theme = themeContext.state.theme;

  const styles = createStyles(theme);
  let containerStyle: StyleProp<ViewStyle>;
  if (isFirst && isLast) {
    containerStyle = styles.onlyItem;
  } else if (isFirst) {
    containerStyle = styles.firstItem;
  } else if (isLast) {
    containerStyle = styles.lastItem;
  } else {
    containerStyle = styles.listItem;
  }

  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <View style={styles.listItemInner}>
        <View>
          <Image style={styles.image} source={{ uri: image }} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}> Created: 12/17/22</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    listItem: {
      height: 60,
      width: "90%",
      marginBottom: theme.spacing.s,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.foreground,
      display: "flex",
      padding: theme.spacing.m,
      paddingBottom: theme.spacing.xl,
    },
    firstItem: {
      height: 60,
      width: "90%",
      marginBottom: theme.spacing.s,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.foreground,
      display: "flex",
      padding: theme.spacing.m,
      paddingBottom: theme.spacing.xl,
      marginTop: 20,
      borderTopStartRadius: 10,
      borderTopEndRadius: 10,
    },
    onlyItem: {
      height: 60,
      width: "90%",
      marginBottom: 3,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.foreground,
      display: "flex",
      padding: 10,
      paddingBottom: 40,
      marginTop: 20,
      borderRadius: 10,
    },
    lastItem: {
      height: 60,
      width: "90%",
      marginBottom: 3,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.foreground,
      display: "flex",
      padding: 10,
      paddingBottom: 40,
      borderBottomStartRadius: 10,
      borderBottomEndRadius: 10,
    },
    textContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginLeft: 10,
    },
    listItemInner: {
      width: "100%",
      height: "100%",
      paddingBottom: 30,
      flexDirection: "row",
    },
    image: {
      height: theme.spacing.xl,
      aspectRatio: 1,
      resizeMode: "contain",
      borderRadius: 10,
      margin: theme.spacing.s,
    },
    title: {
      height: 25,
      fontSize: 15,
      paddingLeft: 10,
      fontFamily: theme.textVariants.header.fontFamily,
      paddingTop: 5,
      color: theme.colors.text,
    },
    text: {
      height: 20,
      fontSize: 11,
      paddingLeft: 10,
      fontFamily: theme.textVariants.body.fontFamily,
      paddingTop: 5,
      color: theme.colors.text,
    },
  });
};
