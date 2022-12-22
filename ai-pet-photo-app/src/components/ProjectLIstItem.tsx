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
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: image }} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>Created: 12/17/22</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    listItem: {
      height: 128,
      width: "90%",
      marginBottom: theme.spacing.s,
      backgroundColor: theme.colors.foreground,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    firstItem: {
      height: 128,
      width: "90%",
      marginBottom: theme.spacing.s,
      backgroundColor: theme.colors.foreground,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderTopStartRadius: 10,
      borderTopEndRadius: 10,
    },
    onlyItem: {
      height: 64,
      width: "90%",
      marginBottom: theme.spacing.s,
      backgroundColor: theme.colors.foreground,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },
    lastItem: {
      height: 128,
      width: "90%",
      marginBottom: theme.spacing.s,
      backgroundColor: theme.colors.foreground,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderBottomStartRadius: 10,
      borderBottomEndRadius: 10,
    },
    textContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "flex-start",
      marginLeft: theme.spacing.s,
    },
    imageContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: theme.spacing.m,
    },
    listItemInner: {
      height: "100%",
      width: "100%",
      flexDirection: "row",
    },
    image: {
      height: 96,
      aspectRatio: 1,
      resizeMode: "contain",
      borderRadius: 10,
    },
    title: {
      fontSize: 15,
      paddingLeft: theme.spacing.s,
      fontFamily: theme.textVariants.header.fontFamily,
      paddingTop: theme.spacing.s,
      color: theme.colors.text,
    },
    text: {
      fontSize: 11,
      paddingLeft: theme.spacing.s,
      fontFamily: theme.textVariants.body.fontFamily,
      paddingTop: theme.spacing.s,
      color: theme.colors.text,
    },
  });
};
