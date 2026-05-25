import { View, Text, StyleSheet } from "@react-pdf/renderer";

interface CVHeaderProps {
  name: string;
  title: string;
  email: string;
  github: string;
  linkedin: string;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#00dc82",
    borderBottomStyle: "solid",
  },
  left: {
    flexDirection: "column",
  },
  name: {
    fontFamily: "Courier-Bold",
    fontSize: 18,
    color: "#1a1a25",
    marginBottom: 2,
  },
  jobTitle: {
    fontFamily: "Courier",
    fontSize: 10,
    color: "#45455a",
  },
  right: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  contactItem: {
    fontFamily: "Courier",
    fontSize: 8,
    color: "#6b6b80",
    marginBottom: 2,
  },
});

export function CVHeader({
  name,
  title,
  email,
  github,
  linkedin,
}: CVHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.jobTitle}>{title}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.contactItem}>{email}</Text>
        <Text style={styles.contactItem}>{github}</Text>
        <Text style={styles.contactItem}>{linkedin}</Text>
      </View>
    </View>
  );
}
