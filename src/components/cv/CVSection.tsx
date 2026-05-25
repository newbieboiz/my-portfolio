import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
  },
  heading: {
    fontFamily: "Courier-Bold",
    fontSize: 8,
    color: "#00dc82",
    letterSpacing: 1.2,
    marginBottom: 3,
    textTransform: "uppercase",
  },
  rule: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#c8c8d0",
    borderBottomStyle: "solid",
    marginBottom: 6,
  },
  body: {},
});

export function CVSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.rule} />
      <View style={styles.body}>{children}</View>
    </View>
  );
}
